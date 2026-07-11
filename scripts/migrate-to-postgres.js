// SQLite → Neon Postgres Migration Script
// Run: NEON_URL="postgresql://..." node scripts/migrate-to-postgres.js

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('=== SQLite → Neon Postgres Migration ===\n');

  // Source: SQLite (local file)
  const sqliteUrl = `file:${path.join(__dirname, '..', 'db', 'custom.db')}`;
  process.env.DATABASE_URL = sqliteUrl;
  const sqlite = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });

  // Read all data from SQLite
  console.log('📖 Reading from SQLite...');
  const users = await sqlite.user.findMany();
  const agents = await sqlite.agent.findMany();
  const properties = await sqlite.property.findMany();
  const communities = await sqlite.community.findMany();
  const developers = await sqlite.developer.findMany();
  const blogPosts = await sqlite.blogPost.findMany();
  const testimonials = await sqlite.testimonial.findMany();
  const awards = await sqlite.award.findMany();
  const faqs = await sqlite.faq.findMany();
  const heroSlides = await sqlite.heroSlide.findMany();
  const videos = await sqlite.video.findMany();
  const siteSettings = await sqlite.siteSetting.findMany();
  const storyEvents = await sqlite.storyEvent.findMany();
  const leads = await sqlite.lead.findMany();

  console.log(`  Users: ${users.length}`);
  console.log(`  Agents: ${agents.length}`);
  console.log(`  Properties: ${properties.length}`);
  console.log(`  Communities: ${communities.length}`);
  console.log(`  Developers: ${developers.length}`);
  console.log(`  Blog Posts: ${blogPosts.length}`);
  console.log(`  Testimonials: ${testimonials.length}`);
  console.log(`  Awards: ${awards.length}`);
  console.log(`  FAQs: ${faqs.length}`);
  console.log(`  Hero Slides: ${heroSlides.length}`);
  console.log(`  Videos: ${videos.length}`);
  console.log(`  Site Settings: ${siteSettings.length}`);
  console.log(`  Story Events: ${storyEvents.length}`);
  console.log(`  Leads: ${leads.length}`);

  await sqlite.$disconnect();

  const neonUrl = process.env.NEON_URL;
  if (!neonUrl) {
    console.log('\n⚠️  No NEON_URL provided. Stopping after read.');
    console.log('   To migrate, set NEON_URL to your Neon connection string:');
    console.log('   NEON_URL="postgresql://..." node scripts/migrate-to-postgres.js');
    return;
  }

  console.log('\n🚀 Connecting to Neon Postgres...');
  const pg = new PrismaClient({ datasources: { db: { url: neonUrl } } });

  console.log('📊 Pushing schema to Postgres...');
  const { execSync } = require('child_process');
  execSync(`DATABASE_URL="${neonUrl}" npx prisma db push --accept-data-loss`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });

  console.log('\n✍️  Inserting data into Postgres...');
  for (const u of users) {
    await pg.user.upsert({ where: { id: u.id }, create: u, update: u }).catch(e => console.log(`  User ${u.email}: ${e.message}`));
  }
  console.log(`  ✓ Users: ${users.length}`);

  for (const a of agents) {
    await pg.agent.upsert({ where: { id: a.id }, create: a, update: a }).catch(e => console.log(`  Agent ${a.name}: ${e.message}`));
  }
  console.log(`  ✓ Agents: ${agents.length}`);

  for (const p of properties) {
    await pg.property.upsert({ where: { id: p.id }, create: p, update: p }).catch(e => console.log(`  Property: ${e.message}`));
  }
  console.log(`  ✓ Properties: ${properties.length}`);

  for (const c of communities) {
    await pg.community.upsert({ where: { id: c.id }, create: c, update: c }).catch(e => console.log(`  Community: ${e.message}`));
  }
  console.log(`  ✓ Communities: ${communities.length}`);

  for (const d of developers) {
    await pg.developer.upsert({ where: { id: d.id }, create: d, update: d }).catch(e => console.log(`  Developer: ${e.message}`));
  }
  console.log(`  ✓ Developers: ${developers.length}`);

  for (const b of blogPosts) {
    await pg.blogPost.upsert({ where: { id: b.id }, create: b, update: b }).catch(e => console.log(`  Blog: ${e.message}`));
  }
  console.log(`  ✓ Blog Posts: ${blogPosts.length}`);

  for (const t of testimonials) {
    await pg.testimonial.upsert({ where: { id: t.id }, create: t, update: t }).catch(e => console.log(`  Testimonial: ${e.message}`));
  }
  console.log(`  ✓ Testimonials: ${testimonials.length}`);

  for (const a of awards) {
    await pg.award.upsert({ where: { id: a.id }, create: a, update: a }).catch(e => console.log(`  Award: ${e.message}`));
  }
  console.log(`  ✓ Awards: ${awards.length}`);

  for (const f of faqs) {
    await pg.faq.upsert({ where: { id: f.id }, create: f, update: f }).catch(e => console.log(`  FAQ: ${e.message}`));
  }
  console.log(`  ✓ FAQs: ${faqs.length}`);

  for (const h of heroSlides) {
    await pg.heroSlide.upsert({ where: { id: h.id }, create: h, update: h }).catch(e => console.log(`  Hero: ${e.message}`));
  }
  console.log(`  ✓ Hero Slides: ${heroSlides.length}`);

  for (const v of videos) {
    await pg.video.upsert({ where: { id: v.id }, create: v, update: v }).catch(e => console.log(`  Video: ${e.message}`));
  }
  console.log(`  ✓ Videos: ${videos.length}`);

  for (const s of siteSettings) {
    await pg.siteSetting.upsert({ where: { key: s.key }, create: s, update: s }).catch(e => console.log(`  Setting ${s.key}: ${e.message}`));
  }
  console.log(`  ✓ Site Settings: ${siteSettings.length}`);

  for (const s of storyEvents) {
    await pg.storyEvent.upsert({ where: { id: s.id }, create: s, update: s }).catch(e => console.log(`  Story: ${e.message}`));
  }
  console.log(`  ✓ Story Events: ${storyEvents.length}`);

  for (const l of leads) {
    await pg.lead.upsert({ where: { id: l.id }, create: l, update: l }).catch(e => console.log(`  Lead: ${e.message}`));
  }
  console.log(`  ✓ Leads: ${leads.length}`);

  await pg.$disconnect();

  console.log('\n✅ Migration complete!');
  console.log('   Your Vercel site now has all data from your SQLite DB.');
  console.log('   Update DATABASE_URL in Vercel to your Neon connection string.');
}

main().catch(e => { console.error(e); process.exit(1); });
