export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, whatsapp, source, intent, message, budget, propertyRef, community, agentId } = body;

    if (!name || !email || !source) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        source,
        intent: intent || null,
        message: message || null,
        budget: budget ? Number(budget) : null,
        propertyRef: propertyRef || null,
        community: community || null,
        assignedTo: agentId || null,
        status: "new",
      },
    });

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    console.error("[LEADS_POST]", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ leads });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
