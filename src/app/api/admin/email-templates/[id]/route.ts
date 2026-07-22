export const dynamic = "force-dynamic";

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
  if (body.name !== undefined) data.name = body.name;
  if (body.subject !== undefined) data.subject = body.subject;
  if (body.body !== undefined) data.body = body.body;
  if (body.category !== undefined) data.category = body.category;
  if (body.variables !== undefined) data.variables = body.variables ? JSON.stringify(body.variables) : null;
  if (body.active !== undefined) data.active = Boolean(body.active);

  const tpl = await db.emailTemplate.update({ where: { id }, data });
  await logActivity(req, "update", "email_template", tpl.id, `Updated template ${tpl.name}`);
  return NextResponse.json({ template: tpl });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;

  const { id } = await params;
  const tpl = await db.emailTemplate.delete({ where: { id }, select: { id: true, name: true } });
  await logActivity(req, "delete", "email_template", tpl.id, `Deleted template ${tpl.name}`);
  return NextResponse.json({ success: true });
}
