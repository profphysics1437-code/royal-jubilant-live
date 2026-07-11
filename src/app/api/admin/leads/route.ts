export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 100);
  const status = searchParams.get("status");

  const leads = await db.lead.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ leads });
}

export async function PATCH(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { id, status, assignedTo, notes } = body;

  if (!id) return NextResponse.json({ error: "Lead id required" }, { status: 400 });

  const lead = await db.lead.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(assignedTo !== undefined ? { assignedTo } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  return NextResponse.json({ lead });
}

export async function DELETE(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Lead id required" }, { status: 400 });

  await db.lead.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
