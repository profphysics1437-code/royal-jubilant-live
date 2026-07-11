export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body: any = await req.json();
  const item = await db.mortgageEnquiry.update({ where: { id }, data: { status: body.status || "new" } });
  return NextResponse.json({ mortgage: item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.mortgageEnquiry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
