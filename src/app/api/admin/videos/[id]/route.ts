export const dynamic = "force-dynamic";

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
  if (body.advisor !== undefined) data.advisor = body.advisor;
  if (body.role !== undefined) data.role = body.role;
  if (body.category !== undefined) data.category = body.category;
  if (body.duration !== undefined) data.duration = body.duration;
  if (body.thumbnail !== undefined) data.thumbnail = body.thumbnail;
  if (body.description !== undefined) data.description = body.description;
  if (body.videoUrl !== undefined) data.videoUrl = body.videoUrl || null;
  if (body.youtubeUrl !== undefined) data.youtubeUrl = body.youtubeUrl || null;
  if (body.order !== undefined) data.order = Number(body.order);
  if (body.published !== undefined) data.published = Boolean(body.published);
  const video = await db.video.update({ where: { id }, data });
  await logActivity(req, "update", "video", video.id, `Updated video: ${video.title}`);
  return NextResponse.json({ video });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const video = await db.video.delete({ where: { id }, select: { id: true, title: true } });
  await logActivity(req, "delete", "video", video.id, `Deleted video: ${video.title}`);
  return NextResponse.json({ success: true });
}
