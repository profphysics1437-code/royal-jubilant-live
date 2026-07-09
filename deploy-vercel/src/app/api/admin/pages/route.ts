import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

export async function GET(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const url = new URL(req.url);
  const status = url.searchParams.get("status");

  const pages = await db.landingPage.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ pages });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const body = await req.json();
  if (!body.title || !body.slug || !body.headline) {
    return NextResponse.json({ error: "title, slug, headline required" }, { status: 400 });
  }

  const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const existing = await db.landingPage.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
  }

  const page = await db.landingPage.create({
    data: {
      title: body.title,
      slug,
      headline: body.headline,
      subheadline: body.subheadline || null,
      body: body.body || "",
      heroImage: body.heroImage || null,
      ctaText: body.ctaText || null,
      ctaLink: body.ctaLink || null,
      seoTitle: body.seoTitle || null,
      seoDescription: body.seoDescription || null,
      status: body.status || "draft",
      publishedAt: body.status === "published" ? new Date() : null,
    },
  });

  await logActivity(req, "create", "landing_page", page.id, `Created landing page "${page.title}"`);
  return NextResponse.json({ page });
}
