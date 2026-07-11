export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.siteSetting.findMany({ orderBy: { category: "asc" } });
  return NextResponse.json({ settings: items });
}

export async function PUT(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  // body: { settings: [{ key, value, category }] }
  if (!Array.isArray(body.settings)) {
    return NextResponse.json({ error: "settings array required" }, { status: 400 });
  }
  for (const s of body.settings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, category: s.category || "general" },
      create: { key: s.key, value: s.value, category: s.category || "general" },
    });
  }
  return NextResponse.json({ success: true });
}
