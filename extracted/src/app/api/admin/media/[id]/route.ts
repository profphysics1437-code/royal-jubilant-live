import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { unlink } from "fs/promises";
import path from "path";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const body = await req.json();
  const item = await db.mediaFile.update({ where: { id }, data: body });
  return NextResponse.json({ file: item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const u = await requireAdmin();
  if (u) return u;
  const { id } = await params;
  const file = await db.mediaFile.findUnique({ where: { id } });
  if (file) {
    // Delete physical file
    try {
      const filePath = path.join(process.cwd(), "public", file.url);
      await unlink(filePath);
    } catch { /* file may not exist */ }
  }
  await db.mediaFile.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
