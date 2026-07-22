"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2, Phone, Calendar, DollarSign, Clock, TrendingUp,
  ArrowRight, Plus, AlertCircle,
} from "lucide-react";
import { AdminPageHeader, AdminStat, AdminCard, AdminTable, EmptyRow } from "@/components/admin/AdminUI";
import { formatPrice } from "@/lib/data";
import AgentAIAssistant from "@/components/ai/AgentAIAssistant";

export default function AgentDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/agent/stats").then((r) => r.json()),
      fetch("/api/agent/leads?limit=5").then((r) => r.json()),
      fetch("/api/agent/listings").then((r) => r.json()),
    ]).then(([s, l, p]) => {
      setStats(s);
      setRecentLeads(l.leads || []);
      setRecentListings((p.properties || []).slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-10 border-4 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="My Dashboard"
        subtitle="Your performance overview — listings, leads, appointments and commission."
      />

      {/* Top stats — all cards clickable */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStat label="My Listings" value={stats?.myListings ?? 0} icon={<Building2 className="size-5" />} color="royal" href="/agent/listings" />
        <AdminStat label="My Leads" value={stats?.myLeads ?? 0} icon={<Phone className="size-5" />} color="gold" href="/agent/leads" />
        <AdminStat label="Appointments" value={stats?.myAppointments ?? 0} icon={<Calendar className="size-5" />} color="royal" href="/agent/appointments" />
        <AdminStat label="Pending Approval" value={stats?.pendingListings ?? 0} icon={<Clock className="size-5" />} color="red" href="/agent/listings" />
      </div>

      {/* Commission summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <AdminCard className="p-5 lg:col-span-2 bg-royal-gradient-diagonal text-white border-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs tracking-luxury uppercase text-[#A68A3F] font-medium mb-2">Total Commission (Lifetime)</div>
              <div className="font-serif text-3xl lg:text-4xl font-semibold">AED {(stats?.totalCommission ?? 0).toLocaleString()}</div>
              <div className="text-white/70 text-sm mt-2">From {stats?.commissions ?? 0} closed deals · AED {((stats?.totalDealValue ?? 0) / 1000000).toFixed(2)}M total deal value</div>
            </div>
            <div className="size-12 rounded-xl bg-white/15 flex items-center justify-center">
              <DollarSign className="size-6 text-[#A68A3F]" />
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-white/15 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-white/60">Paid</div>
              <div className="font-serif text-xl font-semibold">AED {(stats?.paidCommission ?? 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-white/60">Pending / Invoiced</div>
              <div className="font-serif text-xl font-semibold">AED {(stats?.pendingCommission ?? 0).toLocaleString()}</div>
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h3 className="font-serif text-base font-medium text-[#0A1F44] mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/agent/listings/new" className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#C9A961]/10 transition-colors text-sm">
              <Plus className="size-4 text-[#A68A3F]" /> Add Property
            </Link>
            <Link href="/agent/leads" className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#C9A961]/10 transition-colors text-sm">
              <Phone className="size-4 text-[#A68A3F]" /> View Lead Inbox
            </Link>
            <Link href="/agent/commission" className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#C9A961]/10 transition-colors text-sm">
              <DollarSign className="size-4 text-[#A68A3F]" /> Commission Tracker
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Recent leads + listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-medium text-[#0A1F44]">Recent Leads</h2>
            <Link href="/agent/leads" className="text-xs text-[#A68A3F] hover:underline flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <AdminTable headers={["Name", "Source", "Status", "Received"]}>
            {recentLeads.length === 0 ? (
              <EmptyRow colSpan={4} label="No leads assigned to you yet." />
            ) : (
              recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#F9FAFB]/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#0A1F44]">{lead.name}</div>
                    <div className="text-xs text-muted-foreground">{lead.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{lead.source}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{lead.status}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                </tr>
              ))
            )}
          </AdminTable>
        </AdminCard>

        <AdminCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-medium text-[#0A1F44]">My Recent Listings</h2>
            <Link href="/agent/listings" className="text-xs text-[#A68A3F] hover:underline flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <AdminTable headers={["Reference", "Title", "Price", "Status"]}>
            {recentListings.length === 0 ? (
              <EmptyRow colSpan={4} label="No listings yet. Click 'Add Property' to create your first." />
            ) : (
              recentListings.map((p) => (
                <tr key={p.id} className="hover:bg-[#F9FAFB]/50">
                  <td className="px-4 py-3 text-xs font-mono text-[#A68A3F]">{p.reference}</td>
                  <td className="px-4 py-3"><div className="font-medium text-[#0A1F44] line-clamp-1">{p.title}</div></td>
                  <td className="px-4 py-3 text-xs">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-700">Live</span>
                    ) : (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700">Pending</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </AdminTable>
        </AdminCard>
      </div>

      {stats?.pendingListings > 0 && (
        <AdminCard className="p-4 mt-6 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>{stats?.pendingListings}</strong> of your listings are awaiting admin approval. They won't appear on the public website until approved.
            </p>
          </div>
        </AdminCard>
      )}

      <AgentAIAssistant />
    </div>
  );
}
