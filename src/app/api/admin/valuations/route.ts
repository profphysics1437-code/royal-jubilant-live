export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.valuationRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ valuations: items });
}
