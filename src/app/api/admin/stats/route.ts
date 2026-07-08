import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const [
    properties,
    agents,
    communities,
    developers,
    leads,
    valuations,
    mortgages,
    subscribers,
    blogPosts,
    testimonials,
    awards,
    newLeads,
    featuredProps,
    totalViewsAgg,
  ] = await Promise.all([
    db.property.count(),
    db.agent.count(),
    db.community.count(),
    db.developer.count(),
    db.lead.count(),
    db.valuationRequest.count(),
    db.mortgageEnquiry.count(),
    db.newsletterSubscriber.count(),
    db.blogPost.count(),
    db.testimonial.count(),
    db.award.count(),
    db.lead.count({ where: { status: "new" } }),
    db.property.count({ where: { featured: true } }),
    db.property.aggregate({ _sum: { views: true } }),
  ]);

  return NextResponse.json({
    properties,
    agents,
    communities,
    developers,
    leads,
    valuations,
    mortgages,
    subscribers,
    blogPosts,
    testimonials,
    awards,
    newLeads,
    featuredProps,
    totalViews: totalViewsAgg._sum.views ?? 0,
  });
}
