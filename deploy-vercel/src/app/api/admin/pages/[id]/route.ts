import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;

  const { id } = await params;
  const body = await req.json();

  const data: any = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.headline !== undefined) data.headline = body.headline;
  if (body.subheadline !== undefined) data.subheadline = body.subheadline || null;
  if (body.body !== undefined) data.body = body.body;
  if (body.heroImage !== undefined) data.heroImage = body.heroImage || null;
  if (body.ctaText !== undefined) data.ctaText = body.ctaText || null;
  if (body.ctaLink !== undefined) data.ctaLink = body.ctaLink || null;
  if (body.seoTitle !== undefined) data.seoTitle = body.seoTitle || null;
  if (body.seoDescription !== undefined) data.seoDescription = body.seoDescription || null;
  if (body.status !== undefined) {
    data.status = body.status;
    if (body.status === "published") data.publishedAt = new Date();
  }

  const page = await db.landingPage.update({ where: { id }, data });
  await logActivity(req, "update", "landing_page", page.id, `Updated landing page "${page.title}"`);
  return NextResponse.json({ page });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;

  const { id } = await params;
  const page = await db.landingPage.delete({ where: { id }, select: { id: true, title: true } });
  await logActivity(req, "delete", "landing_page", page.id, `Deleted landing page "${page.title}"`);
  return NextResponse.json({ success: true });
}
