import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const agents = await db.agent.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { activeListings: "desc" }, { name: "asc" }],
  });

  const mapped = agents.map((a) => ({
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
  }));

  return NextResponse.json({ agents: mapped }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
