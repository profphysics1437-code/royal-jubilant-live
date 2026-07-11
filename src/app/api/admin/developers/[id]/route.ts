export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

const ARRAY_FIELDS = ["awards", "topProjects"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body: any = await req.json();
  const data: any = { ...body };
  ARRAY_FIELDS.forEach((k) => { if (Array.isArray(data[k])) data[k] = JSON.stringify(data[k]); });
  ["totalProjects", "completedProjects", "ongoingProjects"].forEach((k) => {
    if (data[k] !== undefined) data[k] = Number(data[k]) || 0;
  });
  if (data.published !== undefined) data.published = Boolean(data.published);
  const item = await db.developer.update({ where: { id }, data });
  return NextResponse.json({ developer: item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.developer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
