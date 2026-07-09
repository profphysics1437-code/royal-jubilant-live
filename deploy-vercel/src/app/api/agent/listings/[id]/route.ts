import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAgent } from "@/lib/agent-guard";

function arr(v: any): string {
  if (Array.isArray(v)) return JSON.stringify(v);
  if (typeof v === "string") return v;
  return JSON.stringify([]);
}
function num(v: any): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const { id } = await params;
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing || existing.agentId !== session.user.id) {
    return NextResponse.json({ error: "Not found or not owned" }, { status: 403 });
  }

  const body: any = await req.json();

  // Auto-calc price per sqft
  const price = body.price !== undefined ? Number(body.price) : existing.price;
  const area = body.area !== undefined ? Number(body.area) : existing.area;
  const pricePerSqft = area > 0 ? Math.round(price / area) : null;

  // Derive furnished from furnishingStatus
  const furnishingStatus = body.furnishingStatus !== undefined ? body.furnishingStatus : existing.furnishingStatus;
  const furnished = furnishingStatus === "Furnished" || furnishingStatus === "Partially Furnished";

  // Compose legacy amenities
  const combinedAmenities = [
    ...(Array.isArray(body.indoorFeatures) ? body.indoorFeatures : JSON.parse(existing.indoorFeatures || "[]")),
    ...(Array.isArray(body.outdoorFeatures) ? body.outdoorFeatures : JSON.parse(existing.outdoorFeatures || "[]")),
    ...(Array.isArray(body.buildingAmenities) ? body.buildingAmenities : JSON.parse(existing.buildingAmenities || "[]")),
  ];

  const data: any = {
    ...(body.reference ? { reference: body.reference } : {}),
    ...(body.title ? { title: body.title } : {}),
    ...(body.status ? { status: body.status } : {}),
    ...(body.type ? { type: body.type } : {}),
    ...(body.country !== undefined ? { country: body.country } : {}),
    ...(body.emirate !== undefined ? { emirate: body.emirate } : {}),
    ...(body.community !== undefined ? { community: body.community } : {}),
    ...(body.subCommunity !== undefined ? { subCommunity: body.subCommunity || null } : {}),
    ...(body.locationLat !== undefined ? { locationLat: num(body.locationLat) } : {}),
    ...(body.locationLng !== undefined ? { locationLng: num(body.locationLng) } : {}),
    ...(body.locationAddress !== undefined ? { locationAddress: body.locationAddress || null } : {}),
    ...(body.bedrooms !== undefined ? { bedrooms: Number(body.bedrooms) || 0 } : {}),
    ...(body.bathrooms !== undefined ? { bathrooms: Number(body.bathrooms) || 0 } : {}),
    ...(body.area !== undefined ? { area: Number(body.area) || 0 } : {}),
    ...(body.areaUnit !== undefined ? { areaUnit: body.areaUnit } : {}),
    ...(body.plotSize !== undefined ? { plotSize: num(body.plotSize) } : {}),
    ...(body.plotSizeUnit !== undefined ? { plotSizeUnit: body.plotSizeUnit } : {}),
    ...(body.completionStatus !== undefined ? { completionStatus: body.completionStatus || null } : {}),
    ...(body.completionDate !== undefined ? { completionDate: body.completionDate || null } : {}),
    ...(body.furnishingStatus !== undefined ? { furnishingStatus: body.furnishingStatus || null } : {}),
    ...(body.floorNumber !== undefined ? { floorNumber: num(body.floorNumber) } : {}),
    ...(body.totalFloors !== undefined ? { totalFloors: num(body.totalFloors) } : {}),
    ...(body.parking !== undefined ? { parking: Number(body.parking) || 0 } : {}),
    ...(body.price !== undefined ? { price: Number(body.price) } : {}),
    pricePerSqft,
    ...(body.rentFrequency !== undefined ? { rentFrequency: body.rentFrequency || null } : {}),
    ...(body.noOfCheques !== undefined ? { noOfCheques: num(body.noOfCheques) } : {}),
    ...(body.serviceCharge !== undefined ? { serviceCharge: num(body.serviceCharge) } : {}),
    ...(body.priceNegotiable !== undefined ? { priceNegotiable: Boolean(body.priceNegotiable) } : {}),
    ...(body.indoorFeatures !== undefined ? { indoorFeatures: arr(body.indoorFeatures) } : {}),
    ...(body.outdoorFeatures !== undefined ? { outdoorFeatures: arr(body.outdoorFeatures) } : {}),
    ...(body.buildingAmenities !== undefined ? { buildingAmenities: arr(body.buildingAmenities) } : {}),
    ...(body.nearbyLandmarks !== undefined ? { nearbyLandmarks: arr(body.nearbyLandmarks) } : {}),
    ...(body.viewFeatures !== undefined ? { viewFeatures: arr(body.viewFeatures) } : {}),
    ...(body.images !== undefined ? { images: arr(body.images) } : {}),
    ...(body.floorPlanUrl !== undefined ? { floorPlanUrl: body.floorPlanUrl || null } : {}),
    ...(body.videoUrl !== undefined ? { videoUrl: body.videoUrl || null } : {}),
    ...(body.virtualTourUrl !== undefined ? { virtualTourUrl: body.virtualTourUrl || null } : {}),
    ...(body.description !== undefined ? { description: body.description } : {}),
    ...(body.reraNumber !== undefined ? { reraNumber: body.reraNumber || null } : {}),
    ...(body.exclusiveListing !== undefined ? { exclusiveListing: Boolean(body.exclusiveListing) } : {}),
    ...(body.developer !== undefined ? { developer: body.developer || null } : {}),
    ...(body.furnishingStatus !== undefined ? { furnished } : {}),
    amenities: arr(combinedAmenities),
    ...(body.indoorFeatures !== undefined ? { features: arr(body.indoorFeatures) } : {}),
    ...(body.paymentPlan !== undefined ? { paymentPlan: arr(body.paymentPlan) } : {}),
    ...(body.completionDate !== undefined && body.completionDate ? { handoverYear: Number(String(body.completionDate).split("-")[0]) } : {}),
    ...(body.isLuxury !== undefined ? { isLuxury: Boolean(body.isLuxury) } : {}),
    ...(body.isLatest !== undefined ? { isLatest: Boolean(body.isLatest) } : {}),
  };

  // Agents cannot change published/featured/agentId directly
  delete data.published;
  delete data.featured;
  delete data.agentId;

  // If editing a published property, re-mark as pending re-approval
  if (existing.published) data.published = false;

  const property = await db.property.update({ where: { id }, data });
  return NextResponse.json({ property });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAgent();
  if (!("user" in session)) return session;

  const { id } = await params;
  const existing = await db.property.findUnique({ where: { id } });
  if (!existing || existing.agentId !== session.user.id) {
    return NextResponse.json({ error: "Not found or not owned" }, { status: 403 });
  }

  await db.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
