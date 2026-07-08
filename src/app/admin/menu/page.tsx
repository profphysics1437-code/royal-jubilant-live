"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, Save, Loader2, ChevronUp, ChevronDown, Eye, Link2, Edit3 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ICON_OPTIONS = [
  "Building", "Home", "Briefcase", "HardHat", "Users", "ChevronDown",
  "Phone", "Mail", "MessageCircle", "Calculator", "Search", "MapPin",
  "Building2", "FileText", "TrendingUp", "HelpCircle", "Calendar",
  "Heart", "User", "Star", "Award", "Globe", "ArrowRight",
];

export default function MenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | "new" | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/menu?menu=main`).then((r) => r.json()).then((d) => {
      setItems(d.items || []);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this menu item? Sub-items will also be deleted.")) return;
    // Delete children first
    const item = items.find((i) => i.id === id);
    if (item) {
      const children = items.filter((i) => i.parentId === id);
      for (const c of children) {
        await fetch(`/api/admin/menu/${c.id}`, { method: "DELETE" });
      }
    }
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    toast.success("Deleted");
    load();
  };

  const toggleVisible = async (item: any) => {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !item.visible }),
    });
    load();
  };

  const moveItem = async (index: number, dir: "up" | "down", list: any[], parentId: string | null = null) => {
    const newItems = [...list];
    const target = dir === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    newItems.forEach((s, i) => { s.order = i; });
    setItems([...items]); // trigger re-render
    for (const s of newItems) {
      if (s.id) {
        await fetch(`/api/admin/menu/${s.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: s.order }),
        });
      }
    }
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#C9A961]" /></div>;

  // Build hierarchy
  const topItems = items.filter((i) => !i.parentId).sort((a, b) => a.order - b.order);
  const childrenOf = (parentId: string) => items.filter((i) => i.parentId === parentId).sort((a, b) => a.order - b.order);

  return (
    <div>
      <AdminPageHeader
        title="Menu Builder"
        subtitle="Manage website navigation. Top-level items appear in the navbar; sub-items appear in dropdowns. Reorder, hide, or add new items."
        action={
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full">
            <Plus className="size-4 mr-1.5" /> Add Menu Item
          </Button>
        }
      />

      {/* Helpful tips */}
      <div className="bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-4 mb-4 text-xs text-[#6B7280] leading-relaxed">
        <strong className="text-[#0A1F44]">Tips:</strong> Top-level items show in the navbar with their dropdown icon. Sub-items appear when visitors hover. To create a dropdown, first add a top-level item, then add sub-items with that parent. The "View" field controls which internal page opens (e.g., <code className="px-1 py-0.5 bg-white rounded text-[#A68A3F]">rent</code>, <code className="px-1 py-0.5 bg-white rounded text-[#A68A3F]">buy</code>, <code className="px-1 py-0.5 bg-white rounded text-[#A68A3F]">about</code>). Leave "View" empty and use "URL" for external links.
      </div>

      <div className="space-y-3">
        {topItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">No menu items yet. Click "Add Menu Item" to start.</p>
          </div>
        ) : topItems.map((top, i) => {
          const kids = childrenOf(top.id);
          return (
            <div key={top.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              {/* Top-level row */}
              <div className="p-4 flex items-center gap-3 bg-[#FAFAFB] border-b border-[#E5E7EB]">
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => moveItem(i, "up", topItems)} disabled={i === 0} className="size-6 rounded hover:bg-white flex items-center justify-center disabled:opacity-30">
                    <ChevronUp className="size-3.5 text-[#0A1F44]" />
                  </button>
                  <button onClick={() => moveItem(i, "down", topItems)} disabled={i === topItems.length - 1} className="size-6 rounded hover:bg-white flex items-center justify-center disabled:opacity-30">
                    <ChevronDown className="size-3.5 text-[#0A1F44]" />
                  </button>
                </div>
                <span className="text-xs font-bold text-[#9CA3AF] w-6">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#0A1F44] text-base">{top.label}</span>
                    {top.icon && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C9A961]/15 text-[#A68A3F]">{top.icon}</span>}
                    {top.view && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F9FAFB] text-[#6B7280] font-mono">view: {top.view}</span>}
                    {kids.length > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">{kids.length} sub-items</span>}
                  </div>
                  {top.url && <div className="flex items-center gap-1 text-xs text-[#6B7280] mt-0.5"><Link2 className="size-3" />{top.url}</div>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => toggleVisible(top)} className="size-8 rounded-lg hover:bg-white flex items-center justify-center" title={top.visible ? "Hide" : "Show"}>
                    <Eye className={`size-4 ${top.visible ? "text-[#0A1F44]" : "text-[#9CA3AF]"}`} />
                  </button>
                  <button onClick={() => setEditing(top)} className="px-2.5 py-1.5 rounded-lg hover:bg-white flex items-center gap-1 text-xs text-[#0A1F44] font-medium">
                    <Edit3 className="size-3.5" /> Edit
                  </button>
                  <button onClick={() => setEditing({ parentId: top.id, label: "", desc: "", view: "", url: "", icon: "", badge: "" })} className="px-2.5 py-1.5 rounded-lg hover:bg-white flex items-center gap-1 text-xs text-[#A68A3F] font-medium">
                    <Plus className="size-3.5" /> Add Sub-item
                  </button>
                  <button onClick={() => handleDelete(top.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                    <Trash2 className="size-3.5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Sub-items */}
              {kids.length > 0 && (
                <div className="divide-y divide-[#F3F4F6]">
                  {kids.map((kid, j) => (
                    <div key={kid.id} className="p-3 pl-12 flex items-center gap-3 hover:bg-[#FAFAFB]">
                      <div className="flex flex-col gap-0.5 flex-shrink-0">
                        <button onClick={() => moveItem(j, "up", kids, kid.parentId)} disabled={j === 0} className="size-5 rounded hover:bg-white flex items-center justify-center disabled:opacity-30">
                          <ChevronUp className="size-3 text-[#0A1F44]" />
                        </button>
                        <button onClick={() => moveItem(j, "down", kids, kid.parentId)} disabled={j === kids.length - 1} className="size-5 rounded hover:bg-white flex items-center justify-center disabled:opacity-30">
                          <ChevronDown className="size-3 text-[#0A1F44]" />
                        </button>
                      </div>
                      <span className="text-[10px] font-bold text-[#9CA3AF] w-4">{j + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[#0A1F44]">{kid.label}</span>
                          {kid.badge && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#C9A961] text-[#0A1F44] font-bold uppercase">{kid.badge}</span>}
                          {kid.view && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F9FAFB] text-[#6B7280] font-mono">view: {kid.view}</span>}
                          {kid.url && <span className="text-[10px] text-[#9CA3AF] flex items-center gap-0.5"><Link2 className="size-2.5" />{kid.url}</span>}
                        </div>
                        {kid.desc && <div className="text-xs text-[#9CA3AF] mt-0.5">{kid.desc}</div>}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => toggleVisible(kid)} className="size-7 rounded-lg hover:bg-white flex items-center justify-center" title={kid.visible ? "Hide" : "Show"}>
                          <Eye className={`size-3.5 ${kid.visible ? "text-[#0A1F44]" : "text-[#9CA3AF]"}`} />
                        </button>
                        <button onClick={() => setEditing(kid)} className="px-2 py-1 rounded hover:bg-white text-xs text-[#0A1F44] font-medium flex items-center gap-1">
                          <Edit3 className="size-3" /> Edit
                        </button>
                        <button onClick={() => handleDelete(kid.id)} className="size-7 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Trash2 className="size-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <MenuEditor
          item={editing === "new" ? null : editing}
          parentOptions={topItems}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function MenuEditor({
  item,
  parentOptions,
  onClose,
  onSaved,
}: {
  item: any | null;
  parentOptions: any[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isChild = item?.parentId;
  const [form, setForm] = useState<any>(
    item
      ? { ...item }
      : { label: "", url: "", view: "", desc: "", badge: "", icon: "", parentId: null, menu: "main", visible: true, order: 0 }
  );
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    if (!form.label) { toast.error("Label required"); return; }
    setSaving(true);
    try {
      const url = item?.id ? `/api/admin/menu/${item.id}` : "/api/admin/menu";
      const method = item?.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          url: form.url || "",
          view: form.view || null,
          desc: form.desc || null,
          badge: form.badge || null,
          icon: form.icon || null,
          parentId: form.parentId || null,
          menu: "main",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(item?.id ? "Menu item updated" : "Menu item added");
      onSaved();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A1F44] text-white p-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium">
            {item?.id ? `Edit ${isChild ? "Sub-item" : "Top-level Item"}` : "Add Menu Item"}
          </h2>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center">
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Parent (only when adding/editing a sub-item) */}
          {isChild && (
            <Field label="Parent Item * (which top-level this belongs to)">
              <select
                value={form.parentId || ""}
                onChange={(e) => set("parentId", e.target.value)}
                className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm"
              >
                <option value="">— Select parent —</option>
                {parentOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Label * (text shown in the navbar/menu)">
            <Input value={form.label || ""} onChange={(e) => set("label", e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. Rent" />
          </Field>

          <Field label="Description (shown below label in dropdown — leave empty for top-level)">
            <Input value={form.desc || ""} onChange={(e) => set("desc", e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. Annual long-term rentals" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="View (internal page action — e.g. rent, buy, about)">
              <Input value={form.view || ""} onChange={(e) => set("view", e.target.value)} className="bg-[#F9FAFB] font-mono text-xs" placeholder="rent" />
            </Field>
            <Field label="URL (external link — leave empty if using View)">
              <Input value={form.url || ""} onChange={(e) => set("url", e.target.value)} className="bg-[#F9FAFB]" placeholder="https://..." />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Icon (lucide-react name)">
              <select value={form.icon || ""} onChange={(e) => set("icon", e.target.value)} className="w-full h-10 px-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-sm">
                <option value="">— No icon —</option>
                {ICON_OPTIONS.map((ic) => (
                  <option key={ic} value={ic}>{ic}</option>
                ))}
              </select>
            </Field>
            <Field label="Badge (optional label like 'New' or 'Premium')">
              <Input value={form.badge || ""} onChange={(e) => set("badge", e.target.value)} className="bg-[#F9FAFB]" placeholder="New" />
            </Field>
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-[#F9FAFB]">
            <input type="checkbox" checked={form.visible} onChange={(e) => set("visible", e.target.checked)} className="size-4 accent-[#C9A961]" />
            <span className="text-sm">Visible (show on website)</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
            <Button onClick={handleSave} disabled={saving} className="bg-[#0A1F44] hover:bg-[#C9A961] hover:text-[#0A1F44] text-white rounded-full flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> Save Menu Item</>}
            </Button>
            <Button onClick={onClose} variant="outline" className="rounded-full">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
