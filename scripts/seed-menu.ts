/**
 * Seed MenuItem table with the full navigation structure
 * matching the current hardcoded Navbar (see src/components/site/Navbar.tsx).
 *
 * Run with:
 *   npx tsx scripts/seed-menu.ts
 *
 * Safe to re-run — checks existing rows by (menu, label, parentId) before creating.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MENU  — mirrors src/components/site/Navbar.tsx navItems array
// ─────────────────────────────────────────────────────────────────────────────

type ChildItem = {
  label: string;
  desc: string;
  view: string;
  url?: string;
  badge?: string;
};

type TopItem = {
  label: string;
  icon: string;
  children?: ChildItem[];
  view?: string;     // for direct-link items with no children
};

const MAIN_MENU: TopItem[] = [
  {
    label: "Rent",
    icon: "Building",
    children: [
      { label: "Residential",          desc: "Annual long-term rentals",            view: "rent" },
      { label: "Rooms for Rent",       desc: "Shared rooms & bed spaces",           view: "rent-rooms" },
      { label: "Holiday Homes",        desc: "Furnished vacation rentals",          view: "rent-holiday" },
      { label: "Monthly Short Term",   desc: "1-3 month stays",                     view: "rent-monthly" },
      { label: "Daily Short Term",     desc: "Daily & weekly stays",                view: "rent-daily" },
    ],
  },
  {
    label: "Buy",
    icon: "Home",
    children: [
      { label: "All Properties for Sale", desc: "Browse 1,200+ active listings",        view: "buy" },
      { label: "Villas & Mansions",       desc: "5+ bedrooms across prime communities", view: "buy" },
      { label: "Penthouses",              desc: "Top-floor branded residences",         view: "buy" },
      { label: "Apartments",              desc: "Studios to 4-bedrooms",                view: "buy" },
      { label: "Townhouses",              desc: "Family-friendly gated communities",    view: "buy" },
      { label: "Luxury Collection",       desc: "Curated trophy assets AED 15M+",       view: "luxury", badge: "Premium" },
    ],
  },
  {
    label: "Commercial",
    icon: "Briefcase",
    children: [
      { label: "Commercial Property for Rent", desc: "Offices, retail & warehouses for lease", view: "commercial-rent" },
      { label: "Commercial Property for Sale", desc: "Buy offices, buildings & industrial units", view: "commercial-sale" },
    ],
  },
  {
    label: "Off Plan",
    icon: "HardHat",
    children: [
      { label: "About Off Plan",     desc: "Market insights & investment guide",  view: "about-offplan" },
      { label: "Off Plan Properties", desc: "Browse all off-plan projects",        view: "off-plan" },
      { label: "Developers",         desc: "Dubai's leading master developers",   view: "developers" },
    ],
  },
  {
    label: "About Us",
    icon: "Users",
    children: [
      { label: "Our Story",      desc: "Our story, leadership & ethos",       view: "about" },
      { label: "Why Choose Us",  desc: "What sets Royal Jubilant apart",      view: "about" },
      { label: "Our Team",       desc: "Meet our RERA-certified advisors",    view: "agents" },
      { label: "Our Advice",     desc: "Advisor video insights & market updates", view: "advice" },
      { label: "Client Reviews", desc: "What our clients say about us",       view: "testimonials" },
      { label: "Careers",        desc: "Join our advisory team",              view: "careers" },
      { label: "Contact Us",     desc: "Get in touch with our team",          view: "contact" },
    ],
  },
  {
    label: "More",
    icon: "ChevronDown",
    children: [
      { label: "Communities",            desc: "Browse Dubai neighbourhoods",   view: "communities" },
      { label: "Rental Yield Calculator", desc: "Calculate your rental ROI",    view: "calc-yield" },
      { label: "Buy vs Rent Calculator", desc: "Should you buy or rent?",       view: "calc-buyrent" },
      { label: "Market Insights",        desc: "Quarterly indices & research notes", view: "blog" },
      { label: "FAQs",                   desc: "Common questions answered",     view: "faqs" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER MENU  — quick links shown in the footer (see Footer.tsx)
// ─────────────────────────────────────────────────────────────────────────────

const FOOTER_MENU: ChildItem[] = [
  { label: "About Us",     desc: "", view: "about" },
  { label: "Our Story",    desc: "", view: "about" },
  { label: "Our Advice",   desc: "", view: "advice" },
  { label: "Client Reviews", desc: "", view: "testimonials" },
  { label: "FAQs",         desc: "", view: "faqs" },
  { label: "Rent",         desc: "", view: "rent" },
  { label: "Buy",          desc: "", view: "buy" },
  { label: "Off Plan",     desc: "", view: "off-plan" },
  { label: "Commercial",   desc: "", view: "commercial-rent" },
  { label: "Contact",      desc: "", view: "contact" },
];

// ─────────────────────────────────────────────────────────────────────────────

async function seedMainMenu() {
  console.log(`\n🌱 Seeding MAIN menu...`);
  let topCount = 0;
  let childCount = 0;

  for (let i = 0; i < MAIN_MENU.length; i++) {
    const top = MAIN_MENU[i];

    // Find or create top-level item
    let parent = await db.menuItem.findFirst({
      where: { menu: "main", label: top.label, parentId: null },
    });
    if (!parent) {
      parent = await db.menuItem.create({
        data: {
          label: top.label,
          url: "",
          view: top.view || null,
          icon: top.icon,
          menu: "main",
          order: i,
          visible: true,
        },
      });
      topCount++;
    } else {
      // Update icon/order if changed
      parent = await db.menuItem.update({
        where: { id: parent.id },
        data: { icon: top.icon, order: i, view: top.view || null },
      });
    }

    // Create children if any
    if (top.children) {
      // Delete existing children that are no longer in the seed (to keep DB in sync)
      const existingChildren = await db.menuItem.findMany({
        where: { parentId: parent.id },
      });
      const seedLabels = top.children.map((c) => c.label);
      for (const ec of existingChildren) {
        if (!seedLabels.includes(ec.label)) {
          await db.menuItem.delete({ where: { id: ec.id } });
        }
      }

      for (let j = 0; j < top.children.length; j++) {
        const ch = top.children[j];
        const existing = await db.menuItem.findFirst({
          where: { parentId: parent.id, label: ch.label },
        });
        if (existing) {
          await db.menuItem.update({
            where: { id: existing.id },
            data: {
              view: ch.view,
              desc: ch.desc,
              badge: ch.badge || null,
              url: ch.url || "",
              order: j,
            },
          });
        } else {
          await db.menuItem.create({
            data: {
              label: ch.label,
              url: ch.url || "",
              view: ch.view,
              desc: ch.desc,
              badge: ch.badge || null,
              parentId: parent.id,
              order: j,
              menu: "main",
              visible: true,
            },
          });
          childCount++;
        }
      }
    }
  }

  const total = await db.menuItem.count({ where: { menu: "main" } });
  console.log(`   ✓ ${topCount} new top-level + ${childCount} new child items added (total main: ${total})`);
}

async function seedFooterMenu() {
  console.log(`\n🌱 Seeding FOOTER menu...`);
  let count = 0;

  // Clear existing footer items
  await db.menuItem.deleteMany({ where: { menu: "footer" } });

  for (let i = 0; i < FOOTER_MENU.length; i++) {
    const item = FOOTER_MENU[i];
    await db.menuItem.create({
      data: {
        label: item.label,
        url: "",
        view: item.view,
        desc: null,
        menu: "footer",
        order: i,
        visible: true,
      },
    });
    count++;
  }
  console.log(`   ✓ ${count} footer items added`);
}

async function main() {
  await seedMainMenu();
  await seedFooterMenu();

  const total = await db.menuItem.count();
  const mainCount = await db.menuItem.count({ where: { menu: "main" } });
  const footerCount = await db.menuItem.count({ where: { menu: "footer" } });
  const topLevel = await db.menuItem.count({ where: { menu: "main", parentId: null } });
  const childItems = await db.menuItem.count({ where: { menu: "main", NOT: { parentId: null } } });

  console.log(`\n📊 Summary:`);
  console.log(`   Total menu items : ${total}`);
  console.log(`   Main menu        : ${mainCount} (${topLevel} top-level + ${childItems} children)`);
  console.log(`   Footer menu      : ${footerCount}`);
  console.log(`\n✅ Done.\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
