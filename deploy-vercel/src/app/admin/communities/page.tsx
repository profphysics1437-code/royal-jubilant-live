"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2 } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

export default function AdminCommunities() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const load = () => { setLoading(true); fetch("/api/admin/communities").then((r) => r.json()).then((d) => { setItems(d.communities || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/communities/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Communities" subtitle="Dubai neighbourhoods featured on the website."
        action={<Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Community</Button>} />
      {loading ? <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div> : (
        <AdminTable headers={["Name", "Avg Price", "ROI", "Properties", "Rating", "Status", "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={7} label="No communities yet." /> : items.map((c) => (
            <tr key={c.id} className="hover:bg-[#F9FAFB]/50">
              <td className="px-4 py-3 font-medium text-sm">{c.name}</td>
              <td className="px-4 py-3 text-xs">{c.averagePrice}</td>
              <td className="px-4 py-3 text-xs">{c.roi}</td>
              <td className="px-4 py-3 text-xs">{c.totalProperties}</td>
              <td className="px-4 py-3 text-xs">{c.rating}</td>
              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${c.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{c.published ? "Published" : "Draft"}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => setEditing(c)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center"><Pencil className="size-3.5 text-[#A68A3F]" /></button>
                  <button onClick={() => handleDelete(c.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {editing && <CommunityForm item={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function CommunityForm({ item, onClose, onSaved }: { item: any | null; onClose: () => void; onSaved: () => void }) {
  const parseArr = (v: string) => { try { return JSON.parse(v); } catch { return []; } };
  const [form, setForm] = useState<any>(item ? { ...item } : {
    name: "", shortName: "", hero: "", overview: "", lifestyle: "", averagePrice: "",
    pricePerSqft: "", roi: "", population: "", totalProperties: 0, rating: 4.5,
    highlights: [], schools: [], hospitals: [], transport: [], shopping: [],
    nearbyCommunities: [], stats: [], published: true,
  });
  const [highlightsText, setHighlightsText] = useState((item ? parseArr(item.highlights) : []).join("\n"));
  const [schoolsText, setSchoolsText] = useState((item ? parseArr(item.schools) : []).join("\n"));
  const [hospitalsText, setHospitalsText] = useState((item ? parseArr(item.hospitals) : []).join("\n"));
  const [transportText, setTransportText] = useState((item ? parseArr(item.transport) : []).join("\n"));
  const [shoppingText, setShoppingText] = useState((item ? parseArr(item.shopping) : []).join("\n"));
  const [nearbyText, setNearbyText] = useState((item ? parseArr(item.nearbyCommunities) : []).join("\n"));
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      highlights: highlightsText.split("\n").filter(Boolean),
      schools: schoolsText.split("\n").filter(Boolean),
      hospitals: hospitalsText.split("\n").filter(Boolean),
      transport: transportText.split("\n").filter(Boolean),
      shopping: shoppingText.split("\n").filter(Boolean),
      nearbyCommunities: nearbyText.split("\n").filter(Boolean),
    };
    try {
      const url = item ? `/api/admin/communities/${item.id}` : "/api/admin/communities";
      const method = item ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success("Saved"); onSaved();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between sticky top-0 z-10"><h2 className="font-serif text-xl font-medium">{item ? "Edit Community" : "Add Community"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Short Name"><Input value={form.shortName} onChange={(e) => set("shortName", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <Field label="Hero Image"><MediaUploadField value={form.hero} onChange={(url) => set("hero", url)} folder="communities" type="image" /></Field>
          <Field label="Overview"><Textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none" /></Field>
          <Field label="Lifestyle"><Textarea value={form.lifestyle} onChange={(e) => set("lifestyle", e.target.value)} rows={2} className="bg-[#F9FAFB] resize-none" /></Field>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Avg Price"><Input value={form.averagePrice} onChange={(e) => set("averagePrice", e.target.value)} className="bg-[#F9FAFB]" placeholder="AED 12.4M" /></Field>
            <Field label="Price/sqft"><Input value={form.pricePerSqft} onChange={(e) => set("pricePerSqft", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="ROI"><Input value={form.roi} onChange={(e) => set("roi", e.target.value)} className="bg-[#F9FAFB]" placeholder="5.2%" /></Field>
            <Field label="Population"><Input value={form.population} onChange={(e) => set("population", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Properties"><Input type="number" value={form.totalProperties} onChange={(e) => set("totalProperties", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Rating"><Input type="number" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Highlights (one per line)"><Textarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
            <Field label="Nearby communities (one per line)"><Textarea value={nearbyText} onChange={(e) => setNearbyText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Schools (one per line)"><Textarea value={schoolsText} onChange={(e) => setSchoolsText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
            <Field label="Hospitals (one per line)"><Textarea value={hospitalsText} onChange={(e) => setHospitalsText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Transport (one per line)"><Textarea value={transportText} onChange={(e) => setTransportText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
            <Field label="Shopping (one per line)"><Textarea value={shoppingText} onChange={(e) => setShoppingText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[#C9A961]" /><span className="text-sm">Published</span></label>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="bg-royal-gradient-diagonal text-white rounded-full flex-1">{saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> Save</>}</Button>
            <Button onClick={onClose} variant="outline" className="rounded-full">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium mb-1.5 block">{label}</Label>{children}</div>;
}
