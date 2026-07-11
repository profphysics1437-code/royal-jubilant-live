export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    // Inventory metrics
    totalProperties,
    saleProperties,
    rentProperties,
    commercialProperties,
    offPlanProperties,
    featuredProperties,
    publishedProperties,
    // Lead metrics
    totalLeads,
    newLeads,
    contactedLeads,
    wonLeads,
    lostLeads,
    leadsLast30Days,
    leadsLast7Days,
    // Lead sources
    leadSources,
    // Lead intents
    leadIntents,
    // Other inquiries
    valuations,
    mortgages,
    appointments,
    newsletter,
    // Agent performance
    agentStats,
    // Recent activity (last 30 days)
    recentActivityCount,
    // Property views
    totalViewsAgg,
    // Top communities
    topCommunities,
    // Top property types
    topPropertyTypes,
    // Time-series: leads per day (last 14 days)
    leadsTimeline,
    // Time-series: properties created per day (last 14 days)
    propertiesTimeline,
  ] = await Promise.all([
    db.property.count(),
    db.property.count({ where: { status: "sale" } }),
    db.property.count({ where: { status: "rent" } }),
    db.property.count({ where: { category: "Commercial" } }),
    db.property.count({ where: { completionStatus: "Off-Plan" } }),
    db.property.count({ where: { featured: true } }),
    db.property.count({ where: { published: true } }),
    db.lead.count(),
    db.lead.count({ where: { status: "new" } }),
    db.lead.count({ where: { status: "contacted" } }),
    db.lead.count({ where: { status: "won" } }),
    db.lead.count({ where: { status: "lost" } }),
    db.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    db.lead.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
    db.lead.groupBy({ by: ["intent"], _count: true, orderBy: { _count: { intent: "desc" } } }),
    db.valuationRequest.count(),
    db.mortgageEnquiry.count(),
    db.appointment.count(),
    db.newsletterSubscriber.count(),
    // Agent performance — count properties per agent user
    db.property.groupBy({
      by: ["agentId"],
      _count: true,
      orderBy: { _count: { agentId: "desc" } },
      take: 10,
    }),
    db.activityLog.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.property.aggregate({ _sum: { views: true } }),
    db.property.groupBy({ by: ["community"], _count: true, orderBy: { _count: { community: "desc" } }, take: 8 }),
    db.property.groupBy({ by: ["type"], _count: true, orderBy: { _count: { type: "desc" } }, take: 8 }),
    // Time-series — fetch all leads from last 14 days, group in JS
    db.lead.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
    db.property.findMany({
      where: { createdAt: { gte: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) } },
      select: { createdAt: true },
    }),
  ]);

  // Resolve agent names
  const agentIds = agentStats.map((a) => a.agentId).filter(Boolean) as string[];
  const agentUsers = agentIds.length
    ? await db.user.findMany({ where: { id: { in: agentIds } }, select: { id: true, name: true, email: true } })
    : [];
  const agentMap = new Map(agentUsers.map((u) => [u.id, u]));

  // Build timeline series (last 14 days)
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    days.push(d.toISOString().split("T")[0]);
  }
  const leadsByDay = new Map<string, number>();
  leadsTimeline.forEach((l) => {
    const key = l.createdAt.toISOString().split("T")[0];
    leadsByDay.set(key, (leadsByDay.get(key) || 0) + 1);
  });
  const propsByDay = new Map<string, number>();
  propertiesTimeline.forEach((p) => {
    const key = p.createdAt.toISOString().split("T")[0];
    propsByDay.set(key, (propsByDay.get(key) || 0) + 1);
  });

  // Conversion rate
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : "0.0";

  return NextResponse.json({
    inventory: {
      total: totalProperties,
      sale: saleProperties,
      rent: rentProperties,
      commercial: commercialProperties,
      offPlan: offPlanProperties,
      featured: featuredProperties,
      published: publishedProperties,
    },
    leads: {
      total: totalLeads,
      new: newLeads,
      contacted: contactedLeads,
      won: wonLeads,
      lost: lostLeads,
      last30Days: leadsLast30Days,
      last7Days: leadsLast7Days,
      conversionRate: parseFloat(conversionRate),
    },
    sources: leadSources.map((s) => ({ source: s.source || "unknown", count: (s as any)._count ?? 0 })),
    intents: leadIntents.map((i) => ({ intent: i.intent || "unknown", count: (i as any)._count ?? 0 })),
    inquiries: {
      valuations,
      mortgages,
      appointments,
      newsletter,
    },
    agents: agentStats
      .filter((a) => a.agentId)
      .map((a) => {
        const u = agentMap.get(a.agentId!);
        return {
          id: a.agentId,
          name: u?.name || u?.email || "Unknown",
          listings: (a as any)._count ?? 0,
        };
      }),
    recentActivity: recentActivityCount,
    totalViews: totalViewsAgg._sum.views ?? 0,
    topCommunities: topCommunities.map((c) => ({ name: c.community || "Unknown", count: (c as any)._count ?? 0 })),
    topTypes: topPropertyTypes.map((t) => ({ name: t.type || "Unknown", count: (t as any)._count ?? 0 })),
    timeline: {
      days,
      leads: days.map((d) => leadsByDay.get(d) || 0),
      properties: days.map((d) => propsByDay.get(d) || 0),
    },
  });
}
