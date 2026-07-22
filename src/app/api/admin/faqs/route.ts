export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const faqs = await db.faq.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ faqs });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.question || !body.answer) {
    return NextResponse.json({ error: "question and answer required" }, { status: 400 });
  }
  const faq = await db.faq.create({
    data: {
      question: body.question,
      answer: body.answer,
      category: body.category || "general",
      order: body.order ? Number(body.order) : 0,
      published: body.published !== false,
    },
  });
  await logActivity(req, "create", "faq", faq.id, `Created FAQ: ${faq.question}`);
  return NextResponse.json({ faq });
}
