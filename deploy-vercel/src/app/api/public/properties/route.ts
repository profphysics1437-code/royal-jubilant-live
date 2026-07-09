import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // sale | rent | commercial | off-plan
  const category = url.searchParams.get("category");
  const type = url.searchParams.get("type");
  const community = url.searchParams.get("community");
  const bedrooms = url.searchParams.get("bedrooms");
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");
  const featured = url.searchParams.get("featured") === "1";
  const isLuxury = url.searchParams.get("luxury") === "1";
  const isLatest = url.searchParams.get("latest") === "1";
  const limit = parseInt(url.searchParams.get("limit") || "0") || undefined;
  const sort = url.searchParams.get("sort") || "newest";

  const where: any = { published: true };
  if (status === "sale") where.status = "sale";
  if (status === "rent") where.status = "rent";
  if (status === "commercial") where.category = "Commercial";
  if (status === "off-plan") where.completionStatus = "Off-Plan";
  if (category) where.category = category;
  if (type) where.type = type;
  if (community) where.community = { contains: community };
  if (bedrooms) where.bedrooms = parseInt(bedrooms);
  if (featured) where.featured = true;
  if (isLuxury) where.isLuxury = true;
  if (isLatest) where.isLatest = true;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  const orderBy: any =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "popular" ? { views: "desc" } :
    { createdAt: "desc" };

  let dbProperties = await db.property.findMany({
    where,
    orderBy,
    ...(limit ? { take: limit } : {}),
  });

  // If this is a "featured" query but we got fewer than 8 results,
  // top up with the newest non-featured published properties so the
  // homepage Featured section always looks full (8 cards).
  if (featured && dbProperties.length < 8) {
    const existingIds = dbProperties.map((p) => p.id);
    const extras = await db.property.findMany({
      where: { published: true, id: { notIn: existingIds } },
      orderBy: { createdAt: "desc" },
      take: 8 - dbProperties.length,
    });
    dbProperties = [...dbProperties, ...extras];
  }

  // Collect all agentIds (User IDs) to look up their Agent profiles
  const agentIds = [...new Set(dbProperties.map((p) => p.agentId).filter(Boolean))] as string[];
  // Look up User records to get emails, then match to Agent records by email
  const users = agentIds.length > 0
    ? await db.user.findMany({ where: { id: { in: agentIds } }, select: { id: true, email: true, name: true } })
    : [];
  const userEmails = users.map((u) => u.email).filter(Boolean);
  const agentRecords = userEmails.length > 0
    ? await db.agent.findMany({ where: { email: { in: userEmails } } })
    : [];
  // Build a map: userId → agent display info
  const agentMap = new Map<string, any>();
  for (const u of users) {
    const agentRecord = agentRecords.find((a) => a.email === u.email);
    if (agentRecord) {
      agentMap.set(u.id, {
        id: agentRecord.id,
        name: agentRecord.name,
        title: agentRecord.title,
        photo: agentRecord.photo,
        phone: agentRecord.phone,
        whatsapp: agentRecord.whatsapp,
        email: agentRecord.email,
      });
    }
  }

  // Map DB shape → public-site shape (matches data.ts interface)
  const properties = dbProperties.map((p) => ({
    id: p.id,
    reference: p.reference,
    title: p.title,
    status: p.status === "sale" ? "sale" : p.status === "rent" ? "rent" : p.status,
    category: p.category ?? undefined,
    type: p.type,
    price: p.price,
    pricePerSqft: p.pricePerSqft ?? undefined,
    rentFrequency: p.rentFrequency ?? undefined,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: p.area,
    areaUnit: p.areaUnit ?? "sqft",
    plotSize: p.plotSize ?? undefined,
    parking: p.parking,
    community: p.community,
    subCommunity: p.subCommunity ?? undefined,
    developer: p.developer ?? undefined,
    country: p.country ?? undefined,
    emirate: p.emirate ?? undefined,
    furnishingStatus: p.furnishingStatus ?? undefined,
    completionStatus: p.completionStatus ?? undefined,
    handoverYear: p.completionDate ?? undefined,
    floorNumber: p.floorNumber ?? undefined,
    totalFloors: p.totalFloors ?? undefined,
    reraNumber: p.reraNumber ?? undefined,
    amenities: p.amenities ? JSON.parse(p.amenities) : [],
    indoorFeatures: p.indoorFeatures ? JSON.parse(p.indoorFeatures) : [],
    outdoorFeatures: p.outdoorFeatures ? JSON.parse(p.outdoorFeatures) : [],
    buildingAmenities: p.buildingAmenities ? JSON.parse(p.buildingAmenities) : [],
    nearbyLandmarks: p.nearbyLandmarks ? JSON.parse(p.nearbyLandmarks) : [],
    viewFeatures: p.viewFeatures ? JSON.parse(p.viewFeatures) : [],
    features: p.features ? JSON.parse(p.features) : [],
    images: p.images ? JSON.parse(p.images) : [],
    floorPlanUrl: p.floorPlanUrl ?? undefined,
    videoUrl: p.videoUrl ?? undefined,
    virtualTourUrl: p.virtualTourUrl ?? undefined,
    description: p.description,
    paymentPlan: p.paymentPlan ? JSON.parse(p.paymentPlan) : undefined,
    location: {
      lat: p.locationLat ?? 25.2048,
      lng: p.locationLng ?? 55.2708,
      address: p.locationAddress ?? p.community,
    },
    agentId: p.agentId ?? undefined,
    agent: p.agentId ? agentMap.get(p.agentId) ?? undefined : undefined,
    developer_id: p.developer ?? undefined,
    featured: p.featured,
    isLatest: p.isLatest,
    isLuxury: p.isLuxury,
    exclusiveListing: p.exclusiveListing,
    views: p.views,
    createdAt: p.createdAt.toISOString(),
  }));

  return NextResponse.json(
    { properties, total: properties.length },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
