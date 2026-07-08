import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatarUrl: true,
      preferredLang: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const body = await req.json();
  if (!body.email || !body.name) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 400 });
  }

  const passwordHash = body.password
    ? bcrypt.hashSync(body.password, 10)
    : null;

  const user = await db.user.create({
    data: {
      email: body.email,
      name: body.name,
      phone: body.phone || null,
      role: body.role || "customer",
      passwordHash,
      preferredLang: body.preferredLang || null,
    },
    select: { id: true, email: true, name: true, role: true },
  });

  await logActivity(req, "create", "user", user.id, `Created user ${user.email} (${user.role})`);
  return NextResponse.json({ user });
}
