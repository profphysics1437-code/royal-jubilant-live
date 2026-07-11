export const dynamic = "force-dynamic";

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

interface Post { id: string; title: string; excerpt: string; category: string; readTime: string; authorName: string; image: string; content?: string; published: boolean; date: string; }

export default function AdminBlog() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | "new" | null>(null);

  const load = () => { setLoading(true); fetch("/api/admin/blog").then((r) => r.json()).then((d) => { setItems(d.blogPosts || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/blog/${id}`, { method: "DELETE" }); toast.success("Post deleted"); load(); };

  return (
    <div>
      <AdminPageHeader
        title="Blog Posts"
        subtitle="Market insights, guides and news published on the website."
        action={<Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> New Post</Button>}
      />
      {loading ? <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div> : (
        <AdminTable headers={["Title", "Category", "Author", "Read Time", "Status", "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={6} label="No posts yet." /> : items.map((p) => (
            <tr key={p.id} className="hover:bg-[#F9FAFB]/50">
              <td className="px-4 py-3">
                <div className="font-medium text-[#0A1F44] line-clamp-1">{p.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-1">{p.excerpt}</div>
              </td>
              <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-[#F9FAFB]">{p.category}</span></td>
              <td className="px-4 py-3 text-xs">{p.authorName}</td>
              <td className="px-4 py-3 text-xs">{p.readTime}</td>
              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${p.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{p.published ? "Published" : "Draft"}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => setEditing(p)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center"><Pencil className="size-3.5 text-[#A68A3F]" /></button>
                  <button onClick={() => handleDelete(p.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {editing && <BlogForm post={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function BlogForm({ post, onClose, onSaved }: { post: Post | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(post ? { ...post } : { title: "", excerpt: "", category: "Market Insights", readTime: "5 min", authorName: "Royal Jubilant", image: "", content: "", published: true });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = post ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = post ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      toast.success(post ? "Post updated" : "Post created");
      onSaved();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between"><h2 className="font-serif text-xl font-medium">{post ? "Edit Post" : "New Post"}</h2><button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button></div>
        <div className="p-6 space-y-4">
          <Field label="Title *"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Category"><Input value={form.category} onChange={(e) => set("category", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Author"><Input value={form.authorName} onChange={(e) => set("authorName", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Read Time"><Input value={form.readTime} onChange={(e) => set("readTime", e.target.value)} className="bg-[#F9FAFB]" placeholder="5 min" /></Field>
          </div>
          <Field label="Featured Image"><MediaUploadField value={form.image} onChange={(url) => set("image", url)} folder="blog" type="image" /></Field>
          <Field label="Excerpt"><Textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none" /></Field>
          <Field label="Content"><Textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={8} className="bg-[#F9FAFB] resize-none" /></Field>
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
