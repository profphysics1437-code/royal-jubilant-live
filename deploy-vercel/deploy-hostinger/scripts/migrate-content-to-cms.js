/**
 * One-time migration script: imports all remaining hardcoded content
 * from src/lib/data.ts and React components into the CMS database.
 * Idempotent — safe to run multiple times. Uses upserts and unique keys.
 */
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  console.log("🚀 Starting content migration to CMS database...\n");

  // ─── 1. FAQ migration ───────────────────────────────────────────────
  console.log("▸ Migrating FAQs...");
  const faqs = [
    { q: "What is the minimum property value for a Golden Visa in the UAE?", a: "Under the 2026 update, a property purchase of AED 2,000,000 or more qualifies you for the 10-year Golden Visa. Off-plan properties from approved developers are eligible once 20% of the purchase price is paid. Royal Jubilant handles the entire application in-house.", category: "buying" },
    { q: "Can non-residents buy property in Dubai?", a: "Yes. Non-residents can buy freehold property in designated areas of Dubai. Mortgages are available to non-residents at typically 60-70% LTV, and we work with 12 UAE banks to secure the best terms.", category: "buying" },
    { q: "What are the typical buyer-side costs?", a: "Buyer costs include: 4% Dubai Land Department transfer fee, 2% agent fee (Royal Jubilant), AED 4,000 title deed issuance, and a small admin fee. For off-plan, the agent fee is paid by the developer — buyers pay 0%.", category: "buying" },
    { q: "How long does the buying process take?", a: "For a ready property with mortgage: typically 30-45 days. For a cash purchase: 7-14 days. For off-plan: the SPA is signed within 7 days of booking, with payments spread across the construction timeline.", category: "buying" },
    { q: "What ROI should I expect on a Dubai investment?", a: "Yields vary by community and asset class. Prime apartments in Marina/Business Bay deliver 6.5-7.5%, townhouses in Dubai Hills 5.5-6%, and Palm villas 4.5-5.5%. Off-plan in emerging districts like Creek Harbour projects 7-8% on completion.", category: "investing" },
    { q: "Do you offer property management?", a: "Yes. Our in-house property management team handles tenant sourcing, rent collection, maintenance and renewals for an all-in fee of 5% of annual rent. We currently manage 480+ units on behalf of clients.", category: "general" },
    { q: "What languages does your team speak?", a: "Our 12 senior advisors collectively speak English, Arabic, French, German, Italian, Russian, Spanish, Hindi, Urdu, Yoruba and Mandarin. We will match you with an advisor who speaks your language.", category: "general" },
    { q: "How do you ensure discretion?", a: "We are ISO 27001 certified. All client data is encrypted at rest and in transit, access is role-based, and our advisors operate under strict NDAs. We never list client names publicly without explicit written consent.", category: "general" },
  ];
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    await db.faq.upsert({
      where: { id: `faq-seed-${i + 1}` },
      create: { id: `faq-seed-${i + 1}`, question: f.q, answer: f.a, category: f.category, order: i + 1, published: true },
      update: { question: f.q, answer: f.a, category: f.category, order: i + 1 },
    });
  }
  console.log(`  ✓ ${faqs.length} FAQs migrated\n`);

  // ─── 2. Market stats → site_settings ────────────────────────────────
  console.log("▸ Migrating market stats...");
  const marketStats = [
    { key: "stats.activeListings", value: "240+", category: "stats" },
    { key: "stats.aedClosed", value: "2.4B", category: "stats" },
    { key: "stats.advisors", value: "8", category: "stats" },
    { key: "stats.years", value: "10+", category: "stats" },
    { key: "stats.rating", value: "4.8", category: "stats" },
    { key: "stats.categories", value: "18", category: "stats" },
  ];
  for (const s of marketStats) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${marketStats.length} market stats migrated\n`);

  // ─── 3. Hero section text ───────────────────────────────────────────
  console.log("▸ Migrating hero section text...");
  const heroSettings = [
    { key: "hero.title", value: "Discover Dubai's most extraordinary addresses.", category: "hero" },
    { key: "hero.subtitle", value: "From apartments and villas in family-friendly communities to commercial offices, our portfolio spans every lifestyle and budget — guided by RERA-certified advisors who know Dubai inside-out.", category: "hero" },
    { key: "hero.badge", value: "Dubai Property Advisory · Burjuman Business Tower", category: "hero" },
    { key: "hero.videoUrl", value: "/dubai-skyline.mp4", category: "hero" },
    { key: "hero.overlayOpacity", value: "85", category: "hero" },
    { key: "hero.height", value: "92vh", category: "hero" },
    { key: "hero.slideInterval", value: "5000", category: "hero" },
  ];
  for (const s of heroSettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${heroSettings.length} hero settings migrated\n`);

  // ─── 4. Section texts ───────────────────────────────────────────────
  console.log("▸ Migrating section texts...");
  const sectionSettings = [
    { key: "explore.eyebrow", value: "Explore Property in Dubai", category: "explore" },
    { key: "explore.title", value: "Find Your Perfect Property", category: "explore" },
    { key: "explore.subtitle", value: "Royal Jubilant helps buyers, sellers, tenants and investors navigate Dubai real estate with clarity and confidence.", category: "explore" },
    { key: "agents.eyebrow", value: "The Royal Jubilant Team", category: "agents" },
    { key: "agents.title", value: "Meet Our Advisors", category: "agents" },
    { key: "agents.subtitle", value: "Senior, multilingual and certified — our advisors serve clients across 9 markets with discreet, relationship-led counsel.", category: "agents" },
    { key: "advice.eyebrow", value: "Dubai through the eyes of a Royal Jubilant advisor", category: "advice" },
    { key: "advice.title", value: "Our Advice", category: "advice" },
    { key: "advice.subtitle", value: "Watch our advisors share market insights, investment strategies and exclusive development reviews.", category: "advice" },
    { key: "newsletter.eyebrow", value: "Monthly Market Brief", category: "newsletter" },
    { key: "newsletter.title", value: "The most important Dubai property data in your inbox.", category: "newsletter" },
    { key: "newsletter.subtitle", value: "Join 12,000+ subscribers — fund managers, family offices and UHNW buyers.", category: "newsletter" },
    { key: "newsletter.button", value: "Subscribe", category: "newsletter" },
    { key: "newsletter.placeholder", value: "your@email.com", category: "newsletter" },
  ];
  for (const s of sectionSettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${sectionSettings.length} section texts migrated\n`);

  // ─── 5. Footer texts ────────────────────────────────────────────────
  console.log("▸ Migrating footer text...");
  const footerSettings = [
    { key: "footer.tagline", value: "Discreet, research-led Dubai real estate advisory for HNW and institutional clients.", category: "footer" },
    { key: "footer.copyright", value: "© 2026 Royal Jubilant Real Estate LLC. All rights reserved. RERA Brokerage BRK #87534.", category: "footer" },
    { key: "footer.address", value: "13th Floor, Office #54, Burjuman Business Tower, Dubai, UAE", category: "footer" },
  ];
  for (const s of footerSettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${footerSettings.length} footer settings migrated\n`);

  // ─── 6. Footer link columns ─────────────────────────────────────────
  console.log("▸ Migrating footer link columns...");
  const footerCols = {
    "footer.col1": { title: "Buy & Rent", links: [
      { label: "Properties for Rent", view: "rent" }, { label: "Properties for Sale", view: "buy" },
      { label: "Commercial Real Estate", view: "commercial" }, { label: "Off-Plan Projects", view: "off-plan" },
      { label: "Luxury Collection", view: "luxury" }, { label: "Latest Listings", view: "buy" },
    ]},
    "footer.col2": { title: "Communities", links: [
      { label: "Palm Jumeirah", view: "communities" }, { label: "Downtown Dubai", view: "communities" },
      { label: "Dubai Marina", view: "communities" }, { label: "Creek Harbour", view: "communities" },
      { label: "Dubai Hills", view: "communities" }, { label: "Business Bay", view: "communities" },
    ]},
    "footer.col3": { title: "Services", links: [
      { label: "Property Valuation", view: "contact" }, { label: "Mortgage Advisory", view: "contact" },
      { label: "Meet the Agents", view: "agents" }, { label: "Market Insights", view: "blog" },
      { label: "Careers", view: "careers" }, { label: "Contact Us", view: "contact" },
    ]},
    "footer.col4": { title: "Company", links: [
      { label: "About Us", view: "about" }, { label: "Our Story", view: "about" },
      { label: "Our Advice", view: "advice" }, { label: "Client Reviews", view: "testimonials" },
      { label: "FAQs", view: "faqs" }, { label: "Contact Us", view: "contact" },
    ]},
  };
  for (const [key, value] of Object.entries(footerCols)) {
    await db.siteSetting.upsert({ where: { key }, create: { key, value: JSON.stringify(value), category: "footer" }, update: { value: JSON.stringify(value), category: "footer" } });
  }
  console.log(`  ✓ 4 footer link columns migrated\n`);

  // ─── 7. SEO meta ────────────────────────────────────────────────────
  console.log("▸ Migrating SEO metadata...");
  const seoMetas = [
    { pageSlug: "home", metaTitle: "Royal Jubilant Real Estate LLC | Dubai Luxury Property Advisory", metaDescription: "Dubai's discreet, research-led real estate advisory. Browse 240+ active listings across Palm Jumeirah, Downtown, Dubai Hills and more." },
    { pageSlug: "rent", metaTitle: "Properties for Rent in Dubai | Royal Jubilant Real Estate", metaDescription: "Browse apartments, villas and townhouses for rent across Dubai's top communities." },
    { pageSlug: "buy", metaTitle: "Properties for Sale in Dubai | Royal Jubilant Real Estate", metaDescription: "Browse 1,200+ active sale listings across Dubai — from beachfront villas to branded penthouses." },
    { pageSlug: "commercial", metaTitle: "Commercial Real Estate in Dubai | Royal Jubilant", metaDescription: "Grade-A offices, retail and whole buildings across Business Bay, DIFC, JLT and Sheikh Zayed Road." },
    { pageSlug: "off-plan", metaTitle: "Off-Plan Projects in Dubai | Royal Jubilant Real Estate", metaDescription: "Pre-launch allocations from Emaar, DAMAC, Omniyat and Sobha with flexible payment plans." },
    { pageSlug: "agents", metaTitle: "Meet Our Advisors | Royal Jubilant Real Estate", metaDescription: "Senior, multilingual and RERA-certified advisors serving clients across 9 markets." },
    { pageSlug: "about", metaTitle: "Our Story | Royal Jubilant Real Estate LLC", metaDescription: "Discreet, research-led Dubai real estate advisory founded in 2014." },
    { pageSlug: "contact", metaTitle: "Contact Us | Royal Jubilant Real Estate", metaDescription: "Get in touch with our team. Burjuman Business Tower, Dubai. +971 4 327 8401." },
  ];
  for (const s of seoMetas) {
    await db.seoMeta.upsert({ where: { pageSlug: s.pageSlug }, create: { ...s }, update: { ...s } });
  }
  console.log(`  ✓ ${seoMetas.length} SEO meta records migrated\n`);

  // ─── 8. Company contact info ────────────────────────────────────────
  console.log("▸ Ensuring company contact info...");
  const contactSettings = [
    { key: "company.name", value: "Royal Jubilant Real Estate LLC", category: "contact" },
    { key: "company.phone", value: "+971 4 327 8401", category: "contact" },
    { key: "company.email", value: "info@royaljubilant.ae", category: "contact" },
    { key: "company.whatsapp", value: "971524942329", category: "contact" },
    { key: "company.address", value: "13th Floor, Office #54, Burjuman Business Tower, Dubai, UAE", category: "contact" },
    { key: "company.hours", value: "Mon – Sat, 9am – 6pm", category: "contact" },
    { key: "company.rera", value: "BRK #87534", category: "contact" },
  ];
  for (const s of contactSettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${contactSettings.length} contact settings migrated\n`);

  // ─── 9. Social links ────────────────────────────────────────────────
  console.log("▸ Ensuring social links...");
  const socialSettings = [
    { key: "social.facebook", value: "https://www.facebook.com/profile.php?id=100077096168331", category: "social" },
    { key: "social.instagram", value: "#", category: "social" },
    { key: "social.linkedin", value: "#", category: "social" },
    { key: "social.twitter", value: "#", category: "social" },
    { key: "social.tiktok", value: "#", category: "social" },
    { key: "social.youtube", value: "#", category: "social" },
  ];
  for (const s of socialSettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${socialSettings.length} social settings migrated\n`);

  // ─── 10. Google Reviews settings ────────────────────────────────────
  console.log("▸ Migrating Google Reviews settings...");
  const reviewSettings = [
    { key: "reviews.google", value: "https://www.google.com/search?q=Royal+Jubilant+Real+Estate+L.L.C+Reviews", category: "reviews" },
    { key: "reviews.googleRating", value: "4.7", category: "reviews" },
    { key: "reviews.googleCount", value: "74", category: "reviews" },
  ];
  for (const s of reviewSettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, create: { ...s }, update: { value: s.value, category: s.category } });
  }
  console.log(`  ✓ ${reviewSettings.length} review settings migrated\n`);

  // ─── 11. Advisor Videos ─────────────────────────────────────────────
  console.log("▸ Migrating advisor videos...");
  const videos = [
    { title: "River Side Investment Opportunity by Damac", advisor: "Muhammad Javed Zafar", role: "Managing Director", duration: "2:01", category: "Off-Plan", thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80", description: "An exclusive look at DAMAC's latest riverside development — investment potential, payment plans, and projected ROI.", videoUrl: "/videos/river-side-investment-damac.mp4", order: 1 },
    { title: "Palm Jumeirah Market Update — Q2 2026", advisor: "Muhammad Javed Zafar", role: "Managing Director", duration: "4:32", category: "Market Insights", thumbnail: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&q=80", description: "Why Palm Jumeirah villa prices are up 18% year-on-year and where the next opportunities lie.", order: 2 },
    { title: "Off-Plan Investment Strategy — Creek Harbour", advisor: "Muhammad Saleem Khan", role: "Property Consultant", duration: "6:15", category: "Off-Plan", thumbnail: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=600&q=80", description: "Projected rental yields, payment plans, and why Creek Harbour is the top pick for 2026 investors.", order: 3 },
    { title: "Golden Visa Through Property Investment", advisor: "Maria Raza", role: "Administration Manager", duration: "5:48", category: "Investor Guide", thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80", description: "Everything you need to know about the AED 2M Golden Visa route and eligible off-plan properties.", order: 4 },
    { title: "Dubai Hills Estate — Family Living ROI", advisor: "Ahmad Ali", role: "Property Consultant", duration: "3:56", category: "Market Insights", thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", description: "Why Dubai Hills townhouses deliver the best family-living ROI in Dubai right now.", order: 5 },
    { title: "Branded Residences — Are They Worth the Premium?", advisor: "Maria Raza", role: "Administration Manager", duration: "7:22", category: "Off-Plan", thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80", description: "Cavalli, Bugatti, Six Senses — we break down whether branded residences justify their 30% premium.", order: 6 },
    { title: "Dubai Marina Rental Yields — 2026 Outlook", advisor: "Awais Ali", role: "Property Consultant", duration: "4:10", category: "Investor Guide", thumbnail: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80", description: "Short-term vs long-term rental yields in Dubai Marina — which strategy wins in 2026?", order: 7 },
  ];
  for (const v of videos) {
    const existing = await db.video.findFirst({ where: { title: v.title } });
    if (!existing) {
      await db.video.create({ data: { ...v, published: true } });
      console.log(`  + Created: ${v.title}`);
    } else {
      console.log(`  = Exists: ${v.title}`);
    }
  }
  console.log(`  ✓ ${videos.length} videos migrated\n`);

  // ─── 12. RERA numbers for properties ────────────────────────────────
  console.log("▸ Adding RERA permit numbers to properties...");
  const reraUpdates = [
    { ref: "RJ-PLM-001", rera: "71845-12345" }, { ref: "RJ-DWN-002", rera: "71932-67890" },
    { ref: "RJ-MAR-003", rera: "72014-34567" }, { ref: "RJ-HIL-004", rera: "72156-89123" },
    { ref: "RJ-CRK-005", rera: "72278-45678" }, { ref: "RJ-PLM-006", rera: "72391-23456" },
    { ref: "RJ-BUS-007", rera: "72453-78901" }, { ref: "RJ-MAR-008", rera: "72567-34567" },
    { ref: "RJ-BUS-009", rera: "72689-12345" }, { ref: "RJ-HIL-010", rera: "72734-56789" },
    { ref: "RJ-DWN-011", rera: "72845-67890" }, { ref: "RJ-PLM-012", rera: "72956-23456" },
  ];
  for (const u of reraUpdates) {
    await db.property.updateMany({ where: { reference: u.ref, reraNumber: null }, data: { reraNumber: u.rera } });
  }
  console.log(`  ✓ RERA numbers added\n`);

  // ─── Final summary ──────────────────────────────────────────────────
  const finalCounts = {
    properties: await db.property.count(),
    agents: await db.agent.count(),
    communities: await db.community.count(),
    developers: await db.developer.count(),
    blogPosts: await db.blogPost.count(),
    testimonials: await db.testimonial.count(),
    awards: await db.award.count(),
    faqs: await db.faq.count(),
    videos: await db.video.count(),
    siteSettings: await db.siteSetting.count(),
    seoMeta: await db.seoMeta.count(),
    users: await db.user.count(),
  };
  console.log("═══════════════════════════════════════════════");
  console.log("✅ MIGRATION COMPLETE — Final DB counts:");
  console.log("═══════════════════════════════════════════════");
  Object.entries(finalCounts).forEach(([k, v]) => console.log(`  ${k.padEnd(20)} ${v}`));
  console.log("═══════════════════════════════════════════════");
}

main()
  .catch((e) => { console.error("❌ Migration failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
