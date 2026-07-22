export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, whatsapp,
      propertyType, community, bedrooms, bathrooms, area,
      condition, ownership, timeline, message,
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const valuation = await db.valuationRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        propertyType: propertyType || null,
        community: community || null,
        bedrooms: bedrooms ? Number(bedrooms) : null,
        bathrooms: bathrooms ? Number(bathrooms) : null,
        area: area ? Number(area) : null,
        condition: condition || null,
        ownership: ownership || null,
        timeline: timeline || null,
        message: message || null,
      },
    });

    return NextResponse.json({ success: true, valuation });
  } catch (err) {
    console.error("[VALUATION_POST]", err);
    return NextResponse.json({ error: "Failed to create valuation" }, { status: 500 });
  }
}
