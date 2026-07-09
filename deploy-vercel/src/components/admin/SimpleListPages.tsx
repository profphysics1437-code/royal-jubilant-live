"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, X, Save, Plus, Pencil } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow, StatusBadge } from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * Generic admin list page for simple resources (valuations, mortgages, newsletter, appointments).
 * Read-only table with delete + status update for CRM-style records.
 */
export function SimpleListPage({
  title, subtitle, endpoint, resourceKey, columns, searchParams = "",
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  resourceKey: string;
  columns: { header: string; cell: (item: any) => React.ReactNode }[];
  searchParams?: string;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(endpoint).then((r) => r.json()).then((d) => { setItems(d[resourceKey] || []); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    toast.success("Record deleted");
    load();
  };

  return (
    <div>
      <AdminPageHeader title={title} subtitle={subtitle} />
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>
      ) : (
        <AdminTable headers={[...columns.map((c) => c.header), "Actions"]}>
          {items.length === 0 ? <EmptyRow colSpan={columns.length + 1} label="No records yet." /> : items.map((item) => (
            <tr key={item.id} className="hover:bg-[#F9FAFB]/50">
              {columns.map((c, i) => <td key={i} className="px-4 py-3">{c.cell(item)}</td>)}
              <td className="px-4 py-3">
                <button onClick={() => handleDelete(item.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center">
                  <Trash2 className="size-3.5 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  );
}

/** Newsletter list — read-only + delete */
export function NewsletterPage() {
  return (
    <SimpleListPage
      title="Newsletter Subscribers"
      subtitle="Email subscribers from the website footer form."
      endpoint="/api/admin/newsletter"
      resourceKey="subscribers"
      columns={[
        { header: "Email", cell: (s) => <span className="font-medium text-[#0A1F44]">{s.email}</span> },
        { header: "Name", cell: (s) => <span className="text-xs text-muted-foreground">{s.name || "—"}</span> },
        { header: "Locale", cell: (s) => <span className="text-xs">{s.locale || "en"}</span> },
        { header: "Subscribed", cell: (s) => <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span> },
      ]}
    />
  );
}

/** Valuations list — read-only + status update + delete */
export function ValuationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); fetch("/api/admin/valuations").then((r) => r.json()).then((d) => { setItems(d.valuations || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/valuations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/valuations/${id}`, { method: "DELETE" }); load(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>;

  return (
    <div>
      <AdminPageHeader title="Valuation Requests" subtitle="Property valuation requests from the website valuation form." />
      <AdminTable headers={["Name", "Contact", "Property", "Timeline", "Status", "Actions"]}>
        {items.length === 0 ? <EmptyRow colSpan={6} label="No valuation requests yet." /> : items.map((v) => (
          <tr key={v.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3"><div className="font-medium text-[#0A1F44]">{v.name}</div><div className="text-xs text-muted-foreground">{v.email}</div></td>
            <td className="px-4 py-3 text-xs">{v.phone || "—"}</td>
            <td className="px-4 py-3 text-xs">{v.propertyType} · {v.community} · {v.bedrooms}br · {v.area}sqft</td>
            <td className="px-4 py-3 text-xs text-muted-foreground">{v.timeline || "—"}</td>
            <td className="px-4 py-3">
              <select value={v.status} onChange={(e) => updateStatus(v.id, e.target.value)} className="text-xs bg-[#F9FAFB] rounded-md px-2 py-1 border border-border">
                <option value="new">new</option><option value="contacted">contacted</option><option value="completed">completed</option><option value="lost">lost</option>
              </select>
            </td>
            <td className="px-4 py-3">
              <button onClick={() => handleDelete(v.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

/** Mortgages list */
export function MortgagesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); fetch("/api/admin/mortgages").then((r) => r.json()).then((d) => { setItems(d.mortgages || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const updateStatus = async (id: string, status: string) => { await fetch(`/api/admin/mortgages/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); load(); };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/mortgages/${id}`, { method: "DELETE" }); load(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>;
  return (
    <div>
      <AdminPageHeader title="Mortgage Enquiries" subtitle="Mortgage pre-qualification requests from the calculator." />
      <AdminTable headers={["Name", "Contact", "Property Price", "Down Payment", "Status", "Actions"]}>
        {items.length === 0 ? <EmptyRow colSpan={6} label="No mortgage enquiries yet." /> : items.map((m) => (
          <tr key={m.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3"><div className="font-medium text-[#0A1F44]">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></td>
            <td className="px-4 py-3 text-xs">{m.phone || "—"}</td>
            <td className="px-4 py-3 text-xs">AED {(m.propertyPrice || 0).toLocaleString()}</td>
            <td className="px-4 py-3 text-xs">AED {(m.downPayment || 0).toLocaleString()}</td>
            <td className="px-4 py-3">
              <select value={m.status} onChange={(e) => updateStatus(m.id, e.target.value)} className="text-xs bg-[#F9FAFB] rounded-md px-2 py-1 border border-border">
                <option value="new">new</option><option value="contacted">contacted</option><option value="qualified">qualified</option><option value="lost">lost</option>
              </select>
            </td>
            <td className="px-4 py-3">
              <button onClick={() => handleDelete(m.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}

/** Appointments list */
export function AppointmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); fetch("/api/admin/appointments").then((r) => r.json()).then((d) => { setItems(d.appointments || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const updateStatus = async (id: string, status: string) => { await fetch(`/api/admin/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }); load(); };
  const handleDelete = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" }); load(); };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>;
  return (
    <div>
      <AdminPageHeader title="Appointments" subtitle="Property viewing and consultation appointments." />
      <AdminTable headers={["Lead", "Type", "Scheduled", "Property", "Status", "Actions"]}>
        {items.length === 0 ? <EmptyRow colSpan={6} label="No appointments yet." /> : items.map((a) => (
          <tr key={a.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3">{a.lead ? <div><div className="font-medium text-[#0A1F44] text-sm">{a.lead.name}</div><div className="text-xs text-muted-foreground">{a.lead.email}</div></div> : "—"}</td>
            <td className="px-4 py-3 text-xs capitalize">{a.type}</td>
            <td className="px-4 py-3 text-xs">{new Date(a.scheduledAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
            <td className="px-4 py-3 text-xs">{a.propertyRef || "—"}</td>
            <td className="px-4 py-3">
              <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} className="text-xs bg-[#F9FAFB] rounded-md px-2 py-1 border border-border">
                <option value="scheduled">scheduled</option><option value="completed">completed</option><option value="cancelled">cancelled</option><option value="noshow">noshow</option>
              </select>
            </td>
            <td className="px-4 py-3">
              <button onClick={() => handleDelete(a.id)} className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center"><Trash2 className="size-3.5 text-red-600" /></button>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
