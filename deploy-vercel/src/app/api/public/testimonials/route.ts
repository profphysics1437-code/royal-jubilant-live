import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const testimonials = await db.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const mapped = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    location: t.location,
    avatar: t.avatar,
    rating: t.rating,
    quote: t.quote,
    service: t.service,
  }));

  return NextResponse.json({ testimonials: mapped }, { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } });
}
