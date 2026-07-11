export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, Save, Loader2, X, Play, ChevronUp, ChevronDown, Upload, Video as VideoIcon, ExternalLink } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Video {
  id?: string;
  title: string;
  advisor: string;
  role: string;
  category: string;
  duration: string;
  thumbnail: string;
  description: string;
  videoUrl: string | null;
  youtubeUrl: string | null;
  order: number;
  published: boolean;
}

const categories = ["Market Insights", "Off-Plan", "Investor Guide"];
const categoryStyles: Record<string, string> = {
  "Market Insights": "bg-blue-100 text-blue-700",
  "Off-Plan": "bg-amber-100 text-amber-700",
  "Investor Guide": "bg-green-100 text-green-700",
};

export default function VideosAdminPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Video | "new" | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/videos").then((r) => r.json()).then((d) => {
      setVideos(d.videos || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (video: Video) => {
    setSaving(true);
    try {
      if (video.id) {
        await fetch(`/api/admin/videos/${video.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(video),
        });
        toast.success("Video updated");
      } else {
        await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(video),
        });
        toast.success("Video created");
      }
      setEditing(null);
      load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    toast.success("Video deleted");
    load();
  };

  const move = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= videos.length) return;
    const a = videos[index];
    const b = videos[target];
    const newVideos = [...videos];
    [newVideos[index], newVideos[target]] = [newVideos[target], newVideos[index]];
    setVideos(newVideos);
    await Promise.all([
      fetch(`/api/admin/videos/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: target + 1 }) }),
      fetch(`/api/admin/videos/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: index + 1 }) }),
    ]);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Advisor Videos"
        subtitle="Manage the “Our Advice” video section on the homepage. Upload MP4/WebM videos or paste YouTube links. Reorder with ↑ ↓ arrows."
        action={
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> Add Video
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#C9A961]" />
        </div>
      ) : videos.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <VideoIcon className="size-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-serif text-lg text-[#0A1F44] mb-2">No videos yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Add your first advisor video to appear in the “Our Advice” section.</p>
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> Create First Video
          </Button>
        </AdminCard>
      ) : (
        <div className="space-y-2">
          {videos.map((v, i) => (
            <AdminCard key={v.id} className="p-4 flex items-start gap-3">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => move(i, "up")} disabled={i === 0} className="size-7 rounded hover:bg-muted flex items-center justify-center disabled:opacity-30">
                  <ChevronUp className="size-3.5" />
                </button>
                <button onClick={() => move(i, "down")} disabled={i === videos.length - 1} className="size-7 rounded hover:bg-muted flex items-center justify-center disabled:opacity-30">
                  <ChevronDown className="size-3.5" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="relative size-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {v.thumbnail ? (
                  <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <VideoIcon className="size-6" />
                  </div>
                )}
                {v.videoUrl && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="size-5 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryStyles[v.category] || categoryStyles["Market Insights"]}`}>
                    {v.category}
                  </span>
                  {!v.published && <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Hidden</span>}
                  <span className="text-[10px] text-muted-foreground">{v.duration}</span>
                </div>
                <h3 className="font-medium text-[#0A1F44] text-sm line-clamp-1">{v.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{v.advisor} · {v.role}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{v.description}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {v.videoUrl && (
                  <a href={v.videoUrl} target="_blank" className="size-8 rounded-lg hover:bg-muted flex items-center justify-center" title="Play video">
                    <Play className="size-3.5 text-[#A68A3F]" />
                  </a>
                )}
                {v.youtubeUrl && (
                  <a href={v.youtubeUrl} target="_blank" className="size-8 rounded-lg hover:bg-muted flex items-center justify-center" title="Open YouTube">
                    <ExternalLink className="size-3.5 text-red-600" />
                  </a>
                )}
                <button onClick={() => setEditing(v)} className="text-xs px-2.5 py-1.5 rounded-lg hover:bg-[#0A1F44]/10 text-[#0A1F44] font-medium">
                  Edit
                </button>
                <button onClick={() => handleDelete(v.id!, v.title)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {editing && (
        <VideoEditor
          video={editing === "new" ? {
            title: "", advisor: "", role: "Property Consultant", category: "Market Insights",
            duration: "0:00", thumbnail: "", description: "", videoUrl: null, youtubeUrl: null,
            order: videos.length, published: true,
          } : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function VideoEditor({ video, saving, onClose, onSave }: {
  video: Video;
  saving: boolean;
  onClose: () => void;
  onSave: (v: Video) => void;
}) {
  const [form, setForm] = useState<Video>(video);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const thumbRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File, folder: string, kind: "thumbnail" | "video") => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Upload failed");
    }
    const data = await res.json();
    return data.files[0].url as string;
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const url = await uploadFile(file, "videos/thumbnails", "thumbnail");
      setForm({ ...form, thumbnail: url });
      toast.success("Thumbnail uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploadingThumb(false);
      if (thumbRef.current) thumbRef.current.value = "";
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const url = await uploadFile(file, "videos", "video");
      setForm({ ...form, videoUrl: url });
      toast.success("Video uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploadingVideo(false);
      if (videoRef.current) videoRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl font-medium text-[#0A1F44]">
            {video.id ? "Edit Video" : "New Video"}
          </h2>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label>Video Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. River Side Investment Opportunity by Damac" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Advisor Name *</Label>
              <Input value={form.advisor} onChange={(e) => setForm({ ...form, advisor: e.target.value })} placeholder="e.g. Muhammad Javed Zafar" />
            </div>
            <div>
              <Label>Advisor Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Managing Director" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Duration</Label>
              <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2:01" />
            </div>
            <div>
              <Label>Display Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description of what the video covers..."
            />
          </div>

          {/* Thumbnail upload */}
          <div>
            <Label>Thumbnail Image</Label>
            <div className="flex items-center gap-3">
              {form.thumbnail && (
                <img src={form.thumbnail} alt="thumbnail" className="size-16 rounded-lg object-cover border border-border" />
              )}
              <input
                ref={thumbRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleThumbUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => thumbRef.current?.click()}
                disabled={uploadingThumb}
                className="rounded-full"
              >
                {uploadingThumb ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Upload className="size-4 mr-1.5" />}
                Upload Thumbnail
              </Button>
              {form.thumbnail && (
                <Button type="button" variant="ghost" onClick={() => setForm({ ...form, thumbnail: "" })} className="text-red-600">
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Or paste a URL below</p>
            <Input
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              className="mt-1.5"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          {/* Video upload */}
          <div>
            <Label>Video File (MP4 / WebM — max 100MB)</Label>
            <div className="flex items-center gap-3">
              <input
                ref={videoRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                className="hidden"
                onChange={handleVideoUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => videoRef.current?.click()}
                disabled={uploadingVideo}
                className="rounded-full"
              >
                {uploadingVideo ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Upload className="size-4 mr-1.5" />}
                Upload Video File
              </Button>
              {form.videoUrl && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Play className="size-3" /> Video uploaded
                </span>
              )}
            </div>
            {uploadingVideo && (
              <p className="text-xs text-amber-600 mt-1.5">Uploading... large videos may take 30-60 seconds.</p>
            )}
            <Input
              value={form.videoUrl || ""}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              className="mt-1.5"
              placeholder="Or paste a direct video URL (https://.../video.mp4)"
            />
          </div>

          {/* YouTube fallback */}
          <div>
            <Label>YouTube URL (alternative to uploading a video file)</Label>
            <Input
              value={form.youtubeUrl || ""}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-muted-foreground mt-1">If both a video file and YouTube URL are provided, the video file takes priority.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="size-4 accent-[#C9A961]"
            />
            <span className="text-sm text-[#0A1F44]">Published (visible on website)</span>
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 p-6 border-t border-border bg-[#F9FAFB]">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Save className="size-4 mr-1.5" />}
            {video.id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
