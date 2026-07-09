import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.amenity.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  return NextResponse.json({ amenities: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const item = await db.amenity.create({
    data: { name: body.name, category: body.category || "indoor", icon: body.icon || null, published: body.published !== false },
  });
  return NextResponse.json({ amenity: item });
}
