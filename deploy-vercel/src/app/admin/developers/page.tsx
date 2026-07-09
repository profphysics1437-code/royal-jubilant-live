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

export default function AdminDevelopers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const load = () => { setLoading(true); fetch("/api/admin/developers").then((r) => r.json()).then((d) => { setItems(d.developers || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/developers/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Developers" subtitle="Master developers featured on the website."
        action={<Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Developer</Button>} />
      {loading ? <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div> : (
        <AdminTable headers={["Name", "Founded", "Projects", "Completed", "Ongoing", "Status", "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={7} label="No developers yet." /> : items.map((d) => (
            <tr key={d.id} className="hover:bg-[#F9FAFB]/50">
              <td className="px-4 py-3 font-medium text-sm">{d.name}</td>
              <td className="px-4 py-3 text-xs">{d.founded}</td>
              <td className="px-4 py-3 text-xs">{d.totalProjects}</td>
              <td className="px-4 py-3 text-xs">{d.completedProjects}</td>
              <td className="px-4 py-3 text-xs">{d.ongoingProjects}</td>
              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${d.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{d.published ? "Published" : "Draft"}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => setEditing(d)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center"><Pencil className="size-3.5 text-[#A68A3F]" /></button>
                  <button onClick={() => handleDelete(d.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {editing && <DeveloperForm item={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function DeveloperForm({ item, onClose, onSaved }: { item: any | null; onClose: () => void; onSaved: () => void }) {
  const parseArr = (v: string) => { try { return JSON.parse(v); } catch { return []; } };
  const [form, setForm] = useState<any>(item ? { ...item } : {
    name: "", logo: "", founded: "", headquarters: "", overview: "",
    totalProjects: 0, completedProjects: 0, ongoingProjects: 0,
    awards: [], hero: "", topProjects: [], published: true,
  });
  const [awardsText, setAwardsText] = useState((item ? parseArr(item.awards) : []).join("\n"));
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setSaving(true);
    const payload = { ...form, awards: awardsText.split("\n").filter(Boolean) };
    try {
      const url = item ? `/api/admin/developers/${item.id}` : "/api/admin/developers";
      const method = item ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success("Saved"); onSaved();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between"><h2 className="font-serif text-xl font-medium">{item ? "Edit Developer" : "Add Developer"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Founded"><Input value={form.founded} onChange={(e) => set("founded", e.target.value)} className="bg-[#F9FAFB]" placeholder="1997" /></Field>
          </div>
          <Field label="Headquarters"><Input value={form.headquarters} onChange={(e) => set("headquarters", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Logo"><MediaUploadField value={form.logo} onChange={(url) => set("logo", url)} folder="developers/logos" type="image" previewSize="sm" /></Field>
            <Field label="Hero Image"><MediaUploadField value={form.hero} onChange={(url) => set("hero", url)} folder="developers" type="image" /></Field>
          </div>
          <Field label="Overview"><Textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} rows={4} className="bg-[#F9FAFB] resize-none" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Total Projects"><Input type="number" value={form.totalProjects} onChange={(e) => set("totalProjects", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Completed"><Input type="number" value={form.completedProjects} onChange={(e) => set("completedProjects", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Ongoing"><Input type="number" value={form.ongoingProjects} onChange={(e) => set("ongoingProjects", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <Field label="Awards (one per line)"><Textarea value={awardsText} onChange={(e) => setAwardsText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
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
