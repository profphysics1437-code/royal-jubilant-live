import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body: any = await req.json();
  if (body.rating !== undefined) body.rating = Number(body.rating);
  if (body.published !== undefined) body.published = Boolean(body.published);
  const item = await db.testimonial.update({ where: { id }, data: body });
  return NextResponse.json({ testimonial: item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
