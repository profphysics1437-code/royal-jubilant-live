export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const slides = await db.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ slides });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.heading1 || !body.heading2 || !body.subtitle) {
    return NextResponse.json({ error: "heading1, heading2, subtitle required" }, { status: 400 });
  }
  const count = await db.heroSlide.count();
  const slide = await db.heroSlide.create({
    data: {
      heading1: body.heading1,
      heading2: body.heading2,
      heading3: body.heading3 || null,
      subtitle: body.subtitle,
      order: body.order ?? count,
      published: body.published !== false,
    },
  });
  return NextResponse.json({ slide });
}
