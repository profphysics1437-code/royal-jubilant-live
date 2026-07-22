// Replace fabricated testimonials with REAL Google reviews extracted from
// https://g.page/r/CWwdHxw2Au2NEBM/review
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// Real reviews extracted from the Google Maps page (static HTML)
const realReviews = [
  {
    name: "Sujesh Pullarkad",
    role: "Google Reviewer",
    location: "Dubai, UAE",
    rating: 5,
    quote: "Muhammad Javed, Best Broker in Dubai – Professional & Highly Recommended! If you are looking for a home in Dubai, do yourself a favor and connect with him. Smooth, reliable and genuinely helpful throughout the entire process.",
    service: "Home Search — Dubai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ahmed Mohey",
    role: "Google Reviewer",
    location: "Dubai, UAE",
    rating: 5,
    quote: "Great experience from start to finish. Professional, helpful, and responsive throughout the process. Muhammed Javed made finding and securing my new home easy and stress-free. Thank you!",
    service: "Home Purchase — Dubai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Arif Dewi",
    role: "Local Guide · 53 reviews",
    location: "Dubai, UAE",
    rating: 5,
    quote: "Huge thank you to Mr Awais who helped me to find a perfect home for my family. You can trust this person, highly recommend if you're looking for a place to live in Dubai! Professional, polite and always on time.",
    service: "Family Home — Dubai",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
  },
];

(async () => {
  console.log("🗑️  Clearing existing testimonials...\n");
  await db.testimonial.deleteMany({});
  console.log("✓ Deleted all existing testimonials\n");

  console.log("⭐ Adding 3 REAL Google reviews...\n");
  for (const r of realReviews) {
    const created = await db.testimonial.create({ data: r });
    console.log("✓ Added: " + created.name + " | " + created.rating + "★ | " + created.service);
  }

  const count = await db.testimonial.count();
  console.log("\n📊 Total testimonials now: " + count);
  console.log("\n⚠️  Only 3 reviews were extractable from Google's static HTML.");
  console.log("   Google blocks scraping of the full review list (74 reviews).");
  console.log("   To add more, the user can either:");
  console.log("   1. Paste review text manually in the admin portal");
  console.log("   2. Use the Google Places API (requires API key)");
  await db.$disconnect();
})().catch(e => { console.error("ERROR:", e); process.exit(1); });
