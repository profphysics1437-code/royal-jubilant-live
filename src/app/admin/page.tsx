"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Phone,
  Tag,
  Calculator,
  Mail,
  TrendingUp,
  Eye,
  Clock,
  ArrowRight,
  MapPin,
  HardHat,
} from "lucide-react";
import { AdminPageHeader, AdminStat, AdminCard, AdminTable, StatusBadge, EmptyRow } from "@/components/admin/AdminUI";
import AdminAIInsights from "@/components/ai/AdminAIInsights";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/leads?limit=5").then((r) => r.json()),
    ]).then(([s, l]) => {
      setStats(s);
      setRecentLeads(l.leads || []);
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
        title="Dashboard"
        subtitle="Royal Jubilant Real Estate LLC — full control panel for properties, leads, agents and content."
      />

      {/* Stats grid — all cards clickable, navigate to their module */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AdminStat label="Properties" value={stats?.properties ?? 0} icon={<Building2 className="size-5" />} color="royal" href="/admin/properties" />
        <AdminStat label="Agents" value={stats?.agents ?? 0} icon={<Users className="size-5" />} color="gold" href="/admin/agents" />
        <AdminStat label="Communities" value={stats?.communities ?? 0} icon={<MapPin className="size-5" />} color="royal" href="/admin/communities" />
        <AdminStat label="Developers" value={stats?.developers ?? 0} icon={<HardHat className="size-5" />} color="gold" href="/admin/developers" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <AdminStat label="New Leads" value={stats?.newLeads ?? 0} icon={<Phone className="size-5" />} color="royal" trend="+12%" href="/admin/leads" />
        <AdminStat label="Valuations" value={stats?.valuations ?? 0} icon={<Tag className="size-5" />} color="gold" href="/admin/valuations" />
        <AdminStat label="Mortgages" value={stats?.mortgages ?? 0} icon={<Calculator className="size-5" />} color="royal" href="/admin/mortgages" />
        <AdminStat label="Subscribers" value={stats?.subscribers ?? 0} icon={<Mail className="size-5" />} color="gold" trend="+8%" href="/admin/newsletter" />
      </div>

      {/* Recent leads + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <AdminCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-medium text-[#0A1F44]">Recent Leads</h2>
              <Link href="/admin/leads" className="text-xs text-[#A68A3F] hover:underline flex items-center gap-1">
                View all <ArrowRight className="size-3" />
              </Link>
            </div>
            <AdminTable headers={["Name", "Source", "Status", "Received"]}>
              {recentLeads.length === 0 ? (
                <EmptyRow colSpan={4} label="No leads yet" />
              ) : (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F9FAFB]/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0A1F44]">{lead.name}</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{lead.source}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))
              )}
            </AdminTable>
          </AdminCard>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <AdminCard className="p-5">
            <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/properties", label: "Add Property", icon: Building2 },
                { href: "/admin/agents", label: "Add Agent", icon: Users },
                { href: "/admin/blog", label: "Write Blog Post", icon: Mail },
                { href: "/admin/communities", label: "Add Community", icon: MapPin },
                { href: "/admin/settings", label: "Edit Site Settings", icon: TrendingUp },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#F9FAFB] hover:bg-[#C9A961]/10 transition-colors group"
                >
                  <div className="size-9 rounded-lg bg-royal-gradient-diagonal text-white flex items-center justify-center">
                    <a.icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-[#0A1F44] flex-1">{a.label}</span>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-[#A68A3F] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <h2 className="font-serif text-lg font-medium text-[#0A1F44] mb-3">Quick View</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="flex items-center gap-2 text-muted-foreground"><Eye className="size-3.5" /> Total views</span>
                <span className="font-medium text-[#0A1F44]">{stats?.totalViews ?? 0}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/60">
                <span className="flex items-center gap-2 text-muted-foreground"><Clock className="size-3.5" /> Pending leads</span>
                <span className="font-medium text-[#0A1F44]">{stats?.newLeads ?? 0}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="flex items-center gap-2 text-muted-foreground"><TrendingUp className="size-3.5" /> Featured props</span>
                <span className="font-medium text-[#0A1F44]">{stats?.featuredProps ?? 0}</span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <AdminAIInsights />
    </div>
  );
}
