import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body = await req.json();
  const data: any = { ...body };
  if (data.heading3 !== undefined) data.heading3 = data.heading3 || null;
  if (data.order !== undefined) data.order = Number(data.order);
  if (data.published !== undefined) data.published = Boolean(data.published);
  const slide = await db.heroSlide.update({ where: { id }, data });
  return NextResponse.json({ slide });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.heroSlide.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
