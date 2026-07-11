"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, X, Save, Loader2, Star, Upload } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const load = () => { setLoading(true); fetch("/api/admin/testimonials").then((r) => r.json()).then((d) => { setItems(d.testimonials || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };

  return (
    <div>
      <AdminPageHeader title="Testimonials" subtitle="Client testimonials displayed on the homepage."
        action={<Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add</Button>} />
      {loading ? <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div> : (
        <AdminTable headers={["Client", "Role", "Rating", "Quote", "Status", "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={6} label="No testimonials yet." /> : items.map((t) => (
            <tr key={t.id} className="hover:bg-[#F9FAFB]/50">
              <td className="px-4 py-3"><div className="flex items-center gap-2"><img src={t.avatar} alt="" className="size-8 rounded-full object-cover" /><span className="font-medium text-sm">{t.name}</span></div></td>
              <td className="px-4 py-3 text-xs">{t.role}</td>
              <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs"><Star className="size-3 fill-[#C9A961] text-[#A68A3F]" />{t.rating}</span></td>
              <td className="px-4 py-3 text-xs text-muted-foreground line-clamp-1 max-w-xs">{t.quote}</td>
              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${t.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{t.published ? "Published" : "Draft"}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => setEditing(t)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center text-xs">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {editing && <TestimonialForm item={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function TestimonialForm({ item, onClose, onSaved }: { item: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(item ? { ...item } : { name: "", role: "", location: "", avatar: "", rating: 5, quote: "", service: "", published: true });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("folder", "testimonials");
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      const data = await res.json();
      setForm({ ...form, avatar: data.files[0].url });
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const url = item ? `/api/admin/testimonials/${item.id}` : "/api/admin/testimonials";
      const method = item ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success("Saved"); onSaved();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };
  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between"><h2 className="font-serif text-xl font-medium">{item ? "Edit Testimonial" : "Add Testimonial"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Role"><Input value={form.role} onChange={(e) => set("role", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Location"><Input value={form.location} onChange={(e) => set("location", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Service"><Input value={form.service} onChange={(e) => set("service", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Rating"><Input type="number" min="1" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <Field label="Client Photo">
            <div className="flex items-center gap-3">
              {form.avatar && (
                <img src={form.avatar} alt="avatar" className="size-16 rounded-full object-cover border border-border" />
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="rounded-full"
              >
                {uploading ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Upload className="size-4 mr-1.5" />}
                Upload Photo
              </Button>
              {form.avatar && (
                <Button type="button" variant="ghost" onClick={() => set("avatar", "")} className="text-red-600">
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Or paste a URL below</p>
            <Input value={form.avatar} onChange={(e) => set("avatar", e.target.value)} className="bg-[#F9FAFB] mt-1" placeholder="https://..." />
          </Field>
          <Field label="Quote *"><Textarea value={form.quote} onChange={(e) => set("quote", e.target.value)} rows={4} className="bg-[#F9FAFB] resize-none" /></Field>
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
