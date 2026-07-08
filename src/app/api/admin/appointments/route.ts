import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.appointment.findMany({
    orderBy: { scheduledAt: "desc" },
    include: { lead: true },
  });
  return NextResponse.json({ appointments: items });
}
