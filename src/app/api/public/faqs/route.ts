import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const faqs = await db.faq.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ faqs }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
