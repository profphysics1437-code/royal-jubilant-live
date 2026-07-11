export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;

  const { id } = await params;
  const body = await req.json();

  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.phone !== undefined) data.phone = body.phone || null;
  if (body.role !== undefined) data.role = body.role;
  if (body.preferredLang !== undefined) data.preferredLang = body.preferredLang || null;
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl || null;

  // Password reset
  if (body.password) {
    data.passwordHash = bcrypt.hashSync(body.password, 10);
  }

  const user = await db.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true },
  });

  await logActivity(req, "update", "user", user.id, `Updated user ${user.email}`);
  return NextResponse.json({ user });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;

  const { id } = await params;
  const user = await db.user.delete({ where: { id }, select: { id: true, email: true } });

  await logActivity(req, "delete", "user", user.id, `Deleted user ${user.email}`);
  return NextResponse.json({ success: true });
}
