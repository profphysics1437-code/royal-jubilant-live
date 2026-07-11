export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, X, FileText, Eye, ExternalLink, Copy } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

interface LandingPage {
  id?: string;
  title: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  body: string;
  heroImage: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

const statusStyles: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  published: "bg-green-100 text-green-700",
  archived: "bg-red-100 text-red-700",
};

export default function LandingPagesAdminPage() {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<LandingPage | "new" | null>(null);
  const [previewing, setPreviewing] = useState<LandingPage | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/pages").then((r) => r.json()).then((d) => {
      setPages(d.pages || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (page: LandingPage) => {
    setSaving(true);
    try {
      if (page.id) {
        const res = await fetch(`/api/admin/pages/${page.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(page),
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || "Failed");
        }
        toast.success("Page updated");
      } else {
        const res = await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(page),
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || "Failed");
        }
        toast.success("Page created");
      }
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete landing page "${title}"?`)) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE" });
    toast.success("Page deleted");
    load();
  };

  const toggleStatus = async (page: LandingPage) => {
    const newStatus = page.status === "published" ? "draft" : "published";
    await fetch(`/api/admin/pages/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    toast.success(`Page ${newStatus}`);
    load();
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
    toast.success("Link copied");
  };

  const filtered = filter === "all" ? pages : pages.filter((p) => p.status === filter);

  const stats = {
    total: pages.length,
    published: pages.filter((p) => p.status === "published").length,
    drafts: pages.filter((p) => p.status === "draft").length,
  };

  return (
    <div>
      <AdminPageHeader
        title="Landing Pages"
        subtitle="Build custom marketing pages for property launches, campaigns, and lead capture. Each page has a unique URL at /p/{slug}."
        action={
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> New Page
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Total Pages</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{stats.total}</div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-green-700">Published</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{stats.published}</div>
        </AdminCard>
        <AdminCard className="p-5">
          <div className="text-[10px] tracking-luxury uppercase text-muted-foreground">Drafts</div>
          <div className="font-serif text-2xl lg:text-3xl font-semibold text-[#0A1F44] mt-1">{stats.drafts}</div>
        </AdminCard>
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "published", "draft", "archived"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors capitalize ${
              filter === f
                ? "bg-[#0A1F44] text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#C9A961]" />
        </div>
      ) : filtered.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <FileText className="size-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-serif text-lg text-[#0A1F44] mb-2">No landing pages yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first landing page for a property launch, marketing campaign, or seasonal offer.
          </p>
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> Create First Page
          </Button>
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {filtered.map((p) => (
            <AdminCard key={p.id} className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status] || statusStyles.draft}`}>
                    {p.status}
                  </span>
                  <code className="text-[10px] text-muted-foreground">/p/{p.slug}</code>
                  {p.publishedAt && (
                    <span className="text-[10px] text-muted-foreground">
                      Published {new Date(p.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-base font-medium text-[#0A1F44]">{p.title}</h3>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{p.headline}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setPreviewing(p)}
                  className="size-8 rounded-lg hover:bg-muted flex items-center justify-center"
                  title="Preview"
                >
                  <Eye className="size-3.5" />
                </button>
                <button
                  onClick={() => copyLink(p.slug)}
                  className="size-8 rounded-lg hover:bg-muted flex items-center justify-center"
                  title="Copy link"
                >
                  <Copy className="size-3.5" />
                </button>
                {p.status === "published" && (
                  <a
                    href={`/p/${p.slug}`}
                    target="_blank"
                    className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-[#0A1F44]"
                    title="Open page"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
                <button
                  onClick={() => toggleStatus(p)}
                  className="text-xs px-2 py-1.5 rounded-lg hover:bg-[#C9A961]/15 text-[#A68A3F] font-medium"
                  title={p.status === "published" ? "Unpublish" : "Publish"}
                >
                  {p.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => setEditing(p)}
                  className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-[#0A1F44]"
                  title="Edit"
                >
                  <FileText className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id!, p.title)}
                  className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {editing && (
        <PageEditor
          page={editing === "new" ? {
            title: "", slug: "", headline: "", subheadline: null, body: "",
            heroImage: null, ctaText: null, ctaLink: null,
            seoTitle: null, seoDescription: null, status: "draft", publishedAt: null, createdAt: "",
          } : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {previewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl font-medium text-[#0A1F44]">Preview: {previewing.title}</h2>
              <button onClick={() => setPreviewing(null)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-6">
              {previewing.heroImage && (
                <img src={previewing.heroImage} alt="" className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <h1 className="font-serif text-2xl font-medium text-[#0A1F44]">{previewing.headline}</h1>
              {previewing.subheadline && (
                <p className="text-sm text-muted-foreground mt-2">{previewing.subheadline}</p>
              )}
              <div
                className="landing-body-preview mt-4 p-4 bg-[#F9FAFB] rounded-lg"
                dangerouslySetInnerHTML={{ __html: previewing.body }}
              />
              {previewing.ctaText && (
                <div className="mt-4">
                  <button className="bg-[#0A1F44] text-white px-4 py-2 rounded-lg text-sm">
                    {previewing.ctaText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageEditor({ page, saving, onClose, onSave }: {
  page: LandingPage;
  saving: boolean;
  onClose: () => void;
  onSave: (p: LandingPage) => void;
}) {
  const [form, setForm] = useState<LandingPage>(page);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl font-medium text-[#0A1F44]">
            {page.id ? "Edit Landing Page" : "New Landing Page"}
          </h2>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Page Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Slug * (URL: /p/{form.slug || "..."})</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={!!page.id}
                placeholder="downtown-investment-launch"
              />
            </div>
          </div>

          <div>
            <Label>Headline *</Label>
            <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </div>

          <div>
            <Label>Subheadline</Label>
            <Textarea
              value={form.subheadline || ""}
              onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
              rows={2}
            />
          </div>

          <div>
            <Label>Body Content (HTML)</Label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={8}
              className="font-mono text-xs"
              placeholder="<h2>About this opportunity</h2><p>...</p>"
            />
          </div>

          <div>
            <Label>Hero Image</Label>
            <MediaUploadField
              value={form.heroImage || ""}
              onChange={(url) => setForm({ ...form, heroImage: url })}
              folder="landing-pages"
              type="image"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>CTA Text</Label>
              <Input
                value={form.ctaText || ""}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="Schedule a Viewing"
              />
            </div>
            <div>
              <Label>CTA Link</Label>
              <Input
                value={form.ctaLink || ""}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="/contact or tel:+971..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>SEO Title</Label>
              <Input
                value={form.seoTitle || ""}
                onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <Label>SEO Description</Label>
            <Textarea
              value={form.seoDescription || ""}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              rows={2}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-6 border-t border-border bg-[#F9FAFB]">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Save className="size-4 mr-1.5" />}
            {page.id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
