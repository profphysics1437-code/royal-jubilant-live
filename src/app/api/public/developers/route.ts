import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const developers = await db.developer.findMany({
    where: { published: true },
    orderBy: { name: "asc" },
  });

  const mapped = developers.map((d) => ({
    id: d.id,
    name: d.name,
    logo: d.logo,
    founded: d.founded,
    headquarters: d.headquarters,
    overview: d.overview,
    totalProjects: d.totalProjects,
    completedProjects: d.completedProjects,
    ongoingProjects: d.ongoingProjects,
    awards: JSON.parse(d.awards || "[]"),
    hero: d.hero,
    topProjects: JSON.parse(d.topProjects || "[]"),
  }));

  return NextResponse.json({ developers: mapped }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
