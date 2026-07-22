export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, locale } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Upsert — don't fail if already subscribed
    const subscriber = await db.newsletterSubscriber.upsert({
      where: { email },
      update: { name: name || undefined, locale: locale || "en" },
      create: { email, name: name || null, locale: locale || "en" },
    });

    return NextResponse.json({ success: true, subscriber });
  } catch (err) {
    console.error("[NEWSLETTER_POST]", err);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
