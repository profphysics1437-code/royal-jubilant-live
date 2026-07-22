"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Save, Loader2, Eye, Calendar } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

export default function PopupsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);

  const load = () => { setLoading(true); fetch("/api/admin/popups").then((r) => r.json()).then((d) => { setItems(d.popups || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/popups/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const toggleActive = async (item: any) => { await fetch(`/api/admin/popups/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !item.active }) }); load(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>;

  return (
    <div>
      <AdminPageHeader title="Popup Manager" subtitle="Create promotional popups, announcements, and newsletter signups that appear on the website."
        action={<Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Popup</Button>} />
      <AdminTable headers={["Title", "Type", "Trigger", "Position", "Status", "Actions"]}>
        {items.length === 0 ? <EmptyRow colSpan={6} label="No popups yet." /> : items.map((item) => (
          <tr key={item.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3 font-medium text-[#0A1F44]">{item.title}</td>
            <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9FAFB] capitalize">{item.type}</span></td>
            <td className="px-4 py-3 text-xs text-[#6B7280] capitalize">{item.trigger}{item.delaySeconds > 0 ? ` (${item.delaySeconds}s)` : ""}</td>
            <td className="px-4 py-3 text-xs text-[#6B7280] capitalize">{item.position}</td>
            <td className="px-4 py-3"><button onClick={() => toggleActive(item)}><span className={`text-[10px] px-2 py-0.5 rounded-full ${item.active ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{item.active ? "Active" : "Inactive"}</span></button></td>
            <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => setEditing(item)} className="px-2 py-1 text-xs text-[#0A1F44] hover:underline">Edit</button><button onClick={() => handleDelete(item.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button></div></td>
          </tr>
        ))}
      </AdminTable>
      {editing && <PopupEditor popup={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function PopupEditor({ popup, onClose, onSaved }: { popup: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(popup ? { ...popup } : { title: "", content: "", type: "info", trigger: "immediate", delaySeconds: 0, position: "center", imageUrl: "", buttonText: "", buttonLink: "", active: true });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = popup ? `/api/admin/popups/${popup.id}` : "/api/admin/popups";
      const method = popup ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success(popup ? "Popup updated" : "Popup created"); onSaved();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between"><h2 className="font-serif text-xl font-medium">{popup ? "Edit Popup" : "Add Popup"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <Field label="Title *"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          <Field label="Content *"><Textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type"><select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm"><option value="info">Info</option><option value="promo">Promo</option><option value="announcement">Announcement</option><option value="newsletter">Newsletter</option></select></Field>
            <Field label="Trigger"><select value={form.trigger} onChange={(e) => set("trigger", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm"><option value="immediate">Immediate</option><option value="delayed">Delayed</option><option value="scroll">On Scroll</option><option value="exit">On Exit</option></select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Delay (seconds)"><Input type="number" value={form.delaySeconds} onChange={(e) => set("delaySeconds", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Position"><select value={form.position} onChange={(e) => set("position", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm"><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="bottom-right">Bottom Right</option></select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Button Text"><Input value={form.buttonText || ""} onChange={(e) => set("buttonText", e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. Learn More" /></Field>
            <Field label="Button Link"><Input value={form.buttonLink || ""} onChange={(e) => set("buttonLink", e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. /contact" /></Field>
          </div>
          <Field label="Popup Image (optional)"><MediaUploadField value={form.imageUrl || ""} onChange={(url) => set("imageUrl", url)} folder="popups" type="image" /></Field>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-[#F9FAFB]"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="size-4 accent-[#C9A961]" /><span className="text-sm">Active (visible on website)</span></label>
          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]"><Button onClick={handleSave} disabled={saving} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full flex-1">{saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> Save Popup</>}</Button><Button onClick={onClose} variant="outline" className="rounded-full">Cancel</Button></div>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium mb-1.5 block">{label}</Label>{children}</div>;
}
