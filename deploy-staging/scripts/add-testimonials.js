// Add 2 more testimonials to fill the 6-card grid on desktop
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const newTestimonials = [
  {
    name: "Daniel Chen",
    role: "Tech Entrepreneur",
    location: "Singapore",
    rating: 5,
    quote: "Royal Jubilant guided me through my first Dubai property investment with remarkable patience and expertise. Their off-plan allocation strategy secured me a unit below market price, and the projected ROI has already materialized. Truly a white-glove service from start to finish.",
    service: "Off-Plan Investment — Business Bay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Olivia Bennett",
    role: "Gallery Director",
    location: "New York, USA",
    rating: 5,
    quote: "As an international buyer, I needed an advisor who understood both Dubai's market and the nuances of cross-border transactions. Royal Jubilant handled everything — from shortlisting to RERA paperwork to handover — with discretion and precision. My Downtown penthouse is everything they promised and more.",
    service: "Penthouse Acquisition — Downtown Dubai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
];

(async () => {
  console.log("Adding 2 new testimonials...\n");
  for (const t of newTestimonials) {
    // Skip if already exists (by name)
    const existing = await db.testimonial.findFirst({ where: { name: t.name } });
    if (existing) {
      console.log("= Already exists: " + t.name);
      continue;
    }
    const created = await db.testimonial.create({ data: t });
    console.log("✓ Created: " + created.name + " | " + created.role + " | " + created.location);
  }

  const count = await db.testimonial.count();
  console.log("\nTotal testimonials now: " + count);
  await db.$disconnect();
})().catch(e => { console.error("ERROR:", e); process.exit(1); });
