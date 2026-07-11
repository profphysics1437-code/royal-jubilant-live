"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Save, Loader2, Star, ChevronUp, ChevronDown } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MediaUploadField } from "@/components/admin/MediaUploadField";

interface Agent {
  id: string; name: string; title: string; photo: string; phone: string; whatsapp: string;
  email: string; languages: string; specializations: string; communities: string;
  biography: string; awards: string; rating: number; reviewsCount: number;
  activeListings: number; soldProperties: number; experienceYears: number;
  linkedin?: string; instagram?: string; twitter?: string; published: boolean;
  order?: number;
}

export default function AdminAgents() {
  const [items, setItems] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Agent | "new" | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/agents").then((r) => r.json()).then((d) => { setItems(d.agents || []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agent?")) return;
    await fetch(`/api/admin/agents/${id}`, { method: "DELETE" });
    toast.success("Agent deleted"); load();
  };

  // Move agent up or down in the ordering — swaps order values with the neighbour
  const moveAgent = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    // Optimistically swap locally
    const newItems = [...items];
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setItems(newItems);
    // Persist: write the new order values to both agents
    try {
      await Promise.all([
        fetch(`/api/admin/agents/${a.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: target + 1 }),
        }),
        fetch(`/api/admin/agents/${b.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: index + 1 }),
        }),
      ]);
      toast.success(`Moved ${a.name} ${direction}`);
      load(); // re-fetch to ensure server order is source of truth
    } catch {
      toast.error("Failed to reorder");
      load();
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Agents"
        subtitle="Manage your team of property consultants. Use the ↑ ↓ arrows to reorder how agents appear on the website. Edits apply instantly."
        action={<Button onClick={() => setEditing("new")} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Agent</Button>}
      />
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>
      ) : (
        <AdminTable headers={["#", "Agent", "Title", "Email", "Listings", "Rating", "Status", "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={8} label="No agents yet." /> : items.map((a, i) => (
            <tr key={a.id} className="hover:bg-[#F9FAFB]/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-[#0A1F44] w-5 text-center">{i + 1}</span>
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveAgent(i, "up")}
                      disabled={i === 0}
                      title="Move up"
                      className="size-5 rounded hover:bg-[#C9A961]/20 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronUp className="size-3 text-[#A68A3F]" />
                    </button>
                    <button
                      onClick={() => moveAgent(i, "down")}
                      disabled={i === items.length - 1}
                      title="Move down"
                      className="size-5 rounded hover:bg-[#C9A961]/20 flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed"
                    >
                      <ChevronDown className="size-3 text-[#A68A3F]" />
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={a.photo} alt={a.name} className="size-9 rounded-full object-cover" />
                  <div className="font-medium text-[#0A1F44]">{a.name}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{a.title}</td>
              <td className="px-4 py-3 text-xs">{a.email}</td>
              <td className="px-4 py-3 text-center">{a.activeListings}</td>
              <td className="px-4 py-3"><span className="flex items-center gap-1 text-xs"><Star className="size-3 fill-[#C9A961] text-[#A68A3F]" />{a.rating}</span></td>
              <td className="px-4 py-3"><span className={`text-[10px] px-2 py-1 rounded-full ${a.published ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{a.published ? "Published" : "Draft"}</span></td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <button onClick={() => setEditing(a)} className="size-8 rounded-lg hover:bg-[#C9A961]/15 flex items-center justify-center"><Pencil className="size-3.5 text-[#A68A3F]" /></button>
                  <button onClick={() => handleDelete(a.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
      {editing && <AgentForm agent={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function AgentForm({ agent, onClose, onSaved }: { agent: Agent | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<any>(agent ? { ...agent } : {
    name: "", title: "", photo: "", phone: "+971 4 327 8401", whatsapp: "971524942329",
    email: "", languages: [], specializations: [], communities: [], biography: "",
    awards: [], rating: 5.0, reviewsCount: 0, activeListings: 0, soldProperties: 0,
    experienceYears: 0, linkedin: "", instagram: "", twitter: "", published: true, order: 0,
  });
  const parseArr = (v: string) => { try { return JSON.parse(v); } catch { return []; } };
  const [languagesText, setLanguagesText] = useState((agent ? parseArr(agent.languages) : []).join(", "));
  const [specsText, setSpecsText] = useState((agent ? parseArr(agent.specializations) : []).join(", "));
  const [communitiesText, setCommunitiesText] = useState((agent ? parseArr(agent.communities) : []).join(", "));
  const [awardsText, setAwardsText] = useState((agent ? parseArr(agent.awards) : []).join("\n"));
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      languages: languagesText.split(",").map((s) => s.trim()).filter(Boolean),
      specializations: specsText.split(",").map((s) => s.trim()).filter(Boolean),
      communities: communitiesText.split(",").map((s) => s.trim()).filter(Boolean),
      awards: awardsText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      const url = agent ? `/api/admin/agents/${agent.id}` : "/api/admin/agents";
      const method = agent ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      toast.success(agent ? "Agent updated" : "Agent created");
      onSaved();
    } catch { toast.error("Failed to save agent"); } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-serif text-xl font-medium">{agent ? "Edit Agent" : "Add New Agent"}</h2>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center"><X className="size-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name *"><Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Title *"><Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-[#F9FAFB]" placeholder="e.g. Property Consultant" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email *"><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Agent Photo"><MediaUploadField value={form.photo} onChange={(url) => set("photo", url)} folder="agents" type="image" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="WhatsApp (digits only)"><Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <Field label="Biography"><Textarea value={form.biography} onChange={(e) => set("biography", e.target.value)} rows={4} className="bg-[#F9FAFB] resize-none" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Languages (comma-separated)"><Input value={languagesText} onChange={(e) => setLanguagesText(e.target.value)} className="bg-[#F9FAFB]" placeholder="English, Urdu, Arabic" /></Field>
            <Field label="Specializations (comma-separated)"><Input value={specsText} onChange={(e) => setSpecsText(e.target.value)} className="bg-[#F9FAFB]" placeholder="Villas, Off-Plan, Commercial" /></Field>
          </div>
          <Field label="Communities (comma-separated)"><Input value={communitiesText} onChange={(e) => setCommunitiesText(e.target.value)} className="bg-[#F9FAFB]" placeholder="Palm Jumeirah, Dubai Marina" /></Field>
          <Field label="Awards (one per line)"><Textarea value={awardsText} onChange={(e) => setAwardsText(e.target.value)} rows={3} className="bg-[#F9FAFB] resize-none text-xs" /></Field>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Rating"><Input type="number" step="0.1" value={form.rating} onChange={(e) => set("rating", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Reviews"><Input type="number" value={form.reviewsCount} onChange={(e) => set("reviewsCount", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Listings"><Input type="number" value={form.activeListings} onChange={(e) => set("activeListings", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Sold"><Input type="number" value={form.soldProperties} onChange={(e) => set("soldProperties", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <Field label="Display Order (lower = appears first; 0 = auto-sort by listings)"><Input type="number" value={form.order ?? 0} onChange={(e) => set("order", e.target.value)} className="bg-[#F9FAFB]" placeholder="0" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Years"><Input type="number" value={form.experienceYears} onChange={(e) => set("experienceYears", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="LinkedIn"><Input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} className="bg-[#F9FAFB]" /></Field>
            <Field label="Instagram"><Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} className="bg-[#F9FAFB]" /></Field>
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-border">
            <input type="checkbox" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="size-4 accent-[#C9A961]" />
            <span className="text-sm text-[#0A1F44]">Published (visible on website)</span>
          </label>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSave} disabled={saving} className="bg-royal-gradient-diagonal text-white rounded-full flex-1">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4 mr-1.5" /> {agent ? "Save Changes" : "Create Agent"}</>}
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
