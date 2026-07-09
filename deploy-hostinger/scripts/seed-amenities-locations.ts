/**
 * Seed Amenities + Locations with realistic Dubai real-estate data.
 *
 * Run with:
 *   npx tsx scripts/seed-amenities-locations.ts
 *
 * Safe to re-run — uses upsert, so existing rows are preserved.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type AmenitySeed = { name: string; category: "indoor" | "outdoor" | "building" | "nearby" | "view"; icon?: string };

const AMENITIES: AmenitySeed[] = [
  // Indoor
  { name: "Central A/C", category: "indoor", icon: "wind" },
  { name: "Central Heating", category: "indoor", icon: "flame" },
  { name: "Fully Fitted Kitchen", category: "indoor", icon: "utensils" },
  { name: "Built-in Wardrobes", category: "indoor", icon: "shirt" },
  { name: "Walk-in Closet", category: "indoor", icon: "shirt" },
  { name: "Maid's Room", category: "indoor", icon: "door-open" },
  { name: "Laundry Room", category: "indoor", icon: "washing-machine" },
  { name: "Study Room", category: "indoor", icon: "book-open" },
  { name: "Storage Room", category: "indoor", icon: "package" },
  { name: "Smart Home System", category: "indoor", icon: "cpu" },
  { name: "Home Cinema", category: "indoor", icon: "film" },
  { name: "Floor-to-Ceiling Windows", category: "indoor", icon: "square" },
  { name: "Marble Flooring", category: "indoor", icon: "square" },
  { name: "Chandelier", category: "indoor", icon: "lightbulb" },
  { name: "Open Plan Layout", category: "indoor", icon: "layout" },

  // Outdoor
  { name: "Private Pool", category: "outdoor", icon: "waves" },
  { name: "Private Garden", category: "outdoor", icon: "trees" },
  { name: "Balcony", category: "outdoor", icon: "door-open" },
  { name: "Terrace", category: "outdoor", icon: "square" },
  { name: "Barbecue Area", category: "outdoor", icon: "flame" },
  { name: "Outdoor Kitchen", category: "outdoor", icon: "utensils" },
  { name: "Covered Parking", category: "outdoor", icon: "car" },
  { name: "Private Garage", category: "outdoor", icon: "car" },

  // Building
  { name: "Swimming Pool", category: "building", icon: "waves" },
  { name: "Gymnasium", category: "building", icon: "dumbbell" },
  { name: "Sauna", category: "building", icon: "flame" },
  { name: "Steam Room", category: "building", icon: "flame" },
  { name: "Jacuzzi", category: "building", icon: "waves" },
  { name: "24/7 Security", category: "building", icon: "shield" },
  { name: "CCTV Surveillance", category: "building", icon: "camera" },
  { name: "Concierge Service", category: "building", icon: "bell" },
  { name: "Reception / Lobby", category: "building", icon: "door-open" },
  { name: "High-Speed Elevators", category: "building", icon: "arrow-up" },
  { name: "Prayer Room", category: "building", icon: "moon" },
  { name: "Children's Play Area", category: "building", icon: "baby" },
  { name: "Kids Pool", category: "building", icon: "waves" },
  { name: "Kids Club", category: "building", icon: "baby" },
  { name: "Day Care", category: "building", icon: "baby" },
  { name: "Business Centre", category: "building", icon: "briefcase" },
  { name: "Meeting Room", category: "building", icon: "users" },
  { name: "Co-working Lounge", category: "building", icon: "laptop" },
  { name: "Library", category: "building", icon: "book-open" },
  { name: "Lounge Area", category: "building", icon: "sofa" },
  { name: "Retail Outlets", category: "building", icon: "shopping-bag" },
  { name: "Supermarket", category: "building", icon: "shopping-cart" },
  { name: "Restaurant / Cafe", category: "building", icon: "coffee" },
  { name: "ATM", category: "building", icon: "credit-card" },
  { name: "EV Charging Station", category: "building", icon: "zap" },
  { name: "Visitor Parking", category: "building", icon: "car" },
  { name: "Maintenance Services", category: "building", icon: "wrench" },
  { name: "Property Management", category: "building", icon: "clipboard" },
  { name: "Waste Disposal", category: "building", icon: "trash-2" },
  { name: "District Cooling", category: "building", icon: "wind" },

  // Nearby
  { name: "Metro Station", category: "nearby", icon: "train" },
  { name: "Tram Station", category: "nearby", icon: "train" },
  { name: "Bus Stop", category: "nearby", icon: "bus" },
  { name: "Shopping Mall", category: "nearby", icon: "shopping-bag" },
  { name: "School", category: "nearby", icon: "graduation-cap" },
  { name: "Hospital", category: "nearby", icon: "plus-square" },
  { name: "Clinic", category: "nearby", icon: "plus-square" },
  { name: "Pharmacy", category: "nearby", icon: "plus-square" },
  { name: "Mosque", category: "nearby", icon: "moon" },
  { name: "Beach Access", category: "nearby", icon: "waves" },
  { name: "Beach Club", category: "nearby", icon: "waves" },
  { name: "Golf Course", category: "nearby", icon: "flag" },
  { name: "Tennis Court", category: "nearby", icon: "circle" },
  { name: "Cricket Pitch", category: "nearby", icon: "circle" },
  { name: "Football Pitch", category: "nearby", icon: "circle" },
  { name: "Basketball Court", category: "nearby", icon: "circle" },
  { name: "Paddle Court", category: "nearby", icon: "circle" },
  { name: "Squash Court", category: "nearby", icon: "circle" },
  { name: "Park", category: "nearby", icon: "trees" },
  { name: "Promenade", category: "nearby", icon: "route" },
  { name: "Cycling Track", category: "nearby", icon: "bike" },
  { name: "Jogging Track", category: "nearby", icon: "footprints" },
  { name: "Marina", category: "nearby", icon: "anchor" },
  { name: "Yacht Club", category: "nearby", icon: "anchor" },
  { name: "Airport Nearby", category: "nearby", icon: "plane" },
  { name: "Restaurant Nearby", category: "nearby", icon: "utensils" },
  { name: "Cafe Nearby", category: "nearby", icon: "coffee" },
  { name: "Bank Nearby", category: "nearby", icon: "landmark" },
  { name: "Petrol Station", category: "nearby", icon: "fuel" },

  // View
  { name: "Sea View", category: "view", icon: "waves" },
  { name: "Beach View", category: "view", icon: "waves" },
  { name: "Marina View", category: "view", icon: "anchor" },
  { name: "Palm View", category: "view", icon: "palmtree" },
  { name: "Burj Khalifa View", category: "view", icon: "building" },
  { name: "Boulevard View", category: "view", icon: "road" },
  { name: "Skyline View", category: "view", icon: "building" },
  { name: "City View", category: "view", icon: "building" },
  { name: "Park View", category: "view", icon: "trees" },
  { name: "Golf View", category: "view", icon: "flag" },
  { name: "Pool View", category: "view", icon: "waves" },
  { name: "Garden View", category: "view", icon: "trees" },
  { name: "Lake View", category: "view", icon: "waves" },
  { name: "Fountain View", category: "view", icon: "waves" },
  { name: "Creek View", category: "view", icon: "waves" },
  { name: "Sunset View", category: "view", icon: "sun" },
  { name: "Panoramic View", category: "view", icon: "eye" },
  { name: "Full Sea View", category: "view", icon: "waves" },
  { name: "Partial Sea View", category: "view", icon: "waves" },
  { name: "Lagoon View", category: "view", icon: "waves" },
];

type LocationSeed = { name: string; emirate?: string; country?: string };

const LOCATIONS: LocationSeed[] = [
  // Dubai — prime communities
  { name: "Palm Jumeirah" },
  { name: "Dubai Marina" },
  { name: "Downtown Dubai" },
  { name: "Business Bay" },
  { name: "Jumeirah Beach Residence (JBR)" },
  { name: "Jumeirah Lakes Towers (JLT)" },
  { name: "Bluewaters Island" },
  { name: "Dubai Hills Estate" },
  { name: "Emirates Hills" },
  { name: "Jumeirah Golf Estates" },
  { name: "Dubai Creek Harbour" },
  { name: "Emaar Beachfront" },
  { name: "Port de La Mer" },
  { name: "La Mer" },
  { name: "City Walk" },
  { name: "DIFC" },
  { name: "Jumeirah Bay Island" },
  { name: "Pearl Jumeirah" },
  { name: "Dubai Harbour" },
  { name: "Dubai Marina Gate" },
  { name: "Dubai Water Canal" },
  { name: "Burj Khalifa Area" },
  { name: "Old Town Dubai" },
  { name: "The Address Boulevard District" },
  { name: "Opera District" },
  { name: "Mohammed Bin Rashid City (MBR City)" },
  { name: "District One" },
  { name: "Meydan" },
  { name: "Dubai Hills Park" },

  // Dubai — family / suburban
  { name: "Arabian Ranches" },
  { name: "Arabian Ranches 2" },
  { name: "Arabian Ranches 3" },
  { name: "The Springs" },
  { name: "The Meadows" },
  { name: "The Lakes" },
  { name: "The Greens" },
  { name: "The Views" },
  { name: "Town Square" },
  { name: "Damac Hills" },
  { name: "Damac Hills 2" },
  { name: "Akoya" },
  { name: "Mudon" },
  { name: "Sustainable City" },
  { name: "Al Barari" },
  { name: "The Villa" },
  { name: "Falcon City of Wonders" },
  { name: "Living Legends" },
  { name: "Layan Community" },
  { name: "Al Waha" },

  // Dubai — Jumeirah / older coastal
  { name: "Jumeirah 1" },
  { name: "Jumeirah 2" },
  { name: "Jumeirah 3" },
  { name: "Umm Suqeim 1" },
  { name: "Umm Suqeim 2" },
  { name: "Umm Suqeim 3" },
  { name: "Al Sufouh" },
  { name: "Al Wasl" },
  { name: "Safa" },
  { name: "Al Manara" },
  { name: "Al Quoz" },

  // Dubai — new & emerging
  { name: "Madinat Jumeirah Living" },
  { name: "Dubai South" },
  { name: "EXPO City" },
  { name: "Tilal Al Ghaf" },
  { name: "Mina Rashid" },
  { name: "Palm Jebel Ali" },
  { name: "Palm Deira" },
  { name: "Deira Islands" },
  { name: "Dubai Islands" },
  { name: "Meydan One" },
  { name: "Wadi Al Safa" },
  { name: "Al Furjan" },
  { name: "Discovery Gardens" },
  { name: "The Gardens (Jebel Ali)" },
  { name: "Jebel Ali Village" },
  { name: "Green Community" },
  { name: "DIP (Dubai Investments Park)" },
  { name: "DAMAC Lagoons" },
  { name: "DAMAC Hills 2 (Akoya By DAMAC)" },

  // Dubai — Business / commercial
  { name: "Barsha Heights (Tecom)" },
  { name: "Sheikh Zayed Road" },
  { name: "Al Quoz Industrial" },
  { name: "Ras Al Khor" },
  { name: "Dubai Investment Park (DIP)" },
  { name: "Dubai Production City" },
  { name: "Dubai Silicon Oasis" },
  { name: "Dubai Internet City" },
  { name: "Dubai Media City" },
  { name: "Dubai Knowledge Park" },
  { name: "Dubai Academic City" },
  { name: "Dubai Healthcare City" },
  { name: "Dubai Festival City" },
  { name: "Dubai Festival Plaza" },
  { name: "Cityland Mall" },
  { name: "Nad Al Sheba" },

  // Dubai — older / heritage areas
  { name: "Deira" },
  { name: "Bur Dubai" },
  { name: "Al Karama" },
  { name: "Al Ras" },
  { name: "Naif" },
  { name: "Corniche Deira" },
  { name: "Dubai Healthcare City" },
  { name: "Oud Metha" },
  { name: "Zabeel" },
  { name: "Al Badaa" },
  { name: "Al Satwa" },
  { name: "Karama" },

  // Dubai — affordability / new launches
  { name: "Jumeirah Village Circle (JVC)" },
  { name: "Jumeirah Village Triangle (JVT)" },
  { name: "Liwan" },
  { name: "Reem" },
  { name: "Majan" },
  { name: "Dubailand" },
  { name: "Remraam" },
  { name: "Damac Riverside" },

  // Abu Dhabi (some properties overlap)
  { name: "Saadiyat Island", emirate: "Abu Dhabi" },
  { name: "Al Reem Island", emirate: "Abu Dhabi" },
  { name: "Yas Island", emirate: "Abu Dhabi" },
  { name: "Al Maryah Island", emirate: "Abu Dhabi" },
  { name: "Khalifa City", emirate: "Abu Dhabi" },
  { name: "Al Raha Beach", emirate: "Abu Dhabi" },

  // Sharjah
  { name: "Al Majaz", emirate: "Sharjah" },
  { name: "Al Khan", emirate: "Sharjah" },
  { name: "Al Mamsha", emirate: "Sharjah" },
  { name: "Muwaileh", emirate: "Sharjah" },

  // Ras Al Khaimah
  { name: "Al Marjan Island", emirate: "Ras Al Khaimah" },
  { name: "Mina Al Arab", emirate: "Ras Al Khaimah" },

  // Ajman
  { name: "Al Zorah", emirate: "Ajman" },
  { name: "Ajman Corniche", emirate: "Ajman" },
];

async function main() {
  console.log(`\n🌱 Seeding ${AMENITIES.length} amenities...`);
  let aCount = 0;
  for (const a of AMENITIES) {
    // Use name+category as the natural key (no unique constraint in schema, so check first)
    const existing = await db.amenity.findFirst({ where: { name: a.name, category: a.category } });
    if (existing) {
      // Optionally patch missing icon
      if (!existing.icon && a.icon) {
        await db.amenity.update({ where: { id: existing.id }, data: { icon: a.icon } });
      }
      continue;
    }
    await db.amenity.create({
      data: { name: a.name, category: a.category, icon: a.icon || null, published: true },
    });
    aCount++;
  }
  console.log(`   ✓ ${aCount} new amenities added (${AMENITIES.length - aCount} already existed)`);

  console.log(`\n🌱 Seeding ${LOCATIONS.length} locations...`);
  let lCount = 0;
  for (const l of LOCATIONS) {
    const existing = await db.location.findFirst({ where: { name: l.name } });
    if (existing) continue;
    await db.location.create({
      data: {
        name: l.name,
        emirate: l.emirate || "Dubai",
        country: "UAE",
        published: true,
      },
    });
    lCount++;
  }
  console.log(`   ✓ ${lCount} new locations added (${LOCATIONS.length - lCount} already existed)`);

  const totalA = await db.amenity.count();
  const totalL = await db.location.count();
  console.log(`\n📊 Totals in DB:`);
  console.log(`   Amenities : ${totalA}`);
  console.log(`   Locations : ${totalL}`);
  console.log(`\n✅ Done.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
