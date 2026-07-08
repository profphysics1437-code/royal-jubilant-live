import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await db.developer.findUnique({ where: { id } });
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    developer: {
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
    },
  });
}
