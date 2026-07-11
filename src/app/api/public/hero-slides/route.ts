export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const slides = await db.heroSlide.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ slides }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
