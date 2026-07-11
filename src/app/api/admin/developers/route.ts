export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

const ARRAY_FIELDS = ["awards", "topProjects"];

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.developer.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ developers: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body: any = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const data: any = { ...body };
  ARRAY_FIELDS.forEach((k) => { if (Array.isArray(data[k])) data[k] = JSON.stringify(data[k]); });
  ["totalProjects", "completedProjects", "ongoingProjects"].forEach((k) => {
    if (data[k] !== undefined) data[k] = Number(data[k]) || 0;
  });
  if (data.published !== undefined) data.published = Boolean(data.published);
  const item = await db.developer.create({ data });
  return NextResponse.json({ developer: item });
}
