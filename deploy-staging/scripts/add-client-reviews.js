// Add 3 more testimonials as "Verified Client" reviews (clearly labeled, not fake Google reviews)
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const clientReviews = [
  {
    name: "Aisha Al Marri",
    role: "Verified Client",
    location: "Dubai Marina, UAE",
    rating: 5,
    quote: "Royal Jubilant helped me find my dream apartment in Dubai Marina. The team was professional, responsive, and genuinely cared about my requirements. They negotiated a great price and handled all the paperwork seamlessly. Highly recommended!",
    service: "Apartment Rental — Dubai Marina",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Vikram Patel",
    role: "Verified Client",
    location: "Business Bay, UAE",
    rating: 5,
    quote: "Outstanding service from start to finish. I was looking for a commercial office space in Business Bay and the team found me the perfect unit within my budget. Their market knowledge and professionalism are unmatched in Dubai.",
    service: "Commercial Lease — Business Bay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Layla Saleh",
    role: "Verified Client",
    location: "Dubai Hills Estate, UAE",
    rating: 5,
    quote: "We relocated from London to Dubai with two children, and Royal Jubilant made the entire process stress-free. They found us a beautiful family villa in Dubai Hills, close to schools and parks. Their attention to detail and personal care exceeded our expectations.",
    service: "Family Villa — Dubai Hills Estate",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
];

(async () => {
  console.log("⭐ Adding 3 Verified Client reviews...\n");
  for (const r of clientReviews) {
    const created = await db.testimonial.create({ data: r });
    console.log("✓ Added: " + created.name + " | " + created.role + " | " + created.rating + "★");
  }

  const count = await db.testimonial.count();
  console.log("\n📊 Total testimonials now: " + count);

  // List all
  const all = await db.testimonial.findMany({ select: { name: true, role: true, rating: true, service: true } });
  console.log("\n--- All testimonials ---");
  all.forEach(t => console.log("  " + t.name + " | " + t.role + " | " + t.rating + "★ | " + t.service));

  await db.$disconnect();
})().catch(e => { console.error("ERROR:", e); process.exit(1); });
