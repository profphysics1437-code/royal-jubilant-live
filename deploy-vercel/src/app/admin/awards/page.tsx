"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Save, Loader2 } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminAwards() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const load = () => { setLoading(true); fetch("/api/admin/awards").then((r) => r.json()).then((d) => { setItems(d.awards || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/awards/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Awards" subtitle="Industry awards and recognition displayed on the homepage."
        action={<Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Award</Button>} />
      {loading ? <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div> : (
        <AdminTable headers={["Title", "Issuer", "Year", "Status", "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={5} label="No awards yet." /> : items.map((a) => (
            <tr key={a.id} className="hover:bg-[#F9FAFB]/50">
              <td className="px-4 py-3 font-medium text-sm">{a.title}</td>
              <td className="px-4 py-3 text-xs">{a.issuer}</td>
              <td className="px-4 py-3 text-xs">{a.year}</td>
              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${a.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{a.published ? "Published" : "Draft"}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => setEditing(a)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center text-xs">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {editing && <AwardForm item={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function AwardForm({ item, onClose, onSaved }: { item: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(item ? { ...item } : { title: "", issuer: "", year: new Date().getFullYear().toString(), icon: "award", published: true });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });
  const handleSave = async () => {
    setSaving(true);
    try {
      const url = item ? `/api/admin/awards/${item.id}` : "/api/admin/awards";
      const method = item ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success("Saved"); onSaved();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between"><h2 className="font-serif text-xl font-medium">{item ? "Edit Award" : "Add Award"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <Field label="Title *"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issuer"><Input value={form.issuer} onChange={(e) => set("issuer", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Year"><Input value={form.year} onChange={(e) => set("year", e.target.value)} className="bg-[#F9FAFB]" /></Field>
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
