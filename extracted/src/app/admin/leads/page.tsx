"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, Phone, Mail, MessageCircle, Tag, Calendar as CalIcon } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow, StatusBadge, AdminCard } from "@/components/admin/AdminUI";
import { toast } from "sonner";

interface Lead {
  id: string; name: string; email: string; phone?: string; whatsapp?: string;
  source: string; intent?: string; message?: string; budget?: number;
  propertyRef?: string; community?: string; status: string; assignedTo?: string;
  notes?: string; createdAt: string;
}

const STATUSES = ["new", "contacted", "viewing", "negotiating", "won", "lost"];

export default function AdminLeads() {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [selected, setSelected] = useState<Lead | null>(null);

  const load = () => {
    setLoading(true);
    fetch(`/api/admin/leads${filter ? `?status=${filter}` : ""}`).then((r) => r.json()).then((d) => {
      setItems(d.leads || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (lead: Lead, status: string) => {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, status }),
    });
    if (res.ok) {
      toast.success(`Lead marked as ${status}`);
      load();
      if (selected?.id === lead.id) setSelected({ ...lead, status });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    toast.success("Lead deleted");
    load();
    setSelected(null);
  };

  return (
    <div>
      <AdminPageHeader
        title="Leads CRM"
        subtitle="All enquiries from property forms, viewing requests, WhatsApp, callbacks, mortgages, contact, newsletter and valuations."
      />

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterPill active={!filter} onClick={() => setFilter("")} label="All" count={items.length} />
        {STATUSES.map((s) => (
          <FilterPill key={s} active={filter === s} onClick={() => setFilter(s)} label={s.charAt(0).toUpperCase() + s.slice(1)} count={items.filter((i) => i.status === s).length} />
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>
      ) : (
        <AdminTable headers={["Name", "Source", "Intent", "Status", "Received", "Actions"]}>
          {items.length === 0 ? (
            <EmptyRow colSpan={6} label="No leads yet. Leads from the website will appear here." />
          ) : (
            items.map((lead) => (
              <tr key={lead.id} className="hover:bg-[#F9FAFB]/50 cursor-pointer" onClick={() => setSelected(lead)}>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#0A1F44]">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </td>
                <td className="px-4 py-3 text-xs capitalize text-muted-foreground">{lead.source}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{lead.intent || "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                <td className="px-4 py-3">
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                    <Trash2 className="size-3.5 text-red-600" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </AdminTable>
      )}

      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} onStatusChange={(s) => updateStatus(selected, s)} />}
    </div>
  );
}

function FilterPill({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
        active ? "bg-royal-gradient-diagonal text-white" : "bg-white text-[#0A1F44] hover:bg-[#C9A961]/10 border border-border"
      }`}
    >
      {label} <span className="opacity-70">({count})</span>
    </button>
  );
}

function LeadDetail({ lead, onClose, onStatusChange }: { lead: Lead; onClose: () => void; onStatusChange: (s: string) => void }) {
  return (
    <div className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-royal-gradient-diagonal text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-xl font-medium">{lead.name}</h2>
              <p className="text-white/70 text-sm mt-1 capitalize">{lead.source} · {lead.intent || "no intent"}</p>
            </div>
            <button onClick={onClose} className="size-9 rounded-full hover:bg-white/15 flex items-center justify-center">✕</button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <StatusBadge status={lead.status} />
            <span className="text-xs text-white/60">{new Date(lead.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 p-3 rounded-xl bg-[#F9FAFB] hover:bg-[#C9A961]/10 transition-colors">
              <Mail className="size-4 text-[#A68A3F]" />
              <div className="text-xs"><div className="text-muted-foreground">Email</div><div className="font-medium text-[#0A1F44] truncate">{lead.email}</div></div>
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 p-3 rounded-xl bg-[#F9FAFB] hover:bg-[#C9A961]/10 transition-colors">
                <Phone className="size-4 text-[#A68A3F]" />
                <div className="text-xs"><div className="text-muted-foreground">Phone</div><div className="font-medium text-[#0A1F44]">{lead.phone}</div></div>
              </a>
            )}
          </div>

          {lead.whatsapp && (
            <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" className="flex items-center gap-2 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors">
              <MessageCircle className="size-4 text-green-600" />
              <div className="text-xs"><div className="text-muted-foreground">WhatsApp</div><div className="font-medium text-[#0A1F44]">{lead.whatsapp}</div></div>
            </a>
          )}

          {lead.message && (
            <div>
              <h3 className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium mb-2">Message</h3>
              <p className="text-sm text-[#0A1F44] bg-[#F9FAFB] p-4 rounded-xl">{lead.message}</p>
            </div>
          )}

          {(lead.propertyRef || lead.community || lead.budget) && (
            <div className="grid grid-cols-3 gap-3">
              {lead.propertyRef && <InfoTile label="Property" value={lead.propertyRef} icon={<Tag className="size-3.5" />} />}
              {lead.community && <InfoTile label="Community" value={lead.community} icon={<Tag className="size-3.5" />} />}
              {lead.budget && <InfoTile label="Budget" value={`AED ${lead.budget.toLocaleString()}`} icon={<Tag className="size-3.5" />} />}
            </div>
          )}

          <div>
            <h3 className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => onStatusChange(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${lead.status === s ? "bg-royal-gradient-diagonal text-white" : "bg-[#F9FAFB] text-[#0A1F44] hover:bg-[#C9A961]/10"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-[#F9FAFB]">
      <div className="flex items-center gap-1.5 text-[10px] tracking-luxury uppercase text-muted-foreground mb-1">{icon} {label}</div>
      <div className="text-sm font-medium text-[#0A1F44]">{value}</div>
    </div>
  );
}
