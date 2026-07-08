import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const files = await db.mediaFile.findMany({
    where: folder ? { folder } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folder = (formData.get("folder") as string) || "general";
  const altTag = (formData.get("altTag") as string) || "";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Determine file type
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  let type = "image";
  if (["mp4", "webm", "mov", "avi"].includes(ext)) type = "video";
  else if (["pdf"].includes(ext)) type = "pdf";
  else if (["svg"].includes(ext)) type = "svg";
  else if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) type = "image";

  // Generate unique filename
  const uniqueName = `${randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const url = `/uploads/${folder}/${uniqueName}`;

  const mediaFile = await db.mediaFile.create({
    data: {
      filename: file.name,
      url,
      type,
      folder,
      size: file.size,
      altTag: altTag || null,
    },
  });

  return NextResponse.json({ file: mediaFile });
}
