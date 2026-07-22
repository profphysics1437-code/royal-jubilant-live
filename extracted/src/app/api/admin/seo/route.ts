import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const items = await db.seoMeta.findMany({ orderBy: { pageSlug: "asc" } });
  return NextResponse.json({ seo: items });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.pageSlug) return NextResponse.json({ error: "pageSlug required" }, { status: 400 });
  const item = await db.seoMeta.create({ data: body });
  return NextResponse.json({ seo: item });
}
