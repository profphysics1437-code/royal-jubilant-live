/**
 * Patch: ensure every agent has at least 2 listings.
 * Adds new properties for agents who currently have <2.
 */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const SAMPLE_PROPERTIES = [
  {
    reference: "RJ-SEED-VLA-001",
    title: "Spacious 3BR Villa with Private Garden — Arabian Ranches",
    status: "sale", type: "Villa", community: "Arabian Ranches", emirate: "Dubai",
    price: 4_850_000, area: 3200, bedrooms: 3, bathrooms: 4, parking: 2,
    description: "Beautiful family villa in Arabian Ranches with large private garden, covered parking, and community pool access. Move-in ready.",
    reraNumber: "RERA-SEED-001",
    amenities: '["Private Garden", "Maid\'s Room", "Covered Parking", "Community Pool"]',
    images: '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80"]',
  },
  {
    reference: "RJ-SEED-APT-002",
    title: "1BR Apartment with Burj View — Downtown Dubai",
    status: "rent", type: "Apartment", community: "Downtown Dubai", emirate: "Dubai",
    price: 95_000, area: 720, bedrooms: 1, bathrooms: 2, parking: 1, rentFrequency: "Yearly", noOfCheques: 1,
    description: "Stylish 1-bedroom apartment in The Address Boulevard with full Burj Khalifa fountain view. Furnished, high floor.",
    reraNumber: "RERA-SEED-002",
    amenities: '["Burj View", "Furnished", "Gym", "Pool", "Concierge"]',
    images: '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80"]',
  },
  {
    reference: "RJ-SEED-PEN-003",
    title: "5BR Sky Penthouse — Palm Jumeirah",
    status: "sale", type: "Penthouse", community: "Palm Jumeirah", emirate: "Dubai",
    price: 18_500_000, area: 7800, bedrooms: 5, bathrooms: 6, parking: 4,
    description: "One-of-a-kind penthouse on Palm Jumeirah with private infinity pool, elevator, and 360° sea view. Fully furnished by Fendi Casa.",
    reraNumber: "RERA-SEED-003",
    amenities: '["Private Pool", "Private Elevator", "Sea View", "Smart Home", "Maid\'s Room"]',
    images: '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"]',
  },
  {
    reference: "RJ-SEED-TH-004",
    title: "4BR Townhouse — Dubai Hills Estate",
    status: "sale", type: "Townhouse", community: "Dubai Hills Estate", emirate: "Dubai",
    price: 3_900_000, area: 2400, bedrooms: 4, bathrooms: 4, parking: 2,
    description: "Corner-unit townhouse in Sidra, Dubai Hills. Open-plan living, upgraded kitchen, landscaped garden facing park.",
    reraNumber: "RERA-SEED-004",
    amenities: '["Park View", "Upgraded Kitchen", "Maid\'s Room", "Covered Parking"]',
    images: '["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=80"]',
  },
  {
    reference: "RJ-SEED-OFC-005",
    title: "Grade-A Office Space — DIFC",
    status: "sale", type: "Office", community: "Downtown Dubai", emirate: "Dubai", category: "Commercial",
    price: 2_750_000, area: 1850, bedrooms: 0, bathrooms: 2, parking: 2,
    description: "Premium office in DIFC Gate District. Fitted, partitioned, with meeting rooms and pantry. Freehold.",
    reraNumber: "RERA-SEED-005",
    amenities: '["Fitted", "Meeting Rooms", "Pantry", "24/7 Access"]',
    images: '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"]',
  },
];

async function main() {
  console.log("🔧 Patching: ensure every agent has ≥2 listings...\n");
  const agentUsers = await db.user.findMany({ where: { role: "agent" }, select: { id: true, email: true, name: true } });

  let created = 0;
  let propIdx = 0;
  for (const agent of agentUsers) {
    const cnt = await db.property.count({ where: { agentId: agent.id } });
    if (cnt >= 2) continue;
    const needed = 2 - cnt;
    for (let i = 0; i < needed; i++) {
      const sp = SAMPLE_PROPERTIES[propIdx % SAMPLE_PROPERTIES.length];
      propIdx++;
      const reference = `${sp.reference}-${agent.email.split("@")[0]}`;
      const slug = reference.toLowerCase();
      try {
        const p = await db.property.create({
          data: {
            reference, slug,
            title: sp.title, status: sp.status, category: sp.category || (["Apartment", "Villa", "Townhouse", "Penthouse", "Studio", "Duplex", "Compound"].includes(sp.type) ? "Residential" : "Commercial"),
            type: sp.type,
            country: "UAE", emirate: sp.emirate, community: sp.community,
            bedrooms: sp.bedrooms, bathrooms: sp.bathrooms, area: sp.area, parking: sp.parking,
            price: sp.price,
            pricePerSqft: Math.round(sp.price / sp.area),
            rentFrequency: sp.rentFrequency || null,
            noOfCheques: sp.noOfCheques || null,
            furnishingStatus: "Furnished",
            completionStatus: "Ready",
            description: sp.description, reraNumber: sp.reraNumber,
            amenities: sp.amenities,
            indoorFeatures: sp.amenities,
            buildingAmenities: sp.amenities,
            images: sp.images,
            features: sp.amenities,
            furnished: true,
            agentId: agent.id,
            published: true,
            featured: i === 0,
            isLatest: true,
          },
        });
        console.log(`  ✓ created ${p.reference} → ${agent.email}`);
        created++;
      } catch (e: any) {
        console.error(`  ✗ failed for ${agent.email}: ${e?.message}`);
      }
    }
  }

  console.log(`\n✅ Created ${created} additional listings.\n`);
  console.log("--- Per-agent listing counts ---");
  for (const a of agentUsers) {
    const c = await db.property.count({ where: { agentId: a.id } });
    console.log(`  ${a.email}: ${c} listings`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
