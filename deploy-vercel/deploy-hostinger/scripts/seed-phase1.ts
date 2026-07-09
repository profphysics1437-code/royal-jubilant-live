/**
 * Seed Hero Slides, Locations, Property Categories, and Amenities
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const heroSlides = [
  {
    order: 0,
    heading1: "Discover Dubai's",
    heading2: "most extraordinary",
    heading3: "addresses.",
    subtitle: "From apartments and villas in family-friendly communities to commercial offices, off-plan launches and industrial units — Royal Jubilant's RERA-certified advisors deliver personal, research-led counsel across every Dubai property category.",
  },
  {
    order: 1,
    heading1: "Your Dream Property",
    heading2: "Awaits in Dubai",
    heading3: null,
    subtitle: "Discover exceptional homes and investment opportunities with Royal Jubilant Real Estate. Your journey to finding the perfect property starts here.",
  },
  {
    order: 2,
    heading1: "Premium Real Estate",
    heading2: "Services in Dubai",
    heading3: null,
    subtitle: "Buy, sell, rent or invest in Off Plan properties with Dubai's trusted real estate broker. RERA-certified advisors, deep local knowledge, and a commitment to smoother transactions.",
  },
  {
    order: 3,
    heading1: "Invest in Dubai's",
    heading2: "Most Exciting",
    heading3: "Off-Plan Projects",
    subtitle: "Pre-launch allocations from Emaar, DAMAC, Omniyat and Sobha with flexible payment plans and projected rental yields of 7-8% on completion.",
  },
  {
    order: 4,
    heading1: "Dubai's Premier",
    heading2: "Luxury Property",
    heading3: "Advisory",
    subtitle: "From beachfront Signature Villas on Palm Jumeirah to branded penthouses in Downtown — we deliver discreet, relationship-led counsel for the world's most discerning property owners.",
  },
];

const locations = [
  "Palm Jumeirah", "Downtown Dubai", "Dubai Marina", "Dubai Creek Harbour",
  "Dubai Hills Estate", "Business Bay", "JBR", "JVC", "Bluewaters Island",
  "Emirates Hills", "Jumeirah Bay Island", "Arabian Ranches", "Tilal Al Ghaf",
  "Madinat Jumeirah Living", "Port de La Mer", "Dubai South", "Arjan",
  "DIFC", "JLT", "Sheikh Zayed Road", "Dubai Investment Park", "Ras Al Khor",
  "Al Quoz", "Mirdif", "Dubai Sports City", "Jumeirah Golf Estates",
];

const categories = [
  { name: "Apartment", type: "residential" },
  { name: "Villa", type: "residential" },
  { name: "Penthouse", type: "residential" },
  { name: "Townhouse", type: "residential" },
  { name: "Studio", type: "residential" },
  { name: "Mansion", type: "residential" },
  { name: "Duplex", type: "residential" },
  { name: "Compound", type: "residential" },
  { name: "Office", type: "commercial" },
  { name: "Retail", type: "commercial" },
  { name: "Warehouse", type: "commercial" },
  { name: "Labor Camp", type: "commercial" },
  { name: "Shop", type: "commercial" },
  { name: "Factory", type: "commercial" },
];

const amenities = [
  { name: "Central A/C", category: "indoor" },
  { name: "Maids Room", category: "indoor" },
  { name: "Study Room", category: "indoor" },
  { name: "Walk-in Closet", category: "indoor" },
  { name: "Built-in Wardrobes", category: "indoor" },
  { name: "Kitchen Appliances", category: "indoor" },
  { name: "Pets Allowed", category: "indoor" },
  { name: "Private Jacuzzi", category: "indoor" },
  { name: "Laundry Room", category: "indoor" },
  { name: "Private Garden", category: "outdoor" },
  { name: "Private Pool", category: "outdoor" },
  { name: "Private Gym", category: "outdoor" },
  { name: "Private Garage", category: "outdoor" },
  { name: "Terrace", category: "outdoor" },
  { name: "Balcony", category: "outdoor" },
  { name: "BBQ Area", category: "outdoor" },
  { name: "Shared Pool", category: "building" },
  { name: "Shared Spa", category: "building" },
  { name: "Shared Gym", category: "building" },
  { name: "Security", category: "building" },
  { name: "Concierge", category: "building" },
  { name: "Children's Play Area", category: "building" },
  { name: "Beach Access", category: "building" },
  { name: "Covered Parking", category: "building" },
  { name: "Visitor Parking", category: "building" },
  { name: "Mosque", category: "building" },
  { name: "Retail", category: "building" },
  { name: "Metro", category: "nearby" },
  { name: "School", category: "nearby" },
  { name: "Hospital", category: "nearby" },
  { name: "Mall", category: "nearby" },
  { name: "Airport", category: "nearby" },
  { name: "Beach", category: "nearby" },
  { name: "Park", category: "nearby" },
  { name: "Sea View", category: "view" },
  { name: "Burj Khalifa View", category: "view" },
  { name: "City View", category: "view" },
  { name: "Pool View", category: "view" },
  { name: "Garden View", category: "view" },
  { name: "Community View", category: "view" },
];

async function main() {
  console.log("🌱 Seeding Phase 1 data...\n");

  // Hero slides
  const existingSlides = await db.heroSlide.count();
  if (existingSlides === 0) {
    for (const slide of heroSlides) {
      await db.heroSlide.create({ data: slide });
    }
    console.log(`✓ Seeded ${heroSlides.length} hero slides`);
  } else {
    console.log(`✓ Hero slides already exist (${existingSlides})`);
  }

  // Locations
  const existingLocations = await db.location.count();
  if (existingLocations === 0) {
    for (const name of locations) {
      await db.location.create({ data: { name, emirate: "Dubai", country: "UAE" } });
    }
    console.log(`✓ Seeded ${locations.length} locations`);
  } else {
    console.log(`✓ Locations already exist (${existingLocations})`);
  }

  // Property categories
  const existingCats = await db.propertyCategory.count();
  if (existingCats === 0) {
    for (const cat of categories) {
      await db.propertyCategory.create({ data: cat });
    }
    console.log(`✓ Seeded ${categories.length} property categories`);
  } else {
    console.log(`✓ Categories already exist (${existingCats})`);
  }

  // Amenities
  const existingAmenities = await db.amenity.count();
  if (existingAmenities === 0) {
    for (const amenity of amenities) {
      await db.amenity.create({ data: amenity });
    }
    console.log(`✓ Seeded ${amenities.length} amenities`);
  } else {
    console.log(`✓ Amenities already exist (${existingAmenities})`);
  }

  // Add hero settings
  const heroSettings = [
    { key: "hero.videoUrl", value: "/dubai-skyline.mp4", category: "hero" },
    { key: "hero.overlayOpacity", value: "85", category: "hero" },
    { key: "hero.height", value: "92vh", category: "hero" },
    { key: "hero.slideInterval", value: "5000", category: "hero" },
  ];
  for (const s of heroSettings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✓ Seeded ${heroSettings.length} hero settings`);

  console.log("\n🎉 Phase 1 seed complete!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
