import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const communities = await db.community.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });

  const mapped = communities.map((c) => ({
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
  }));

  return NextResponse.json({ communities: mapped }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
