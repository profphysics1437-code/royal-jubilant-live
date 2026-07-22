import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.reason || !body.propertyRef) {
    return NextResponse.json({ error: "reason and propertyRef required" }, { status: 400 });
  }

  // Store the report as a lead with source "report"
  const report = await db.lead.create({
    data: {
      name: body.name || "Anonymous",
      email: body.email || "anonymous@report.com",
      phone: body.phone || null,
      source: "report",
      intent: `Property Report: ${body.reason}`,
      message: body.details || null,
      propertyRef: body.propertyRef,
      community: body.community || null,
      status: "new",
    },
  });

  return NextResponse.json(
    { success: true, report },
    { headers: { "Cache-Control": "no-store" } },
  );
}
