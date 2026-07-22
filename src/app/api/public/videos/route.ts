export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const videos = await db.video.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(
    { videos },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
