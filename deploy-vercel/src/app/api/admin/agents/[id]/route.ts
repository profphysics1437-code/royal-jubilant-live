import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  const body: any = await req.json();
  const data: any = { ...body };
  ["languages", "specializations", "communities", "awards"].forEach((k) => {
    if (Array.isArray(data[k])) data[k] = JSON.stringify(data[k]);
  });
  ["rating", "reviewsCount", "activeListings", "soldProperties", "experienceYears", "order"].forEach((k) => {
    if (data[k] !== undefined) data[k] = Number(data[k]);
  });
  if (data.published !== undefined) data.published = Boolean(data.published);
  const agent = await db.agent.update({ where: { id }, data });
  return NextResponse.json({ agent });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const { id } = await params;
  await db.agent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
