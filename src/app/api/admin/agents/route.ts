export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  const agents = await db.agent.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { name, title, photo, phone, whatsapp, email, languages, specializations, communities, biography, awards, rating, reviewsCount, activeListings, soldProperties, experienceYears, linkedin, instagram, twitter, published, order } = body;

  if (!name || !email) return NextResponse.json({ error: "Name and email required" }, { status: 400 });

  const agent = await db.agent.create({
    data: {
      name, title, photo: photo || "", phone: phone || "", whatsapp: whatsapp || "", email,
      languages: JSON.stringify(languages || []),
      specializations: JSON.stringify(specializations || []),
      communities: JSON.stringify(communities || []),
      biography: biography || "",
      awards: JSON.stringify(awards || []),
      rating: rating ? Number(rating) : 5.0,
      reviewsCount: reviewsCount ? Number(reviewsCount) : 0,
      activeListings: activeListings ? Number(activeListings) : 0,
      soldProperties: soldProperties ? Number(soldProperties) : 0,
      experienceYears: experienceYears ? Number(experienceYears) : 0,
      linkedin: linkedin || null, instagram: instagram || null, twitter: twitter || null,
      published: published !== false,
      order: order ? Number(order) : 0,
    },
  });

  return NextResponse.json({ agent });
}
