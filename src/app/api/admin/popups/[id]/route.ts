export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body = await req.json();
  const data: any = { ...body };
  if (data.delaySeconds !== undefined) data.delaySeconds = Number(data.delaySeconds);
  if (data.active !== undefined) data.active = Boolean(data.active);
  if (data.startDate !== undefined) data.startDate = data.startDate ? new Date(data.startDate) : null;
  if (data.endDate !== undefined) data.endDate = data.endDate ? new Date(data.endDate) : null;
  const popup = await db.popup.update({ where: { id }, data });
  return NextResponse.json({ popup });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.popup.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
