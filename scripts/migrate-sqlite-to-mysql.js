/**
 * SQLite to MySQL Migration Script
 * Usage: MYSQL_URL="mysql://user:pass@host:3306/dbname" node scripts/migrate-sqlite-to-mysql.js
 * SAFE: Does NOT modify or delete SQLite data
 */
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('\n=== SQLite → MySQL Migration ===\n');
  const sqliteUrl = `file:${path.join(__dirname, '..', 'db', 'custom.db')}`;
  const sqlite = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });
  const mysqlUrl = process.env.MYSQL_URL;
  if (!mysqlUrl) { console.log('❌ MYSQL_URL not set!'); process.exit(1); }
  const mysql = new PrismaClient({ datasources: { db: { url: mysqlUrl } } });

  // Push schema
  console.log('Pushing schema to MySQL...');
  const { execSync } = require('child_process');
  execSync(`DATABASE_URL="${mysqlUrl}" npx prisma db push --accept-data-loss`, { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  const models = ['user','agent','property','community','developer','blogPost','testimonial','award','faq','heroSlide','video','siteSetting','storyEvent','lead','appointment','message','notification','crmNote','commission','newsletterSubscriber','valuationRequest','mortgageEnquiry','auditLog','activityLog','mediaFile','popup','seoMeta','menuItem','emailTemplate','landingPage','reportSnapshot','location','propertyCategory','amenity','savedProperty','savedSearch'];
  
  let total = 0;
  for (const m of models) {
    try {
      const records = await (sqlite as any)[m].findMany();
      if (records.length === 0) continue;
      await (mysql as any)[m].deleteMany({});
      for (let i = 0; i < records.length; i += 50) {
        await (mysql as any)[m].createMany({ data: records.slice(i, i + 50), skipDuplicates: true });
      }
      total += records.length;
      console.log(`  ✅ ${m}: ${records.length} records`);
    } catch (e) { console.log(`  ⚠️ ${m}: ${e.message}`); }
  }
  await sqlite.$disconnect(); await mysql.$disconnect();
  console.log(`\n=== Migration Complete: ${total} records ===\n`);
}
main().catch(e => { console.error(e); process.exit(1); });
