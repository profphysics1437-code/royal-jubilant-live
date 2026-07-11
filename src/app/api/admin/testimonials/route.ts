export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ testimonials: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body: any = await req.json();
  if (!body.name || !body.quote) return NextResponse.json({ error: "Name and quote required" }, { status: 400 });
  const item = await db.testimonial.create({
    data: {
      name: body.name,
      role: body.role || "",
      location: body.location || "",
      avatar: body.avatar || "",
      rating: Number(body.rating) || 5,
      quote: body.quote,
      service: body.service || "",
      published: body.published !== false,
    },
  });
  return NextResponse.json({ testimonial: item });
}
