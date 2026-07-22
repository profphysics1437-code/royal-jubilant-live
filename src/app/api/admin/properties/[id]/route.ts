export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await req.json();

  // Arrays come in as arrays; serialize before persisting
  const data: any = { ...body };
  if (Array.isArray(data.amenities)) data.amenities = JSON.stringify(data.amenities);
  if (Array.isArray(data.images)) data.images = JSON.stringify(data.images);
  if (Array.isArray(data.features)) data.features = JSON.stringify(data.features);
  if (Array.isArray(data.paymentPlan)) data.paymentPlan = JSON.stringify(data.paymentPlan);
  if (data.price !== undefined) data.price = Number(data.price);
  if (data.pricePerSqft !== undefined) data.pricePerSqft = data.pricePerSqft ? Number(data.pricePerSqft) : null;
  if (data.bedrooms !== undefined) data.bedrooms = Number(data.bedrooms) || 0;
  if (data.bathrooms !== undefined) data.bathrooms = Number(data.bathrooms) || 0;
  if (data.area !== undefined) data.area = Number(data.area) || 0;
  if (data.parking !== undefined) data.parking = Number(data.parking) || 0;
  if (data.handoverYear !== undefined) data.handoverYear = data.handoverYear ? Number(data.handoverYear) : null;
  if (data.locationLat !== undefined) data.locationLat = data.locationLat ? Number(data.locationLat) : null;
  if (data.locationLng !== undefined) data.locationLng = data.locationLng ? Number(data.locationLng) : null;
  if (data.furnished !== undefined) data.furnished = Boolean(data.furnished);
  if (data.featured !== undefined) data.featured = Boolean(data.featured);
  if (data.isLatest !== undefined) data.isLatest = Boolean(data.isLatest);
  if (data.isLuxury !== undefined) data.isLuxury = Boolean(data.isLuxury);
  if (data.published !== undefined) data.published = Boolean(data.published);

  const property = await db.property.update({ where: { id }, data });
  return NextResponse.json({ property });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await db.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
