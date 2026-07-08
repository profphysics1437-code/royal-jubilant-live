import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { logActivity } from "@/lib/activity";

export async function GET() {
  const u = await requireAdmin();
  if (u) return u;
  const videos = await db.video.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ videos });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const body = await req.json();
  if (!body.title || !body.advisor) {
    return NextResponse.json({ error: "title and advisor required" }, { status: 400 });
  }
  const count = await db.video.count();
  const video = await db.video.create({
    data: {
      title: body.title,
      advisor: body.advisor,
      role: body.role || "Property Consultant",
      category: body.category || "Market Insights",
      duration: body.duration || "0:00",
      thumbnail: body.thumbnail || "",
      description: body.description || "",
      videoUrl: body.videoUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      order: body.order ?? count,
      published: body.published !== false,
    },
  });
  await logActivity(req, "create", "video", video.id, `Created video: ${video.title}`);
  return NextResponse.json({ video });
}
