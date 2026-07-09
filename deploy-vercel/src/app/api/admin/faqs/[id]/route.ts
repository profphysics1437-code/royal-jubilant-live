import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body = await req.json();
  const data: any = {};
  if (body.question !== undefined) data.question = body.question;
  if (body.answer !== undefined) data.answer = body.answer;
  if (body.category !== undefined) data.category = body.category;
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.published !== undefined) data.published = Boolean(body.published);
  const faq = await db.faq.update({ where: { id }, data });
  await logActivity(req, "update", "faq", faq.id, `Updated FAQ: ${faq.question}`);
  return NextResponse.json({ faq });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  await db.faq.delete({ where: { id } });
  await logActivity(req, "delete", "faq", id, "Deleted FAQ");
  return NextResponse.json({ success: true });
}
