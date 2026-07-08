"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, X, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Faq {
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  published: boolean;
}

const categories = ["general", "buying", "renting", "selling", "investing", "mortgage"];
const categoryStyles: Record<string, string> = {
  general: "bg-gray-100 text-gray-700",
  buying: "bg-blue-100 text-blue-700",
  renting: "bg-amber-100 text-amber-700",
  selling: "bg-purple-100 text-purple-700",
  investing: "bg-green-100 text-green-700",
  mortgage: "bg-pink-100 text-pink-700",
};

export default function FaqsAdminPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Faq | "new" | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/faqs").then((r) => r.json()).then((d) => {
      setFaqs(d.faqs || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (faq: Faq) => {
    setSaving(true);
    try {
      if (faq.id) {
        await fetch(`/api/admin/faqs/${faq.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faq),
        });
        toast.success("FAQ updated");
      } else {
        await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faq),
        });
        toast.success("FAQ created");
      }
      setEditing(null);
      load();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    toast.success("FAQ deleted");
    load();
  };

  const move = async (index: number, direction: "up" | "down") => {
    const newFaqs = [...faqs];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newFaqs.length) return;
    [newFaqs[index], newFaqs[target]] = [newFaqs[target], newFaqs[index]];
    // Update order on both
    await Promise.all([
      fetch(`/api/admin/faqs/${newFaqs[index].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: index + 1 }),
      }),
      fetch(`/api/admin/faqs/${newFaqs[target].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: target + 1 }),
      }),
    ]);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        subtitle="Frequently asked questions shown on the public FAQ page. Reorder with the up/down arrows."
        action={
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> New FAQ
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-[#C9A961]" />
        </div>
      ) : faqs.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <HelpCircle className="size-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-serif text-lg text-[#0A1F44] mb-2">No FAQs yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first frequently asked question.</p>
          <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Plus className="size-4 mr-1.5" /> Create First FAQ
          </Button>
        </AdminCard>
      ) : (
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <AdminCard key={f.id} className="p-4 flex items-start gap-3">
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => move(i, "up")}
                  disabled={i === 0}
                  className="size-7 rounded hover:bg-muted flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  onClick={() => move(i, "down")}
                  disabled={i === faqs.length - 1}
                  className="size-7 rounded hover:bg-muted flex items-center justify-center disabled:opacity-30"
                >
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryStyles[f.category] || categoryStyles.general}`}>
                    {f.category}
                  </span>
                  {!f.published && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Hidden</span>
                  )}
                </div>
                <h3 className="font-medium text-[#0A1F44] text-sm">{f.question}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setEditing(f)}
                  className="text-xs px-2.5 py-1.5 rounded-lg hover:bg-[#0A1F44]/10 text-[#0A1F44] font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(f.id!)}
                  className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {editing && (
        <FaqEditor
          faq={editing === "new" ? { question: "", answer: "", category: "general", order: 0, published: true } : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function FaqEditor({ faq, saving, onClose, onSave }: {
  faq: Faq;
  saving: boolean;
  onClose: () => void;
  onSave: (f: Faq) => void;
}) {
  const [form, setForm] = useState<Faq>(faq);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl font-medium text-[#0A1F44]">
            {faq.id ? "Edit FAQ" : "New FAQ"}
          </h2>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <Label>Question *</Label>
            <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </div>
          <div>
            <Label>Answer *</Label>
            <Textarea
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              rows={5}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
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
            {faq.id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
