import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body = await req.json();
  const data: any = {};
  // Whitelist fields to prevent accidental mass-assignment
  if (body.label !== undefined) data.label = String(body.label);
  if (body.url !== undefined) data.url = String(body.url);
  if (body.view !== undefined) data.view = body.view ? String(body.view) : null;
  if (body.desc !== undefined) data.desc = body.desc ? String(body.desc) : null;
  if (body.badge !== undefined) data.badge = body.badge ? String(body.badge) : null;
  if (body.icon !== undefined) data.icon = body.icon ? String(body.icon) : null;
  if (body.parentId !== undefined) data.parentId = body.parentId || null;
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.visible !== undefined) data.visible = Boolean(body.visible);
  if (body.menu !== undefined) data.menu = String(body.menu);
  const item = await db.menuItem.update({ where: { id }, data });
  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.menuItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
