export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Cache for 6 hours to avoid hitting Google API quota
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000;

/**
 * GET /api/public/google-reviews
 * 
 * Fetches Google review count and rating from Google Places API.
 * Caches result in SiteSetting table for 6 hours.
 * 
 * Required env vars:
 * - GOOGLE_PLACES_API_KEY: Google Places API key
 * - GOOGLE_PLACE_ID: Place ID for Royal Jubilant
 * 
 * Fallback: if API key not set or request fails, returns cached value from
 * site settings (reviews.googleCount, reviews.googleRating)
 */

export async function GET() {
  try {
    // Check cache first
    const cachedCount = await db.siteSetting.findUnique({ where: { key: "reviews.googleCountCached" } });
    const cachedRating = await db.siteSetting.findUnique({ where: { key: "reviews.googleRatingCached" } });
    const cachedAt = await db.siteSetting.findUnique({ where: { key: "reviews.googleCachedAt" } });

    const now = Date.now();
    const cachedTime = cachedAt?.value ? parseInt(cachedAt.value) : 0;

    // Return cached if fresh
    if (cachedCount && cachedRating && cachedAt && (now - cachedTime) < CACHE_DURATION_MS) {
      return NextResponse.json({
        count: parseInt(cachedCount.value) || 0,
        rating: parseFloat(cachedRating.value) || 0,
        source: "cache",
        cachedAt: new Date(cachedTime).toISOString(),
      }, { headers: { "Cache-Control": "no-store" } });
    }

    // Fetch from Google Places API
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      // Fall back to manual values
      const manualCount = await db.siteSetting.findUnique({ where: { key: "reviews.googleCount" } });
      const manualRating = await db.siteSetting.findUnique({ where: { key: "reviews.googleRating" } });
      
      return NextResponse.json({
        count: parseInt(manualCount?.value || "74"),
        rating: parseFloat(manualRating?.value || "4.7"),
        source: "manual",
        note: "Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID env vars for auto-update",
      }, { headers: { "Cache-Control": "no-store" } });
    }

    // Call Google Places API (Place Details)
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=user_ratings_total,rating&key=${apiKey}`;
    
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000) 
    });
    
    if (!response.ok) {
      throw new Error(`Google API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      throw new Error(`Google API status: ${data.status} - ${data.error_message || ""}`);
    }

    const count = data.result.user_ratings_total || 0;
    const rating = data.result.rating || 0;

    // Update cache in database
    await db.siteSetting.upsert({
      where: { key: "reviews.googleCountCached" },
      update: { value: String(count) },
      create: { key: "reviews.googleCountCached", value: String(count), category: "reviews" },
    });

    await db.siteSetting.upsert({
      where: { key: "reviews.googleRatingCached" },
      update: { value: String(rating) },
      create: { key: "reviews.googleRatingCached", value: String(rating), category: "reviews" },
    });

    await db.siteSetting.upsert({
      where: { key: "reviews.googleCachedAt" },
      update: { value: String(now) },
      create: { key: "reviews.googleCachedAt", value: String(now), category: "reviews" },
    });

    // Also update the main display values so admin sees latest
    await db.siteSetting.upsert({
      where: { key: "reviews.googleCount" },
      update: { value: String(count) },
      create: { key: "reviews.googleCount", value: String(count), category: "reviews" },
    });

    await db.siteSetting.upsert({
      where: { key: "reviews.googleRating" },
      update: { value: String(rating) },
      create: { key: "reviews.googleRating", value: String(rating), category: "reviews" },
    });

    return NextResponse.json({
      count,
      rating,
      source: "google",
      fetchedAt: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" } });

  } catch (e: any) {
    // On error, return manual fallback
    try {
      const manualCount = await db.siteSetting.findUnique({ where: { key: "reviews.googleCount" } });
      const manualRating = await db.siteSetting.findUnique({ where: { key: "reviews.googleRating" } });
      
      return NextResponse.json({
        count: parseInt(manualCount?.value || "74"),
        rating: parseFloat(manualRating?.value || "4.7"),
        source: "fallback",
        error: e.message,
      }, { headers: { "Cache-Control": "no-store" } });
    } catch {
      return NextResponse.json({
        count: 74,
        rating: 4.7,
        source: "default",
        error: e.message,
      }, { headers: { "Cache-Control": "no-store" } });
    }
  }
}
