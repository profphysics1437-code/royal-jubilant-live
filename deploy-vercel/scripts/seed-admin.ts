/**
 * Royal Jubilant admin seed.
 * Creates default admin user + populates agents, communities, developers,
 * blogs, testimonials, awards and site settings from the in-memory data.
 *
 * Run with: bun run scripts/seed-admin.ts
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  agents as agentData,
  communities as communityData,
  developers as developerData,
  blogPosts as blogData,
  testimonials as testimonialData,
  awards as awardData,
  properties as propertyData,
} from "../src/lib/data";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Royal Jubilant admin...");

  // 1) Admin user
  const adminEmail = "admin@royaljubilant.ae";
  const adminPassword = "admin123";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Royal Jubilant Admin",
      role: "admin",
      phone: "+971 4 327 8401",
      passwordHash,
    },
  });
  console.log(`✓ Admin user: ${admin.email} / ${adminPassword}`);

  // 2) Agents
  for (const a of agentData) {
    await db.agent.upsert({
      where: { email: a.email },
      update: {},
      create: {
        name: a.name,
        title: a.title,
        photo: a.photo,
        phone: a.phone,
        whatsapp: a.whatsapp,
        email: a.email,
        languages: JSON.stringify(a.languages),
        specializations: JSON.stringify(a.specializations),
        communities: JSON.stringify(a.communities),
        biography: a.biography,
        awards: JSON.stringify(a.awards),
        rating: a.rating,
        reviewsCount: a.reviewsCount,
        activeListings: a.activeListings,
        soldProperties: a.soldProperties,
        experienceYears: a.experienceYears,
        linkedin: a.socials.linkedin,
        instagram: a.socials.instagram,
        twitter: a.socials.twitter,
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${agentData.length} agents`);

  // 3) Communities
  for (const c of communityData) {
    await db.community.create({
      data: {
        name: c.name,
        shortName: c.shortName,
        hero: c.hero,
        overview: c.overview,
        lifestyle: c.lifestyle,
        averagePrice: c.averagePrice,
        pricePerSqft: c.pricePerSqft,
        roi: c.roi,
        population: c.population,
        totalProperties: c.totalProperties,
        rating: c.rating,
        highlights: JSON.stringify(c.highlights),
        schools: JSON.stringify(c.schools),
        hospitals: JSON.stringify(c.hospitals),
        transport: JSON.stringify(c.transport),
        shopping: JSON.stringify(c.shopping),
        nearbyCommunities: JSON.stringify(c.nearbyCommunities),
        stats: JSON.stringify(c.stats),
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${communityData.length} communities`);

  // 4) Developers
  for (const d of developerData) {
    await db.developer.create({
      data: {
        name: d.name,
        logo: d.logo,
        founded: d.founded,
        headquarters: d.headquarters,
        overview: d.overview,
        totalProjects: d.totalProjects,
        completedProjects: d.completedProjects,
        ongoingProjects: d.ongoingProjects,
        awards: JSON.stringify(d.awards),
        hero: d.hero,
        topProjects: JSON.stringify(d.topProjects),
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${developerData.length} developers`);

  // 5) Properties (link to admin user as agent-of-record placeholder)
  for (const p of propertyData) {
    await db.property.create({
      data: {
        reference: p.reference,
        title: p.title,
        slug: p.id,
        status: p.status,
        type: p.type,
        price: p.price,
        pricePerSqft: p.pricePerSqft ?? null,
        rentFrequency: p.rentFrequency ?? null,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area: p.area,
        parking: p.parking,
        community: p.community,
        subCommunity: p.subCommunity ?? null,
        developer: p.developer ?? null,
        furnished: p.furnished,
        completionStatus: p.completionStatus ?? null,
        handoverYear: p.handoverYear ?? null,
        amenities: JSON.stringify(p.amenities),
        images: JSON.stringify(p.images),
        description: p.description,
        features: JSON.stringify(p.features),
        paymentPlan: p.paymentPlan ? JSON.stringify(p.paymentPlan) : null,
        locationLat: p.location.lat,
        locationLng: p.location.lng,
        locationAddress: p.location.address,
        featured: p.featured,
        isLatest: p.isLatest,
        isLuxury: p.isLuxury,
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${propertyData.length} properties`);

  // 6) Blog posts
  for (const b of blogData) {
    await db.blogPost.create({
      data: {
        title: b.title,
        excerpt: b.excerpt,
        category: b.category,
        date: new Date(b.date),
        readTime: b.readTime,
        authorName: b.author,
        image: b.image,
        content: b.excerpt,
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${blogData.length} blog posts`);

  // 7) Testimonials
  for (const t of testimonialData) {
    await db.testimonial.create({
      data: {
        name: t.name,
        role: t.role,
        location: t.location,
        avatar: t.avatar,
        rating: t.rating,
        quote: t.quote,
        service: t.service,
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${testimonialData.length} testimonials`);

  // 8) Awards
  for (const a of awardData) {
    await db.award.create({
      data: {
        title: a.title,
        issuer: a.issuer,
        year: a.year,
        icon: a.icon,
        published: true,
      },
    });
  }
  console.log(`✓ Seeded ${awardData.length} awards`);

  // 9) Site settings
  const settings = [
    { key: "hero.title", value: "Discover Dubai's most extraordinary addresses.", category: "hero" },
    { key: "hero.subtitle", value: "From apartments and villas in family-friendly communities to commercial offices, off-plan launches and industrial units — Royal Jubilant's RERA-certified advisors deliver personal, research-led counsel across every Dubai property category.", category: "hero" },
    { key: "hero.badge", value: "Dubai Property Advisory · Burjuman Business Tower", category: "hero" },
    { key: "company.phone", value: "+971 4 327 8401", category: "contact" },
    { key: "company.email", value: "info@royaljubilant.ae", category: "contact" },
    { key: "company.address", value: "13th Floor, Office #54, Burjuman Business Tower, Dubai, UAE", category: "contact" },
    { key: "company.hours", value: "Mon – Sat, 9am – 6pm", category: "contact" },
    { key: "company.whatsapp", value: "97143278401", category: "contact" },
    { key: "stats.activeListings", value: "240+", category: "stats" },
    { key: "stats.categories", value: "18", category: "stats" },
    { key: "stats.advisors", value: "8", category: "stats" },
    { key: "stats.years", value: "10+", category: "stats" },
    { key: "social.facebook", value: "#", category: "social" },
    { key: "social.instagram", value: "#", category: "social" },
    { key: "social.tiktok", value: "#", category: "social" },
    { key: "social.linkedin", value: "#", category: "social" },
    { key: "social.twitter", value: "#", category: "social" },
  ];
  for (const s of settings) {
    await db.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✓ Seeded ${settings.length} site settings`);

  console.log("\n🎉 Admin seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin login:");
  console.log(`    URL:      http://localhost:3000/admin/login`);
  console.log(`    Email:    ${adminEmail}`);
  console.log(`    Password: ${adminPassword}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
