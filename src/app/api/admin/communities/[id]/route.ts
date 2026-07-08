import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

const ARRAY_FIELDS = ["highlights", "schools", "hospitals", "transport", "shopping", "nearbyCommunities", "stats"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body: any = await req.json();
  const data: any = { ...body };
  ARRAY_FIELDS.forEach((k) => { if (Array.isArray(data[k])) data[k] = JSON.stringify(data[k]); });
  if (data.totalProperties !== undefined) data.totalProperties = Number(data.totalProperties) || 0;
  if (data.rating !== undefined) data.rating = Number(data.rating) || 4.5;
  if (data.published !== undefined) data.published = Boolean(data.published);
  const item = await db.community.update({ where: { id }, data });
  return NextResponse.json({ community: item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.community.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
