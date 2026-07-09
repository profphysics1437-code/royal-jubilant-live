import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

export async function GET() {
  const session = await requireAgent();
  if (!("user" in session)) return session;
  const userId = session.user.id;

  const properties = await db.property.findMany({
    where: { agentId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ properties });
}

// Helper: serialize any array field to JSON string
function arr(v: any): string {
  if (Array.isArray(v)) return JSON.stringify(v);
  if (typeof v === "string") return v;
  return JSON.stringify([]);
}

// Helper: parse number or null
function num(v: any): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req: NextRequest) {
  const session = await requireAgent();
  if (!("user" in session)) return session;
  const userId = session.user.id;

  const body = await req.json();

  if (!body.title || !body.status || !body.type || !body.price || !body.community) {
    return NextResponse.json({ error: "Missing required fields: title, status, type, price, community" }, { status: 400 });
  }

  // Auto-calc price per sqft
  const price = Number(body.price);
  const area = Number(body.area) || 0;
  const pricePerSqft = area > 0 ? Math.round(price / area) : null;

  // Derive legacy `furnished` boolean from new `furnishingStatus`
  const furnished = body.furnishingStatus === "Furnished" || body.furnishingStatus === "Partially Furnished";

  // Property type lists
  const residentialTypes = ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Duplex", "Compound"];
  const category = residentialTypes.includes(body.type) ? "Residential" : "Commercial";

  // Compose legacy amenities (combined) for backwards compat with public site
  const combinedAmenities = [
    ...(body.indoorFeatures || []),
    ...(body.outdoorFeatures || []),
    ...(body.buildingAmenities || []),
  ];

  // Generate a unique reference if not provided or if there's a collision
  let reference = body.reference || `RJ-${Date.now().toString().slice(-6)}`;
  let slug = body.slug || reference.toLowerCase();

  // Check for duplicate reference and auto-generate a new one if needed
  let attempts = 0;
  while (attempts < 5) {
    const existing = await db.property.findUnique({ where: { reference } });
    if (!existing) break;
    reference = `RJ-${Date.now().toString().slice(-6)}-${attempts + 1}`;
    slug = reference.toLowerCase();
    attempts++;
  }

  try {
    const property = await db.property.create({
      data: {
        // Section 1
        reference,
        title: body.title,
        slug,
        status: body.status,
        category,
        type: body.type,
        // Section 2
        country: body.country || "UAE",
        emirate: body.emirate || "Dubai",
        community: body.community,
        subCommunity: body.subCommunity || null,
        locationLat: num(body.locationLat),
        locationLng: num(body.locationLng),
        locationAddress: body.locationAddress || null,
        // Section 3
        bedrooms: Number(body.bedrooms) || 0,
        bathrooms: Number(body.bathrooms) || 0,
        area: area,
        areaUnit: body.areaUnit || "sqft",
        plotSize: num(body.plotSize),
        plotSizeUnit: body.plotSizeUnit || "sqft",
        completionStatus: body.completionStatus || null,
        completionDate: body.completionDate || null,
        furnishingStatus: body.furnishingStatus || null,
        floorNumber: num(body.floorNumber),
        totalFloors: num(body.totalFloors),
        parking: Number(body.parking) || 0,
        // Section 4
        price: price,
        pricePerSqft: pricePerSqft,
        rentFrequency: body.rentFrequency || null,
        noOfCheques: num(body.noOfCheques),
        serviceCharge: num(body.serviceCharge),
        priceNegotiable: Boolean(body.priceNegotiable),
        // Section 5
        indoorFeatures: arr(body.indoorFeatures),
        outdoorFeatures: arr(body.outdoorFeatures),
        buildingAmenities: arr(body.buildingAmenities),
        nearbyLandmarks: arr(body.nearbyLandmarks),
        viewFeatures: arr(body.viewFeatures),
        // Section 6
        images: arr(body.images && body.images.length ? body.images : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80"]),
        floorPlanUrl: body.floorPlanUrl || null,
        videoUrl: body.videoUrl || null,
        virtualTourUrl: body.virtualTourUrl || null,
        // Section 7
        description: body.description || "",
        reraNumber: body.reraNumber || null,
        exclusiveListing: Boolean(body.exclusiveListing),
        // Legacy compat
        developer: body.developer || null,
        furnished: furnished,
        amenities: arr(combinedAmenities),
        features: arr(body.indoorFeatures),
        paymentPlan: body.paymentPlan ? arr(body.paymentPlan) : null,
        handoverYear: body.completionDate ? Number(String(body.completionDate).split("-")[0]) : null,
        // Flags — agents cannot self-feature/publish
        featured: false,
        isLatest: Boolean(body.isLatest ?? true),
        isLuxury: Boolean(body.isLuxury),
        published: false, // pending admin approval
        agentId: userId,
      },
    });

    return NextResponse.json({ property });
  } catch (err: any) {
    console.error("[AGENT_LISTINGS_POST]", err);
    if (err?.code === "P2002") {
      return NextResponse.json({
        error: `Reference "${reference}" already exists. Please try again — a new reference will be auto-generated.`,
      }, { status: 409 });
    }
    return NextResponse.json({
      error: err?.message || "Failed to create property. Please check all required fields and try again.",
    }, { status: 500 });
  }
}
