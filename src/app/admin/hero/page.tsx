export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, ChevronUp, ChevronDown, X, Eye } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

interface Slide {
  id?: string;
  order: number;
  heading1: string;
  heading2: string;
  heading3: string | null;
  subtitle: string;
  published: boolean;
}

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Slide | "new" | null>(null);
  const [videoUrl, setVideoUrl] = useState("/dubai-skyline.mp4");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/hero-slides").then((r) => r.json()).then((d) => {
      setSlides(d.slides || []);
      setLoading(false);
    });
    // Also load hero settings
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => {
      const settings = d.settings || [];
      const videoSetting = settings.find((s: any) => s.key === "hero.videoUrl");
      if (videoSetting) setVideoUrl(videoSetting.value);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (slide: Slide) => {
    setSaving(true);
    try {
      if (slide.id) {
        await fetch(`/api/admin/hero-slides/${slide.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slide),
        });
        toast.success("Slide updated");
      } else {
        await fetch("/api/admin/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(slide),
        });
        toast.success("Slide created");
      }
      setEditing(null);
      load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    toast.success("Slide deleted");
    load();
  };

  const moveSlide = async (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    // Update order values
    newSlides.forEach((s, i) => { s.order = i; });
    setSlides(newSlides);
    // Save new order
    for (const s of newSlides) {
      if (s.id) {
        await fetch(`/api/admin/hero-slides/${s.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: s.order }),
        });
      }
    }
  };

  const togglePublished = async (slide: Slide) => {
    if (!slide.id) return;
    await fetch(`/api/admin/hero-slides/${slide.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !slide.published }),
    });
    load();
  };

  const saveVideoUrl = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: [{ key: "hero.videoUrl", value: videoUrl, category: "hero" }] }),
    });
    toast.success("Video URL saved");
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="Hero Section CMS"
        subtitle="Manage homepage hero slides, video background, and text. Changes appear instantly on the website."
        action={
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full">
            <Plus className="size-4 mr-1.5" /> Add Slide
          </Button>
        }
      />

      {/* Background Video — upload or paste URL */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 mb-6">
        <h3 className="font-serif text-lg font-medium text-[#0A1F44] mb-3">Background Video</h3>
        <MediaUploadField
          value={videoUrl}
          onChange={(url) => { setVideoUrl(url); }}
          folder="hero"
          type="video"
          showUrlInput={true}
        />
        <div className="mt-3">
          <Button onClick={saveVideoUrl} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full">
            <Save className="size-4 mr-1" /> Save Video Setting
          </Button>
        </div>
        <p className="text-xs text-[#9CA3AF] mt-2">Upload a background video for the homepage hero section. MP4 or WebM, max 100MB.</p>
      </div>

      {/* Slides list */}
      <div className="space-y-3">
        {slides.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280] mb-4">No slides yet. Click "Add Slide" to create your first hero slide.</p>
          </div>
        ) : (
          slides.map((slide, i) => (
            <div key={slide.id || i} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex items-center gap-4">
              {/* Order + controls */}
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => moveSlide(i, "up")} disabled={i === 0} className="size-7 rounded hover:bg-[#F9FAFB] flex items-center justify-center disabled:opacity-30">
                  <ChevronUp className="size-4 text-[#0A1F44]" />
                </button>
                <span className="text-xs font-bold text-[#9CA3AF] text-center">{i + 1}</span>
                <button onClick={() => moveSlide(i, "down")} disabled={i === slides.length - 1} className="size-7 rounded hover:bg-[#F9FAFB] flex items-center justify-center disabled:opacity-30">
                  <ChevronDown className="size-4 text-[#0A1F44]" />
                </button>
              </div>

              {/* Content preview */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${slide.published ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {slide.published ? "Published" : "Hidden"}
                  </span>
                </div>
                <h3 className="font-serif text-base font-medium text-[#0A1F44] truncate">
                  {slide.heading1} <span className="text-[#C9A961]">{slide.heading2}</span> {slide.heading3 || ""}
                </h3>
                <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">{slide.subtitle}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePublished(slide)} className="size-8 rounded-lg hover:bg-[#F9FAFB] flex items-center justify-center" title={slide.published ? "Hide" : "Publish"}>
                  <Eye className={`size-4 ${slide.published ? "text-[#0A1F44]" : "text-[#9CA3AF]"}`} />
                </button>
                <button onClick={() => setEditing(slide)} className="px-3 py-1.5 rounded-lg hover:bg-[#F9FAFB] text-xs font-medium text-[#0A1F44]">
                  Edit
                </button>
                <button onClick={() => handleDelete(slide.id!)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash2 className="size-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <SlideEditor
          slide={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

function SlideEditor({ slide, onClose, onSave, saving }: { slide: Slide | null; onClose: () => void; onSave: (s: Slide) => void; saving: boolean }) {
  const [form, setForm] = useState<Slide>(slide ? { ...slide } : {
    order: 0, heading1: "", heading2: "", heading3: null, subtitle: "", published: true,
  });
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium">{slide ? "Edit Slide" : "Add New Slide"}</h2>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Heading Line 1 *"><Input value={form.heading1} onChange={(e) => set("heading1", e.target.value)} className="bg-[#F9FAFB]" placeholder="Discover Dubai's" /></Field>
            <Field label="Heading Line 2 (Gold) *"><Input value={form.heading2} onChange={(e) => set("heading2", e.target.value)} className="bg-[#F9FAFB]" placeholder="most extraordinary" /></Field>
          </div>
          <Field label="Heading Line 3 (optional)"><Input value={form.heading3 || ""} onChange={(e) => set("heading3", e.target.value)} className="bg-[#F9FAFB]" placeholder="addresses." /></Field>
          <Field label="Subtitle / Description *"><Textarea value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none" /></Field>
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-[#F9FAFB]">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[#C9A961]" />
            <span className="text-sm">Published (visible on website)</span>
          </label>
          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
            <Button onClick={() => onSave(form)} disabled={saving} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> Save Slide</>}
            </Button>
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
