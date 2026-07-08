import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Lightweight endpoint used by Explore Property section to display
 * listing counts per category on the homepage.
 */
export async function GET() {
  const [
    totalSale,
    totalRent,
    totalCommercial,
    totalOffPlan,
    byEmirate,
  ] = await Promise.all([
    db.property.count({ where: { published: true, status: "sale" } }),
    db.property.count({ where: { published: true, status: "rent" } }),
    db.property.count({ where: { published: true, category: "Commercial" } }),
    db.property.count({ where: { published: true, completionStatus: "Off-Plan" } }),
    db.property.groupBy({
      by: ["emirate"],
      _count: true,
      where: { published: true },
    }),
  ]);

  return NextResponse.json({
    counts: {
      sale: totalSale,
      rent: totalRent,
      commercial: totalCommercial,
      offPlan: totalOffPlan,
      byEmirate: byEmirate.map((e) => ({
        emirate: e.emirate || "Dubai",
        count: (e as any)._count ?? 0,
      })),
    },
  });
}
