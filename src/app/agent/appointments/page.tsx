"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminPageHeader, AdminTable, EmptyRow } from "@/components/admin/AdminUI";

export default function AgentAppointments() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); fetch("/api/agent/appointments").then((r) => r.json()).then((d) => { setItems(d.appointments || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/agent/appointments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>;

  return (
    <div>
      <AdminPageHeader title="My Appointments" subtitle="Property viewings and consultations scheduled with your leads." />
      <AdminTable headers={["Lead", "Type", "Scheduled", "Property", "Status"]}>
        {items.length === 0 ? <EmptyRow colSpan={5} label="No appointments yet." /> : items.map((a) => (
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
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
