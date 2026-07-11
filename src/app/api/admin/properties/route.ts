export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function GET(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit") || 200);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  const properties = await db.property.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { agent: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json({ properties });
}

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const {
    reference, title, slug, status, type, price, pricePerSqft,
    rentFrequency, bedrooms, bathrooms, area, parking,
    community, subCommunity, developer, furnished,
    completionStatus, handoverYear, amenities, images,
    description, features, paymentPlan, locationLat, locationLng,
    locationAddress, featured, isLatest, isLuxury, published, agentId,
  } = body;

  if (!reference || !title || !status || !type || !price || !community) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const property = await db.property.create({
    data: {
      reference, title,
      slug: slug || reference.toLowerCase(),
      status, type, price: Number(price),
      pricePerSqft: pricePerSqft ? Number(pricePerSqft) : null,
      rentFrequency: rentFrequency || null,
      bedrooms: Number(bedrooms) || 0,
      bathrooms: Number(bathrooms) || 0,
      area: Number(area) || 0,
      parking: Number(parking) || 0,
      community, subCommunity: subCommunity || null,
      developer: developer || null,
      furnished: Boolean(furnished),
      completionStatus: completionStatus || null,
      handoverYear: handoverYear ? Number(handoverYear) : null,
      amenities: JSON.stringify(amenities || []),
      images: JSON.stringify(images || []),
      description: description || "",
      features: JSON.stringify(features || []),
      paymentPlan: paymentPlan ? JSON.stringify(paymentPlan) : null,
      locationLat: locationLat ? Number(locationLat) : null,
      locationLng: locationLng ? Number(locationLng) : null,
      locationAddress: locationAddress || null,
      featured: Boolean(featured),
      isLatest: Boolean(isLatest),
      isLuxury: Boolean(isLuxury),
      published: published !== false,
      agentId: agentId || null,
    },
  });

  return NextResponse.json({ property });
}
