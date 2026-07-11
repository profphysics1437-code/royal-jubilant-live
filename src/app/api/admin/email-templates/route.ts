export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;

  const templates = await db.emailTemplate.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const body = await req.json();
  if (!body.name || !body.slug || !body.subject || !body.body) {
    return NextResponse.json({ error: "name, slug, subject, body required" }, { status: 400 });
  }

  const slug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const existing = await db.emailTemplate.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
  }

  const tpl = await db.emailTemplate.create({
    data: {
      name: body.name,
      slug,
      subject: body.subject,
      body: body.body,
      category: body.category || "transactional",
      variables: body.variables ? JSON.stringify(body.variables) : null,
      active: body.active !== false,
    },
  });

  await logActivity(req, "create", "email_template", tpl.id, `Created template ${tpl.name}`);
  return NextResponse.json({ template: tpl });
}
