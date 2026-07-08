import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await db.agent.findUnique({ where: { id } });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    agent: {
      id: a.id,
      name: a.name,
      title: a.title,
      photo: a.photo,
      phone: a.phone,
      whatsapp: a.whatsapp,
      email: a.email,
      languages: JSON.parse(a.languages || "[]"),
      specializations: JSON.parse(a.specializations || "[]"),
      communities: JSON.parse(a.communities || "[]"),
      biography: a.biography,
      awards: JSON.parse(a.awards || "[]"),
      rating: a.rating,
      reviewsCount: a.reviewsCount,
      activeListings: a.activeListings,
      soldProperties: a.soldProperties,
      experienceYears: a.experienceYears,
      socials: {
        linkedin: a.linkedin || undefined,
        instagram: a.instagram || undefined,
        twitter: a.twitter || undefined,
      },
    },
  });
}
