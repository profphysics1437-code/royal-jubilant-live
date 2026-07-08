import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.award.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ awards: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body: any = await req.json();
  if (!body.title) return NextResponse.json({ error: "Title required" }, { status: 400 });
  const item = await db.award.create({
    data: {
      title: body.title,
      issuer: body.issuer || "",
      year: body.year || new Date().getFullYear().toString(),
      icon: body.icon || "award",
      published: body.published !== false,
    },
  });
  return NextResponse.json({ award: item });
}
