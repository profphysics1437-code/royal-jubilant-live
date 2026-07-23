export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";

// Helper: Get Supabase client at request time (not module load time)
function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_API_KEY;
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(req: NextRequest) {
  const u = await requireAdmin();
  if (u) return u;

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase not configured. Check SUPABASE_URL and SUPABASE_API_KEY environment variables." },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  const folder = (formData.get("folder") as string) || "general";

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  const uploadedFiles = [];

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const uniqueName = `${randomUUID()}.${ext}`;
    const storagePath = `${folder}/${uniqueName}`;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(storagePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('[Upload] Supabase error:', error);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);

      const url = publicUrlData.publicUrl;

      const mediaFile = await db.mediaFile.create({
        data: {
          filename: file.name,
          url,
          type: file.type.startsWith("video") ? "video" : "image",
          folder,
          size: file.size,
        },
      });

      uploadedFiles.push(mediaFile);
    } catch (e: any) {
      console.error('[Upload] Server error:', e);
    }
  }

  if (uploadedFiles.length === 0) {
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
  }

  return NextResponse.json({ files: uploadedFiles });
}
