import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const position = formData.get("position") as string;
    const experience = formData.get("experience") as string;
    const message = formData.get("message") as string;
    const cvFile = formData.get("cv") as File;

    if (!name || !email || !position) {
      return NextResponse.json({ error: "Name, email, and position are required" }, { status: 400 });
    }

    let cvUrl: string | null = null;
    let cvFileName: string | null = null;

    if (cvFile && cvFile.size > 0) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      const maxCVSize = 10 * 1024 * 1024;

      if (!allowedTypes.includes(cvFile.type)) {
        return NextResponse.json({ error: "CV must be a PDF or Word document" }, { status: 400 });
      }
      if (cvFile.size > maxCVSize) {
        return NextResponse.json({ error: "CV file too large. Max 10MB." }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const ext = cvFile.name.split(".").pop()?.toLowerCase() || "pdf";
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const filepath = path.join(uploadDir, filename);
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      await writeFile(filepath, buffer);

      cvUrl = `/uploads/cv/${filename}`;
      cvFileName = cvFile.name;
    }

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: phone || null,
        source: "career",
        intent: `Job Application: ${position}`,
        message: `Position: ${position}\nExperience: ${experience || "Not specified"}\nCV: ${cvFileName || "Not uploaded"} (${cvUrl || "N/A"})\n\nMessage: ${message || "None"}`,
        status: "new",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      leadId: lead.id,
    });
  } catch (e: any) {
    console.error("[CAREER_APPLY]", e);
    return NextResponse.json({ error: e.message || "Failed to submit application" }, { status: 500 });
  }
}
