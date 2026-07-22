export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatarUrl: true,
      preferredLang: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const data: any = {};

  // Update name
  if (body.name !== undefined) data.name = body.name;
  // Update phone
  if (body.phone !== undefined) data.phone = body.phone || null;
  // Update avatar URL
  if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl || null;
  // Update preferred language
  if (body.preferredLang !== undefined) data.preferredLang = body.preferredLang || null;

  // Password change — requires current password verification
  if (body.newPassword) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: "Current password required to change password" }, { status: 400 });
    }
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Cannot change password" }, { status: 400 });
    }
    const valid = await bcrypt.compare(body.currentPassword, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    if (body.newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }
    data.passwordHash = bcrypt.hashSync(body.newPassword, 10);
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      avatarUrl: true,
      preferredLang: true,
    },
  });

  await logActivity(req, "update", "user_profile", updated.id, `Updated profile: ${updated.email}`);

  return NextResponse.json({ user: updated });
}
