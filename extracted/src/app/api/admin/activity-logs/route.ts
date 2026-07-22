import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const logs = await db.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ logs });
}
