export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const { searchParams } = new URL(req.url);
  const menu = searchParams.get("menu") || "main";
  const items = await db.menuItem.findMany({
    where: { menu },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.label) return NextResponse.json({ error: "Label required" }, { status: 400 });
  if (!body.view && !body.url) return NextResponse.json({ error: "Either view or url required" }, { status: 400 });
  const count = await db.menuItem.count({ where: { menu: body.menu || "main" } });
  const item = await db.menuItem.create({
    data: {
      label: body.label,
      url: body.url || "",
      view: body.view || null,
      desc: body.desc || null,
      badge: body.badge || null,
      parentId: body.parentId || null,
      order: body.order ?? count,
      icon: body.icon || null,
      menu: body.menu || "main",
      visible: body.visible !== false,
    },
  });
  return NextResponse.json({ item });
}
