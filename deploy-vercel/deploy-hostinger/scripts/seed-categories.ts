/**
 * Seed PropertyCategory table with residential + commercial types
 * matching the dropdown options already used in the listing form
 * (see src/lib/property-options.ts).
 *
 * Run with:
 *   npx tsx scripts/seed-categories.ts
 *
 * Safe to re-run — checks existing rows by name+type before creating.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Cat = { name: string; type: "residential" | "commercial" };

const CATEGORIES: Cat[] = [
  // ───────── Residential ─────────
  { name: "Apartment", type: "residential" },
  { name: "Studio", type: "residential" },
  { name: "Penthouse", type: "residential" },
  { name: "Duplex", type: "residential" },
  { name: "Villa", type: "residential" },
  { name: "Townhouse", type: "residential" },
  { name: "Mansion", type: "residential" },
  { name: "Compound", type: "residential" },
  // Rent sub-categories (from earlier work)
  { name: "Private Room", type: "residential" },
  { name: "Bed Space", type: "residential" },
  { name: "Holiday Home", type: "residential" },
  { name: "Hotel Apartment", type: "residential" },
  { name: "Serviced Apartment", type: "residential" },
  { name: "Building", type: "residential" },

  // ───────── Commercial ─────────
  { name: "Office", type: "commercial" },
  { name: "Retail", type: "commercial" },
  { name: "Shop", type: "commercial" },
  { name: "Showroom", type: "commercial" },
  { name: "Warehouse", type: "commercial" },
  { name: "Factory", type: "commercial" },
  { name: "Industrial", type: "commercial" },
  { name: "Labor Camp", type: "commercial" },
  { name: "Staff Accommodation", type: "commercial" },
  { name: "Mixed Use", type: "commercial" },
  { name: "Bulk Units", type: "commercial" },
  { name: "Land", type: "commercial" },
  { name: "Plot", type: "commercial" },
  { name: "Cold Storage", type: "commercial" },
  { name: "Labour Camp", type: "commercial" }, // alt spelling
];

async function main() {
  console.log(`\n🌱 Seeding ${CATEGORIES.length} property categories...`);
  let added = 0;
  let skipped = 0;

  for (const c of CATEGORIES) {
    const existing = await db.propertyCategory.findFirst({
      where: { name: c.name, type: c.type },
    });
    if (existing) {
      skipped++;
      continue;
    }
    await db.propertyCategory.create({
      data: { name: c.name, type: c.type, published: true },
    });
    added++;
  }

  const total = await db.propertyCategory.count();
  const byType = await db.propertyCategory.groupBy({
    by: ["type"],
    _count: { _all: true },
  });

  console.log(`   ✓ ${added} added · ${skipped} already existed`);
  console.log(`\n📊 Totals in DB: ${total} categories`);
  console.log("   Breakdown:", byType.map((t) => `${t.type}=${t._count._all}`).join(", "));
  console.log(`\n✅ Done.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
