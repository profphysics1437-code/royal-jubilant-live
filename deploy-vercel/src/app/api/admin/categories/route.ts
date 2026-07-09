import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.propertyCategory.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }] });
  return NextResponse.json({ categories: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const item = await db.propertyCategory.create({
    data: { name: body.name, type: body.type || "residential", published: body.published !== false },
  });
  return NextResponse.json({ category: item });
}
