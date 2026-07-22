"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Save, Loader2, Search } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

export default function SeoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);
  const [search, setSearch] = useState("");

  const load = () => { setLoading(true); fetch("/api/admin/seo").then((r) => r.json()).then((d) => { setItems(d.seo || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/seo/${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); };
  const filtered = items.filter((i) => i.pageSlug.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>;

  return (
    <div>
      <AdminPageHeader title="SEO Management" subtitle="Manage meta tags, Open Graph, Twitter Cards, and structured data for each page."
        action={<Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add SEO</Button>} />
      <div className="relative mb-4 max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#9CA3AF]" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search pages..." className="pl-9 h-9 bg-[#F9FAFB] text-sm" /></div>
      <AdminTable headers={["Page Slug", "Meta Title", "Meta Description", "Actions"]}>
        {filtered.length === 0 ? <EmptyRow colSpan={4} label="No SEO entries yet." /> : filtered.map((item) => (
          <tr key={item.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3 font-mono text-xs font-medium text-[#0A1F44]">/{item.pageSlug}</td>
            <td className="px-4 py-3 text-xs text-[#6B7280] max-w-xs truncate">{item.metaTitle || "—"}</td>
            <td className="px-4 py-3 text-xs text-[#9CA3AF] max-w-sm truncate">{item.metaDescription || "—"}</td>
            <td className="px-4 py-3"><div className="flex gap-1"><button onClick={() => setEditing(item)} className="px-2 py-1 text-xs text-[#0A1F44] hover:underline">Edit</button><button onClick={() => handleDelete(item.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button></div></td>
          </tr>
        ))}
      </AdminTable>
      {editing && <SeoEditor item={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function SeoEditor({ item, onClose, onSaved }: { item: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(item ? { ...item } : { pageSlug: "", metaTitle: "", metaDescription: "", canonicalUrl: "", ogTitle: "", ogDescription: "", ogImage: "", keywords: "", structuredData: "" });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    if (!form.pageSlug) { toast.error("Page slug required"); return; }
    setSaving(true);
    try {
      const url = item ? `/api/admin/seo/${item.id}` : "/api/admin/seo";
      const method = item ? "PATCH" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      toast.success("SEO saved"); onSaved();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between"><h2 className="font-serif text-xl font-medium">{item ? "Edit SEO" : "Add SEO"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <Field label="Page Slug * (e.g. rent, buy, about)"><Input value={form.pageSlug} onChange={(e) => set("pageSlug", e.target.value)} className="bg-[#F9FAFB]" placeholder="rent" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Meta Title"><Input value={form.metaTitle || ""} onChange={(e) => set("metaTitle", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Canonical URL"><Input value={form.canonicalUrl || ""} onChange={(e) => set("canonicalUrl", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <Field label="Meta Description"><Textarea value={form.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)} rows={2} className="bg-[#F9FAFB] resize-none" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="OG Title"><Input value={form.ogTitle || ""} onChange={(e) => set("ogTitle", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="OG Image"><MediaUploadField value={form.ogImage || ""} onChange={(url) => set("ogImage", url)} folder="seo" type="image" /></Field>
          </div>
          <Field label="OG Description"><Textarea value={form.ogDescription || ""} onChange={(e) => set("ogDescription", e.target.value)} rows={2} className="bg-[#F9FAFB] resize-none" /></Field>
          <Field label="Keywords (comma-separated)"><Input value={form.keywords || ""} onChange={(e) => set("keywords", e.target.value)} className="bg-[#F9FAFB]" placeholder="dubai, real estate, luxury" /></Field>
          <Field label="Structured Data (JSON-LD)"><Textarea value={form.structuredData || ""} onChange={(e) => set("structuredData", e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none font-mono text-xs" placeholder='{"@type":"RealEstateAgent",...}' /></Field>
          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]"><Button onClick={handleSave} disabled={saving} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full flex-1">{saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> Save SEO</>}</Button><Button onClick={onClose} variant="outline" className="rounded-full">Cancel</Button></div>
        </div>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium mb-1.5 block">{label}</Label>{children}</div>;
}
