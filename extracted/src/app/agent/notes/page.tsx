"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { AdminPageHeader, AdminCard, EmptyRow } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AgentNotes() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newNote, setNewNote] = useState("");

  const load = () => { setLoading(true); fetch("/api/agent/notes").then((r) => r.json()).then((d) => { setItems(d.notes || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    const res = await fetch("/api/agent/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: newNote }),
    });
    if (res.ok) {
      toast.success("Note added");
      setNewNote("");
      setAdding(false);
      load();
    } else toast.error("Failed to add note");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    await fetch(`/api/agent/notes?id=${id}`, { method: "DELETE" });
    toast.success("Note deleted");
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>;

  return (
    <div>
      <AdminPageHeader
        title="CRM Notes"
        subtitle="Personal notes on leads, viewings and deals. Only visible to you."
        action={<Button onClick={() => setAdding(true)} className="bg-royal-gradient-diagonal text-white rounded-full"><Plus className="size-4 mr-1.5" /> Add Note</Button>}
      />

      {adding && (
        <AdminCard className="p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif text-base font-medium text-[#0A1F44]">New Note</h3>
            <button onClick={() => setAdding(false)} className="size-8 rounded-full hover:bg-muted flex items-center justify-center"><X className="size-4" /></button>
          </div>
          <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} rows={4} className="bg-[#F9FAFB] resize-none" placeholder="e.g. Called client — they want a viewing Saturday 2pm. Budget AED 25M for Palm villa." />
          <div className="flex gap-2 mt-3">
            <Button onClick={handleAdd} className="bg-royal-gradient-diagonal text-white rounded-full">Save Note</Button>
            <Button onClick={() => setAdding(false)} variant="outline" className="rounded-full">Cancel</Button>
          </div>
        </AdminCard>
      )}

      {items.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <p className="text-sm text-muted-foreground">No notes yet. Click "Add Note" to record your first CRM note.</p>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <AdminCard key={n.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {n.lead && (
                    <div className="text-[10px] tracking-luxury uppercase text-[#A68A3F] font-medium mb-2">
                      Lead: {n.lead.name} · {n.lead.email}
                    </div>
                  )}
                  <p className="text-sm text-[#0A1F44] whitespace-pre-wrap">{n.note}</p>
                  <div className="text-xs text-muted-foreground mt-3">{new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <button onClick={() => handleDelete(n.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="size-4 text-red-600" />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
