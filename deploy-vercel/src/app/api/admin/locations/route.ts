import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.location.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ locations: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  const item = await db.location.create({
    data: { name: body.name, emirate: body.emirate || "Dubai", country: body.country || "UAE", published: body.published !== false },
  });
  return NextResponse.json({ location: item });
}
