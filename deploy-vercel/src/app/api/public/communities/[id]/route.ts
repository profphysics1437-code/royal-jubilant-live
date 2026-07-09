import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await db.community.findUnique({ where: { id } });
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    community: {
      id: c.id,
      name: c.name,
      shortName: c.shortName,
      hero: c.hero,
      overview: c.overview,
      lifestyle: c.lifestyle,
      averagePrice: c.averagePrice,
      pricePerSqft: c.pricePerSqft,
      roi: c.roi,
      population: c.population,
      totalProperties: c.totalProperties,
      rating: c.rating,
      highlights: JSON.parse(c.highlights || "[]"),
      schools: JSON.parse(c.schools || "[]"),
      hospitals: JSON.parse(c.hospitals || "[]"),
      transport: JSON.parse(c.transport || "[]"),
      shopping: JSON.parse(c.shopping || "[]"),
      nearbyCommunities: JSON.parse(c.nearbyCommunities || "[]"),
      stats: JSON.parse(c.stats || "[]"),
    },
  });
}
