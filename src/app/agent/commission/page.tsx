export const dynamic = "force-dynamic";

"use client";

import { useEffect, useState } from "react";
import { Loader2, DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminTable, EmptyRow } from "@/components/admin/AdminUI";

export default function AgentCommission() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent/commission").then((r) => r.json()).then((d) => { setItems(d.commissions || []); setLoading(false); });
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="size-8 animate-spin text-[#A68A3F]" /></div>;

  const totalEarned = items.reduce((s, c) => s + c.commissionAmt, 0);
  const paid = items.filter((c) => c.status === "paid").reduce((s, c) => s + c.commissionAmt, 0);
  const pending = items.filter((c) => c.status !== "paid").reduce((s, c) => s + c.commissionAmt, 0);
  const totalDealValue = items.reduce((s, c) => s + c.dealValue, 0);

  return (
    <div>
      <AdminPageHeader title="Commission Tracking" subtitle="Your commission records across all closed deals. Commissions are added by admin when a deal closes." />

      {/* Summary cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <AdminCard className="p-5 bg-royal-gradient-diagonal text-white border-0">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium">Total Earned</div>
            <DollarSign className="size-5 text-[#A68A3F]" />
          </div>
          <div className="font-serif text-3xl font-semibold">AED {totalEarned.toLocaleString()}</div>
          <div className="text-white/70 text-xs mt-2">{items.length} closed deals · AED {(totalDealValue / 1000000).toFixed(2)}M total deal value</div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium">Paid Out</div>
            <CheckCircle2 className="size-5 text-green-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-green-700">AED {paid.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-2">{items.filter((c) => c.status === "paid").length} commission(s) paid</div>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium">Pending / Invoiced</div>
            <Clock className="size-5 text-amber-600" />
          </div>
          <div className="font-serif text-2xl font-semibold text-amber-700">AED {pending.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-2">{items.filter((c) => c.status !== "paid").length} commission(s) outstanding</div>
        </AdminCard>
      </div>

      <AdminTable headers={["Property", "Deal Value", "Commission %", "Commission Amount", "Status", "Date"]}>
        {items.length === 0 ? <EmptyRow colSpan={6} label="No commission records yet. Commissions are added by admin when you close a deal." /> : items.map((c) => (
          <tr key={c.id} className="hover:bg-[#F9FAFB]/50">
            <td className="px-4 py-3 text-xs font-mono">{c.propertyRef || "—"}</td>
            <td className="px-4 py-3 text-sm font-medium">AED {c.dealValue.toLocaleString()}</td>
            <td className="px-4 py-3 text-xs">{c.commissionPct}%</td>
            <td className="px-4 py-3 text-sm font-semibold text-[#A68A3F]">AED {c.commissionAmt.toLocaleString()}</td>
            <td className="px-4 py-3">
              <span className={`text-[10px] px-2 py-1 rounded-full ${c.status === "paid" ? "bg-green-100 text-green-700" : c.status === "invoiced" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                {c.status}
              </span>
            </td>
            <td className="px-4 py-3 text-xs text-muted-foreground">
              {c.paidAt ? `Paid ${new Date(c.paidAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : new Date(c.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
