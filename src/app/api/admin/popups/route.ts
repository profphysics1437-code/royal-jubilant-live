import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const popups = await db.popup.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ popups });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.title || !body.content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });
  const popup = await db.popup.create({
    data: {
      title: body.title,
      content: body.content,
      type: body.type || "info",
      trigger: body.trigger || "immediate",
      delaySeconds: Number(body.delaySeconds) || 0,
      position: body.position || "center",
      imageUrl: body.imageUrl || null,
      buttonText: body.buttonText || null,
      buttonLink: body.buttonLink || null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      active: body.active !== false,
    },
  });
  return NextResponse.json({ popup });
}
