export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Trash2, Loader2, Search, Copy, ImageIcon, FileText, Film } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function MediaPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState("general");
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/media?folder=${folder}`).then((r) => r.json()).then((d) => { setFiles(d.files || []); setLoading(false); });
  };
  useEffect(() => { load(); }, [folder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    try {
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      toast.success("File uploaded");
      load();
    } catch { toast.error("Upload failed"); } finally { setUploading(false); if (fileRef.current) fileRef.current.value = ""; }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    toast.success("Deleted"); load();
  };

  const copyUrl = (url: string) => { navigator.clipboard.writeText(url); toast.success("URL copied"); };

  const filtered = files.filter((f) => f.filename.toLowerCase().includes(search.toLowerCase()));

  const folders = ["general", "properties", "agents", "blog", "hero", "logos"];

  return (
    <div>
      <AdminPageHeader title="Media Library" subtitle="Upload and manage images, videos, PDFs and other files."
        action={
          <div className="flex items-center gap-2">
            <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" accept="image/*,video/*,.pdf,.svg" />
            <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full">
              {uploading ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Upload className="size-4 mr-1.5" />}
              Upload
            </Button>
          </div>
        }
      />

      {/* Folder tabs + search */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {folders.map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${folder === f ? "bg-[#0A1F44] text-white" : "bg-white text-[#0A1F44] border border-[#E5E7EB] hover:bg-[#F9FAFB]"}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#9CA3AF]" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="pl-9 h-9 w-48 bg-[#F9FAFB] text-sm" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB]">
          <ImageIcon className="size-12 mx-auto text-[#9CA3AF]/40 mb-4" />
          <p className="text-sm text-[#6B7280]">No files in this folder. Click Upload to add files.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map((file) => (
            <div key={file.id} className="group bg-white rounded-xl border border-[#E5E7EB] overflow-hidden lift-on-hover">
              <div className="relative aspect-square bg-[#F4F5F7] overflow-hidden">
                {file.type === "image" || file.type === "svg" ? (
                  <img src={file.url} alt={file.altTag || file.filename} className="w-full h-full object-cover" />
                ) : file.type === "video" ? (
                  <div className="w-full h-full flex items-center justify-center"><Film className="size-8 text-[#9CA3AF]" /></div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FileText className="size-8 text-[#9CA3AF]" /></div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button onClick={() => copyUrl(file.url)} className="size-8 rounded-full bg-white/90 flex items-center justify-center" title="Copy URL"><Copy className="size-3.5 text-[#0A1F44]" /></button>
                  <button onClick={() => handleDelete(file.id)} className="size-8 rounded-full bg-white/90 flex items-center justify-center" title="Delete"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium text-[#0A1F44] truncate">{file.filename}</p>
                <p className="text-[9px] text-[#9CA3AF]">{file.type} · {(file.size / 1024).toFixed(0)}KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
