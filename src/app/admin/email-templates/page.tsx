"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, X, Mail, Eye, Code } from "lucide-react";
import { AdminPageHeader, AdminCard } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Template {
  id?: string;
  name: string;
  slug: string;
  subject: string;
  body: string;
  category: string;
  variables: string | null;
  active: boolean;
}

const categoryStyles: Record<string, string> = {
  transactional: "bg-blue-100 text-blue-700",
  marketing: "bg-[#C9A961]/15 text-[#A68A3F]",
  system: "bg-purple-100 text-purple-700",
};

const defaultTemplates = [
  {
    name: "Welcome Email",
    slug: "welcome",
    subject: "Welcome to Royal Jubilant Real Estate, {{name}}!",
    body: "<h1>Hello {{name}}</h1><p>Thank you for joining Royal Jubilant Real Estate LLC. We're delighted to have you with us.</p><p>Explore our exclusive collection of Dubai properties or contact one of our RERA-certified advisors for personalized assistance.</p><p>Best regards,<br/>The Royal Jubilant Team</p>",
    category: "transactional",
    variables: ["name", "email"],
  },
  {
    name: "Lead Notification",
    slug: "lead-notification",
    subject: "New Lead: {{leadName}} — {{intent}}",
    body: "<h2>New Lead Received</h2><p><strong>Name:</strong> {{leadName}}</p><p><strong>Email:</strong> {{leadEmail}}</p><p><strong>Phone:</strong> {{leadPhone}}</p><p><strong>Intent:</strong> {{intent}}</p><p><strong>Message:</strong> {{message}}</p>",
    category: "transactional",
    variables: ["leadName", "leadEmail", "leadPhone", "intent", "message"],
  },
  {
    name: "Appointment Reminder",
    slug: "appointment-reminder",
    subject: "Reminder: Your appointment on {{date}}",
    body: "<p>Dear {{name}},</p><p>This is a reminder for your upcoming appointment on <strong>{{date}}</strong> at <strong>{{time}}</strong>.</p><p>Property: {{propertyTitle}}</p><p>Agent: {{agentName}}</p>",
    category: "transactional",
    variables: ["name", "date", "time", "propertyTitle", "agentName"],
  },
];

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Template | "new" | null>(null);
  const [previewing, setPreviewing] = useState<Template | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/email-templates").then((r) => r.json()).then((d) => {
      setTemplates(d.templates || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (tpl: Template) => {
    setSaving(true);
    try {
      const payload = {
        ...tpl,
        variables: typeof tpl.variables === "string" ? JSON.parse(tpl.variables || "[]") : tpl.variables,
      };
      if (tpl.id) {
        await fetch(`/api/admin/email-templates/${tpl.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        toast.success("Template updated");
      } else {
        const res = await fetch("/api/admin/email-templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || "Failed");
        }
        toast.success("Template created");
      }
      setEditing(null);
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"?`)) return;
    await fetch(`/api/admin/email-templates/${id}`, { method: "DELETE" });
    toast.success("Template deleted");
    load();
  };

  const seedDefaults = async () => {
    if (!confirm("Create 3 default templates (welcome, lead, appointment)?")) return;
    setSaving(true);
    for (const t of defaultTemplates) {
      await fetch("/api/admin/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      });
    }
    toast.success("Default templates created");
    setSaving(false);
    load();
  };

  return (
    <div>
      <AdminPageHeader
        title="Email Templates"
        subtitle="Transactional & marketing email templates. Use {{variables}} for personalization. Templates are triggered by system events (new lead, appointment, newsletter, etc.)."
        action={
          <div className="flex gap-2">
            {templates.length === 0 && (
              <Button variant="outline" onClick={seedDefaults} disabled={saving}>
                <Code className="size-4 mr-1.5" /> Seed Defaults
              </Button>
            )}
            <Button onClick={() => setEditing("new")} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
              <Plus className="size-4 mr-1.5" /> New Template
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-[#C9A961]" />
        </div>
      ) : templates.length === 0 ? (
        <AdminCard className="p-12 text-center">
          <Mail className="size-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-serif text-lg text-[#0A1F44] mb-2">No email templates yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Get started by creating your first template or seed the 3 default templates (Welcome, Lead Notification, Appointment Reminder).
          </p>
          <Button onClick={seedDefaults} disabled={saving} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            <Code className="size-4 mr-1.5" /> Seed Default Templates
          </Button>
        </AdminCard>
      ) : (
        <div className="grid gap-3">
          {templates.map((t) => (
            <AdminCard key={t.id} className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryStyles[t.category] || categoryStyles.transactional}`}>
                    {t.category}
                  </span>
                  {!t.active && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactive</span>
                  )}
                  <code className="text-[10px] text-muted-foreground">/{t.slug}</code>
                </div>
                <h3 className="font-serif text-base font-medium text-[#0A1F44]">{t.name}</h3>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{t.subject}</p>
                {t.variables && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {JSON.parse(t.variables || "[]").map((v: string) => (
                      <code key={v} className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                        {`{{${v}}}`}
                      </code>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setPreviewing(t)}
                  className="size-8 rounded-lg hover:bg-muted flex items-center justify-center"
                  title="Preview"
                >
                  <Eye className="size-3.5" />
                </button>
                <button
                  onClick={() => setEditing(t)}
                  className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-[#0A1F44]"
                  title="Edit"
                >
                  <Mail className="size-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id!, t.name)}
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
        <TemplateEditor
          template={editing === "new" ? { name: "", slug: "", subject: "", body: "", category: "transactional", variables: "[]", active: true } : editing}
          saving={saving}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {previewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-serif text-xl font-medium text-[#0A1F44]">Preview: {previewing.name}</h2>
              <button onClick={() => setPreviewing(null)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
                <X className="size-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-xs text-muted-foreground mb-1">Subject:</div>
              <div className="font-medium text-[#0A1F44] mb-4 pb-4 border-b border-border">{previewing.subject}</div>
              <div className="text-xs text-muted-foreground mb-2">Body:</div>
              <div
                className="prose prose-sm max-w-none p-4 bg-[#F9FAFB] rounded-lg"
                dangerouslySetInnerHTML={{ __html: previewing.body }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateEditor({ template, saving, onClose, onSave }: {
  template: Template;
  saving: boolean;
  onClose: () => void;
  onSave: (t: Template) => void;
}) {
  const [form, setForm] = useState<Template>(template);
  const [varInput, setVarInput] = useState(() => {
    try { return JSON.parse(template.variables || "[]").join(", "); } catch { return ""; }
  });

  const handleSave = () => {
    const variables = varInput
      .split(",")
      .map((v) => v.trim().replace(/[{}]/g, ""))
      .filter(Boolean);
    onSave({ ...form, variables: JSON.stringify(variables) });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-serif text-xl font-medium text-[#0A1F44]">
            {template.id ? "Edit Template" : "New Template"}
          </h2>
          <button onClick={onClose} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center">
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Template Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={!!template.id}
                placeholder="welcome-email"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="transactional">Transactional</option>
                <option value="marketing">Marketing</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <Label>Active</Label>
              <select
                value={form.active ? "1" : "0"}
                onChange={(e) => setForm({ ...form, active: e.target.value === "1" })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Subject Line *</Label>
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </div>
          <div>
            <Label>Body (HTML) *</Label>
            <Textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={10}
              className="font-mono text-xs"
              placeholder="<h1>Hello {{name}}</h1><p>...</p>"
            />
          </div>
          <div>
            <Label>Variables (comma-separated)</Label>
            <Input
              value={varInput}
              onChange={(e) => setVarInput(e.target.value)}
              placeholder="name, email, phone"
            />
            <p className="text-xs text-muted-foreground mt-1">Use <code>{`{{variable}}`}</code> in subject & body</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-6 border-t border-border bg-[#F9FAFB]">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#0A1F44] hover:bg-[#0A1F44]/90">
            {saving ? <Loader2 className="size-4 mr-1.5 animate-spin" /> : <Save className="size-4 mr-1.5" />}
            {template.id ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
