import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

const ARRAY_FIELDS = ["highlights", "schools", "hospitals", "transport", "shopping", "nearbyCommunities", "stats"];

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.community.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ communities: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body: any = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const data: any = { ...body };
  ARRAY_FIELDS.forEach((k) => {
    if (Array.isArray(data[k])) data[k] = JSON.stringify(data[k]);
  });
  if (data.totalProperties !== undefined) data.totalProperties = Number(data.totalProperties) || 0;
  if (data.rating !== undefined) data.rating = Number(data.rating) || 4.5;
  if (data.published !== undefined) data.published = Boolean(data.published);
  const item = await db.community.create({ data });
  return NextResponse.json({ community: item });
}
