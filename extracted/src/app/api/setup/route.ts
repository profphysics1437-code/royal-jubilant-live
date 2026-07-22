import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { agents as agentData, communities as communityData, developers as developerData, blogPosts as blogData, testimonials as testimonialData, awards as awardData, properties as propertyData } from "@/lib/data";

export async function GET(req: NextRequest) {
  const results: string[] = [];

  try {
    // 1. Create admin user
    const adminEmail = "admin@royaljubilant.ae";
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      await db.user.create({
        data: {
          email: adminEmail,
          name: "Royal Jubilant Admin",
          role: "admin",
          passwordHash: bcrypt.hashSync("admin123", 10),
        },
      });
      results.push("✓ Admin user created: admin@royaljubilant.ae / admin123");
    } else {
      results.push("= Admin user already exists");
    }

    // 2. Create agent user accounts
    const agentAccounts = [
      { email: "muhammad.javed.zafar@royaljubilant.ae", password: "javed2026", name: "Muhammad Javed Zafar" },
      { email: "maria.raza@royaljubilant.ae", password: "maria2026", name: "Maria Raza" },
      { email: "muhammad.naeem.zafar@royaljubilant.ae", password: "naeem2026", name: "Muhammad Naeem Zafar" },
      { email: "naqash.haider@royaljubilant.ae", password: "naqash2026", name: "Naqash Haider" },
      { email: "muhammad.saleem.khan@royaljubilant.ae", password: "saleem2026", name: "Muhammad Saleem Khan" },
      { email: "awais.ali@royaljubilant.ae", password: "zeerak2026", name: "Awais Ali" },
      { email: "ahmad.ali@royaljubilant.ae", password: "ahmad2026", name: "Ahmad Ali" },
      { email: "muhammad.nazim@royaljubilant.ae", password: "nazim2026", name: "Muhammad Nazim" },
    ];
    for (const a of agentAccounts) {
      const exists = await db.user.findUnique({ where: { email: a.email } });
      if (!exists) {
        await db.user.create({
          data: { email: a.email, name: a.name, role: "agent", passwordHash: bcrypt.hashSync(a.password, 10) },
        });
        results.push(`✓ Agent created: ${a.email}`);
      }
    }

    // 3. Seed agents
    const agentCount = await db.agent.count();
    if (agentCount === 0) {
      for (const a of agentData) {
        await db.agent.create({
          data: {
            name: a.name, title: a.title, photo: a.photo, phone: a.phone,
            whatsapp: a.whatsapp, email: a.email,
            languages: JSON.stringify(a.languages),
            specializations: JSON.stringify(a.specializations),
            communities: JSON.stringify(a.communities),
            biography: a.biography,
            awards: JSON.stringify(a.awards),
            rating: a.rating, reviewsCount: a.reviewsCount,
            activeListings: a.activeListings, soldProperties: a.soldProperties,
            experienceYears: a.experienceYears,
            linkedin: a.socials.linkedin || null,
            instagram: a.socials.instagram || null,
            published: true, order: 0,
          },
        });
      }
      results.push(`✓ ${agentData.length} agents seeded`);
    } else {
      results.push(`= Agents already exist (${agentCount})`);
    }

    // 4. Apply custom agent changes
    await db.agent.updateMany({ where: { name: "Zeerak Hussain" }, data: { name: "Awais Ali", email: "awais.ali@royaljubilant.ae", photo: "/team/awais-ali.webp" } });
    await db.user.updateMany({ where: { email: "zeerak.hussain@royaljubilant.ae" }, data: { email: "awais.ali@royaljubilant.ae", name: "Awais Ali" } });
    await db.agent.updateMany({ where: { name: "Ahmad Raza" }, data: { name: "Ahmad Ali" } });
    await db.agent.updateMany({ where: { name: "Muhammad Javed Zafar" }, data: { order: 1, photo: "/team/muhammad-javed-zafar.webp" } });
    await db.agent.updateMany({ where: { name: "Maria Raza" }, data: { order: 2, photo: "/team/maria-raza.jpeg" } });
    await db.agent.updateMany({ where: { name: "Awais Ali" }, data: { order: 10 } });
    await db.agent.updateMany({ where: { name: "Muhammad Saleem Khan" }, data: { order: 11 } });
    await db.agent.updateMany({ where: { name: "Muhammad Naeem Zafar" }, data: { order: 12, photo: "/team/muhammad-naeem-zafar.webp" } });
    await db.agent.updateMany({ where: { name: "Naqash Haider" }, data: { order: 13 } });
    await db.agent.updateMany({ where: { name: "Ahmad Ali" }, data: { order: 14 } });
    await db.agent.updateMany({ where: { name: "Muhammad Nazim" }, data: { order: 15 } });
    results.push("✓ Agent custom changes applied (Awais Ali, Ahmad Ali, ordering)");

    // 5. Seed communities
    if ((await db.community.count()) === 0) {
      for (const c of communityData) {
        await db.community.create({
          data: {
            name: c.name, shortName: c.shortName, hero: c.hero, overview: c.overview,
            lifestyle: c.lifestyle, averagePrice: c.averagePrice, pricePerSqft: c.pricePerSqft,
            roi: c.roi, population: c.population, totalProperties: c.totalProperties,
            rating: c.rating, highlights: JSON.stringify(c.highlights),
            schools: JSON.stringify(c.schools), hospitals: JSON.stringify(c.hospitals),
            transport: JSON.stringify(c.transport), shopping: JSON.stringify(c.shopping),
            nearbyCommunities: JSON.stringify(c.nearbyCommunities), stats: JSON.stringify(c.stats),
            published: true,
          },
        });
      }
      results.push(`✓ ${communityData.length} communities seeded`);
    }

    // 6. Seed developers
    if ((await db.developer.count()) === 0) {
      for (const d of developerData) {
        await db.developer.create({
          data: {
            name: d.name, logo: d.logo, founded: d.founded, headquarters: d.headquarters,
            overview: d.overview, totalProjects: d.totalProjects,
            completedProjects: d.completedProjects, ongoingProjects: d.ongoingProjects,
            awards: JSON.stringify(d.awards), hero: d.hero, topProjects: JSON.stringify(d.topProjects),
            published: true,
          },
        });
      }
      results.push(`✓ ${developerData.length} developers seeded`);
    }

    // 7. Seed properties
    if ((await db.property.count()) === 0) {
      const agents = await db.agent.findMany();
      const agentMap = new Map(agents.map(a => [a.name, a]));
      const users = await db.user.findMany({ where: { role: "agent" } });
      const userMap = new Map(users.map(u => [u.email, u]));

      for (const p of propertyData) {
        const agent = agentMap.get(p.agentId) || agents[0];
        const agentUser = userMap.get(agent?.email || "") || users[0];
        await db.property.create({
          data: {
            reference: p.reference, title: p.title, slug: (p as any).slug || p.reference,
            status: p.status, type: p.type, price: p.price,
            pricePerSqft: p.pricePerSqft || null,
            rentFrequency: p.rentFrequency || null,
            bedrooms: p.bedrooms, bathrooms: p.bathrooms, area: p.area,
            parking: p.parking, community: p.community,
            subCommunity: p.subCommunity || null, developer: p.developer || null,
            furnished: p.furnished, completionStatus: p.completionStatus || "Ready",
            handoverYear: p.handoverYear || null,
            amenities: JSON.stringify(p.amenities || []),
            features: JSON.stringify(p.features || []),
            images: JSON.stringify(p.images || []),
            paymentPlan: p.paymentPlan ? JSON.stringify(p.paymentPlan) : null,
            description: p.description,
            locationLat: p.location?.lat || 25.2048,
            locationLng: p.location?.lng || 55.2708,
            locationAddress: p.location?.address || p.community,
            featured: p.featured, isLatest: p.isLatest, isLuxury: p.isLuxury,
            published: true, agentId: agentUser?.id || null,
          },
        });
      }
      results.push(`✓ ${propertyData.length} properties seeded`);
    }

    // 8. Seed blog posts
    if ((await db.blogPost.count()) === 0) {
      for (const b of blogData) {
        await db.blogPost.create({
          data: {
            title: b.title, excerpt: b.excerpt, category: b.category,
            readTime: b.readTime, authorName: b.author, image: b.image,
            content: (b as any).content || b.excerpt, published: true,
          },
        });
      }
      results.push(`✓ ${blogData.length} blog posts seeded`);
    }

    // 9. Seed testimonials
    if ((await db.testimonial.count()) === 0) {
      const testimonials = [
        { name: "Ahmed Al Rashid", role: "Business Owner", location: "Dubai Marina, UAE", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", rating: 5, quote: "I can't recommend Royal Jubilant enough. I had the pleasure of working with their team — they are truly knowledgeable about the industry and very professional.", service: "Apartment Purchase — Dubai Marina" },
        { name: "Sara Khan", role: "Marketing Executive", location: "Downtown Dubai, UAE", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", rating: 5, quote: "Excellent service from start to finish. Muhammad Javed Zafar personally guided me through every step of renting my apartment in Downtown Dubai.", service: "Apartment Rental — Downtown Dubai" },
        { name: "James Mitchell", role: "Investor", location: "London, United Kingdom", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", rating: 5, quote: "As an overseas investor, I needed a real estate partner I could trust. Royal Jubilant delivered beyond expectations.", service: "Off-Plan Investment — Creek Harbour" },
        { name: "Fatima Hassan", role: "Family Relocation", location: "Palm Jumeirah, UAE", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80", rating: 5, quote: "We relocated our family to Dubai and Royal Jubilant made it seamless. Their team understood exactly what a family needs.", service: "Family Villa Acquisition — Palm Jumeirah" },
      ];
      for (const t of testimonials) { await db.testimonial.create({ data: t }); }
      results.push("✓ 4 testimonials seeded");
    }

    // 10. Seed awards
    if ((await db.award.count()) === 0) {
      for (const a of awardData) {
        await db.award.create({ data: { title: a.title, issuer: a.issuer, year: a.year, icon: a.icon || "award", published: true } });
      }
      results.push(`✓ ${awardData.length} awards seeded`);
    }

    // 11. Add RERA numbers
    const propsWithoutRera = await db.property.findMany({ where: { reraNumber: null } });
    const reras = ["71845-12345", "71932-67890", "72014-34567", "72156-89123", "72278-45678", "72391-23456", "72453-78901", "72567-34567", "72689-12345", "72734-56789", "72845-67890", "72956-23456"];
    for (let i = 0; i < propsWithoutRera.length && i < reras.length; i++) {
      await db.property.update({ where: { id: propsWithoutRera[i].id }, data: { reraNumber: reras[i] } });
    }
    results.push("✓ RERA numbers added");

    // 12. Google Reviews settings
    await db.siteSetting.upsert({ where: { key: "reviews.google" }, create: { key: "reviews.google", value: "https://www.google.com/search?q=Royal+Jubilant+Real+Estate+L.L.C+Reviews", category: "reviews" }, update: {} });
    await db.siteSetting.upsert({ where: { key: "reviews.googleRating" }, create: { key: "reviews.googleRating", value: "4.7", category: "reviews" }, update: {} });
    await db.siteSetting.upsert({ where: { key: "reviews.googleCount" }, create: { key: "reviews.googleCount", value: "74", category: "reviews" }, update: {} });
    results.push("✓ Google Reviews settings added (4.7★, 74 reviews)");

    // Final counts
    const counts = {
      users: await db.user.count(),
      agents: await db.agent.count(),
      properties: await db.property.count(),
      communities: await db.community.count(),
      developers: await db.developer.count(),
      testimonials: await db.testimonial.count(),
      awards: await db.award.count(),
      blogPosts: await db.blogPost.count(),
      faqs: await db.faq.count(),
      videos: await db.video.count(),
      siteSettings: await db.siteSetting.count(),
    };

    return NextResponse.json({
      success: true,
      message: "Database setup complete!",
      results,
      counts,
      login: {
        admin: "admin@royaljubilant.ae / admin123",
        agent: "muhammad.javed.zafar@royaljubilant.ae / javed2026",
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message, results }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
