"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Users, Building2, Target, Eye, Download, Mail, Calendar, Calculator } from "lucide-react";
import { AdminPageHeader, AdminCard, AdminStat } from "@/components/admin/AdminUI";
import { toast } from "sonner";

interface Report {
  inventory: { total: number; sale: number; rent: number; commercial: number; offPlan: number; featured: number; published: number };
  leads: { total: number; new: number; contacted: number; won: number; lost: number; last30Days: number; last7Days: number; conversionRate: number };
  sources: { source: string; count: number }[];
  intents: { intent: string; count: number }[];
  inquiries: { valuations: number; mortgages: number; appointments: number; newsletter: number };
  agents: { id: string | null; name: string; listings: number }[];
  recentActivity: number;
  totalViews: number;
  topCommunities: { name: string; count: number }[];
  topTypes: { name: string; count: number }[];
  timeline: { days: string[]; leads: number[]; properties: number[] };
}

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => {
        // Validate that the response is a real report object (not {error: ...})
        if (d && d.timeline && d.inventory) {
          setReport(d);
        } else if (d.error) {
          toast.error(`Failed to load reports: ${d.error}`);
        }
        setLoading(false);
      })
      .catch(() => { toast.error("Failed to load reports"); setLoading(false); });
  }, []);

  if (loading || !report) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-[#C9A961]" />
      </div>
    );
  }

  // Defensive defaults — if any nested field is missing, use empty arrays
  const timeline = report.timeline || { days: [], leads: [], properties: [] };
  const topCommunities = report.topCommunities || [];
  const sources = report.sources || [];
  const intents = report.intents || [];
  const agents = report.agents || [];
  const topTypes = report.topTypes || [];

  const maxLead = Math.max(...(timeline.leads || []), 1);
  const maxProp = Math.max(...(timeline.properties || []), 1);
  const maxCommunity = Math.max(...topCommunities.map((c) => c.count), 1);

  return (
    <div>
      <AdminPageHeader
        title="Reports & Analytics"
        subtitle="Real-time business intelligence across inventory, leads, agents, and customer engagement. Snapshots cover the last 30 days unless noted."
        action={
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-sm bg-[#0A1F44] text-white px-4 py-2 rounded-lg hover:bg-[#0A1F44]/90"
          >
            <Download className="size-4" /> Export PDF
          </button>
        }
      />

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStat label="Total Properties" value={report.inventory.total} icon={<Building2 className="size-5" />} color="royal" />
        <AdminStat label="Total Leads" value={report.leads.total} icon={<Users className="size-5" />} color="gold" trend={`+${report.leads.last7Days} this week`} />
        <AdminStat label="Conversion Rate" value={`${report.leads.conversionRate}%`} icon={<Target className="size-5" />} color="green" />
        <AdminStat label="Total Views" value={report.totalViews} icon={<Eye className="size-5" />} color="royal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <AdminStat label="Leads (Last 30 Days)" value={report.leads.last30Days} icon={<TrendingUp className="size-5" />} color="gold" />
        <AdminStat label="Newsletter Subscribers" value={report.inquiries.newsletter} icon={<Mail className="size-5" />} color="royal" />
        <AdminStat label="Appointments" value={report.inquiries.appointments} icon={<Calendar className="size-5" />} color="gold" />
      </div>

      {/* Inventory breakdown */}
      <AdminCard className="p-6 mb-6">
        <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Inventory Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "For Sale", value: report.inventory.sale, color: "bg-blue-500" },
            { label: "For Rent", value: report.inventory.rent, color: "bg-[#C9A961]" },
            { label: "Commercial", value: report.inventory.commercial, color: "bg-purple-500" },
            { label: "Off-Plan", value: report.inventory.offPlan, color: "bg-pink-500" },
            { label: "Featured", value: report.inventory.featured, color: "bg-green-500" },
            { label: "Published", value: report.inventory.published, color: "bg-emerald-600" },
            { label: "Total", value: report.inventory.total, color: "bg-[#0A1F44]" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className={`h-20 ${s.color} rounded-t-lg flex items-end justify-center text-white font-serif text-xl font-semibold pb-2`}>
                {s.value}
              </div>
              <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-2">{s.label}</div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* Timeline chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AdminCard className="p-6">
          <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Leads (Last 14 Days)</h2>
          <div className="flex items-end gap-1 h-40">
            {timeline.leads.map((v, i) => (
              <div key={i} className="flex-1 group relative">
                <div
                  className="bg-gradient-to-t from-[#0A1F44] to-[#C9A961] rounded-t hover:opacity-80 transition-opacity"
                  style={{ height: `${(v / maxLead) * 100}%`, minHeight: v > 0 ? "4px" : "0" }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-[#0A1F44] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            <span>{timeline.days[0]}</span>
            <span>{timeline.days[13]}</span>
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">New Properties (Last 14 Days)</h2>
          <div className="flex items-end gap-1 h-40">
            {timeline.properties.map((v, i) => (
              <div key={i} className="flex-1 group relative">
                <div
                  className="bg-gradient-to-t from-[#C9A961] to-[#F9D777] rounded-t hover:opacity-80 transition-opacity"
                  style={{ height: `${(v / maxProp) * 100}%`, minHeight: v > 0 ? "4px" : "0" }}
                />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] bg-[#0A1F44] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
            <span>{timeline.days[0]}</span>
            <span>{timeline.days[13]}</span>
          </div>
        </AdminCard>
      </div>

      {/* Lead pipeline + sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AdminCard className="p-6">
          <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Lead Pipeline</h2>
          <div className="space-y-3">
            {[
              { label: "New", value: report.leads.new, color: "bg-blue-500" },
              { label: "Contacted", value: report.leads.contacted, color: "bg-amber-500" },
              { label: "Won", value: report.leads.won, color: "bg-green-500" },
              { label: "Lost", value: report.leads.lost, color: "bg-red-500" },
            ].map((s) => {
              const pct = report.leads.total > 0 ? (s.value / report.leads.total) * 100 : 0;
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-medium text-[#0A1F44]">{s.value} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Lead Sources</h2>
          {sources.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No leads yet</p>
          ) : (
            <div className="space-y-2">
              {sources.map((s) => {
                const pct = report.leads.total > 0 ? (s.count / report.leads.total) * 100 : 0;
                return (
                  <div key={s.source} className="flex items-center gap-3">
                    <div className="text-xs font-medium text-[#0A1F44] w-24 truncate">{s.source}</div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A961]" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground w-8 text-right">{s.count}</div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Agent performance + top communities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <AdminCard className="p-6">
          <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Agent Performance (by Listings)</h2>
          {agents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No agent data</p>
          ) : (
            <div className="space-y-2">
              {agents.map((a, i) => (
                <div key={a.id || i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                  <div className="size-8 rounded-full bg-royal-gradient-diagonal flex items-center justify-center text-white text-xs font-bold">
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#0A1F44]">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.listings} listings</div>
                  </div>
                  <div className="text-[#A68A3F] font-serif font-semibold">{a.listings}</div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Top Communities</h2>
          {topCommunities.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No data</p>
          ) : (
            <div className="space-y-2">
              {topCommunities.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                  <div className="flex-1 text-sm font-medium text-[#0A1F44] truncate">{c.name}</div>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-24">
                    <div className="h-full bg-[#0A1F44]" style={{ width: `${(c.count / maxCommunity) * 100}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground w-6 text-right">{c.count}</div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Inquiries breakdown */}
      <AdminCard className="p-6">
        <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Customer Inquiries</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Valuation Requests", value: report.inquiries.valuations, icon: Calculator },
            { label: "Mortgage Enquiries", value: report.inquiries.mortgages, icon: Calculator },
            { label: "Appointments", value: report.inquiries.appointments, icon: Calendar },
            { label: "Newsletter Subs", value: report.inquiries.newsletter, icon: Mail },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="text-center p-4 rounded-xl bg-[#F9FAFB]">
                <Icon className="size-5 mx-auto text-[#C9A961] mb-2" />
                <div className="font-serif text-2xl font-semibold text-[#0A1F44]">{s.value}</div>
                <div className="text-[10px] tracking-luxury uppercase text-muted-foreground mt-1">{s.label}</div>
              </div>
            );
          })}
        </div>
      </AdminCard>
    </div>
  );
}
