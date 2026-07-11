export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const awards = await db.award.findMany({
    where: { published: true },
    orderBy: { year: "desc" },
  });

  const mapped = awards.map((a) => ({
    id: a.id,
    title: a.title,
    issuer: a.issuer,
    year: a.year,
    icon: a.icon,
  }));

  return NextResponse.json({ awards: mapped }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
