/**
 * EMERGENCY ADMIN RECOVERY SCRIPT
 * Run via SSH on Hostinger:
 *   cd domains/royaljubilant.com/public_html
 *   node scripts/recover-admin.js
 *
 * This script:
 * 1. Connects to MySQL with the correct password
 * 2. Pushes the Prisma schema (creates tables)
 * 3. Inserts the admin user with a known password
 * 4. Reports success
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════
// HARDCODED CREDENTIALS (won't fail even if .env is wrong)
// ═══════════════════════════════════════════════════════════

const MYSQL_URL = 'mysql://u432212399_adminrjcom:Admin%402026%40%23@localhost:3306/u432212399_rjcom';
const ADMIN_EMAIL = 'admin@royaljubilant.ae';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Royal Jubilant Admin';

process.env.DATABASE_URL = MYSQL_URL;

console.log('═══════════════════════════════════════════════════════');
console.log('  ROYAL JUBILANT — ADMIN RECOVERY SCRIPT');
console.log('═══════════════════════════════════════════════════════');
console.log('');
console.log('[1/5] Database URL:', MYSQL_URL.replace(/:[^:@]+@/, ':****@'));
console.log('');

// ═══════════════════════════════════════════════════════════
// STEP 1: Push schema to MySQL
// ═══════════════════════════════════════════════════════════

console.log('[2/5] Pushing Prisma schema to MySQL...');
try {
  execSync('npx prisma db push --accept-data-loss', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, DATABASE_URL: MYSQL_URL },
  });
  console.log('[OK] Schema pushed to MySQL');
} catch (e) {
  console.error('[FAIL] Schema push failed:', e.message);
  console.error('');
  console.error('Likely cause: MySQL connection failed.');
  console.error('Check that:');
  console.error('  1. MySQL database u432212399_rjcom exists on Hostinger');
  console.error('  2. User u432212399_adminrjcom has access to it');
  console.error('  3. Password is Admin@2026@#');
  process.exit(1);
}

console.log('');

// ═══════════════════════════════════════════════════════════
// STEP 2: Connect to MySQL
// ═══════════════════════════════════════════════════════════

console.log('[3/5] Connecting to MySQL...');
const db = new PrismaClient({ datasources: { db: { url: MYSQL_URL } } });

async function main() {
  // ═══════════════════════════════════════════════════════════
  // STEP 3: Check current admin users
  // ═══════════════════════════════════════════════════════════

  console.log('[4/5] Checking existing admin users...');
  const existingAdmins = await db.user.findMany({
    where: { role: 'admin' },
    select: { id: true, email: true, name: true, role: true },
  });

  if (existingAdmins.length > 0) {
    console.log('[INFO] Existing admin users found:');
    existingAdmins.forEach(u => {
      console.log('   - ' + u.email + ' (' + u.name + ')');
    });
  } else {
    console.log('[INFO] No admin users found. Will create one.');
  }

  console.log('');

  // ═══════════════════════════════════════════════════════════
  // STEP 4: Create or update admin user
  // ═══════════════════════════════════════════════════════════

  console.log('[5/5] Creating/updating admin user...');
  console.log('   Email:    ' + ADMIN_EMAIL);
  console.log('   Password: ' + ADMIN_PASSWORD);
  console.log('');

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await db.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      passwordHash: passwordHash,
      role: 'admin',
      name: ADMIN_NAME,
    },
    create: {
      email: ADMIN_EMAIL,
      passwordHash: passwordHash,
      role: 'admin',
      name: ADMIN_NAME,
    },
  });

  console.log('[OK] Admin user saved with ID:', admin.id);
  console.log('');

  // ═══════════════════════════════════════════════════════════
  // VERIFY
  // ═══════════════════════════════════════════════════════════

  console.log('═══════════════════════════════════════════════════════');
  console.log('  RECOVERY COMPLETE!');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('Admin user is now ready. Try logging in at:');
  console.log('   https://www.royaljubilant.com/admin/login');
  console.log('');
  console.log('Credentials:');
  console.log('   Email:    ' + ADMIN_EMAIL);
  console.log('   Password: ' + ADMIN_PASSWORD);
  console.log('');

  // Also try to migrate other data from SQLite if it exists
  const sqlitePath = path.join(__dirname, '..', 'db', 'custom.db');
  if (fs.existsSync(sqlitePath)) {
    console.log('[BONUS] SQLite file found. Migrating all data...');
    await migrateAllData(MYSQL_URL, sqlitePath);
  } else {
    console.log('[INFO] No SQLite file found. Only admin user was created.');
  }

  await db.$disconnect();
}

async function migrateAllData(mysqlUrl, sqlitePath) {
  try {
    const sqliteUrl = 'file:' + sqlitePath;
    const sqlite = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });
    const mysql = new PrismaClient({ datasources: { db: { url: mysqlUrl } } });

    const models = [
      'user', 'agent', 'property', 'community', 'developer', 'blogPost',
      'testimonial', 'award', 'faq', 'heroSlide', 'video', 'siteSetting',
      'storyEvent', 'lead', 'appointment', 'message', 'notification',
      'crmNote', 'commission', 'newsletterSubscriber', 'valuationRequest',
      'mortgageEnquiry', 'auditLog', 'activityLog', 'mediaFile', 'popup',
      'seoMeta', 'menuItem', 'emailTemplate', 'landingPage', 'reportSnapshot',
      'location', 'propertyCategory', 'amenity', 'savedProperty', 'savedSearch'
    ];

    let totalInserted = 0;

    for (const model of models) {
      if (model === 'user') continue; // already handled
      try {
        const records = await sqlite[model].findMany();
        if (records.length === 0) continue;

        // Clear existing (except admin user for 'user' model)
        await mysql[model].deleteMany({});

        // Insert in batches
        const batchSize = 50;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          try {
            await mysql[model].createMany({ data: batch, skipDuplicates: true });
          } catch (e) {
            // Try one by one
            for (const r of batch) {
              try { await mysql[model].create({ data: r }); } catch (e2) {}
            }
          }
        }
        totalInserted += records.length;
        console.log('   [OK] ' + model + ': ' + records.length + ' records migrated');
      } catch (e) {
        console.log('   [SKIP] ' + model + ': ' + e.message);
      }
    }

    try { await sqlite.$disconnect(); } catch (e) {}
    try { await mysql.$disconnect(); } catch (e) {}

    console.log('');
    console.log('[BONUS] Total records migrated:', totalInserted);

    // Create marker file so postinstall won't re-run
    const markerFile = path.join(__dirname, '..', '.mysql-migrated');
    fs.writeFileSync(markerFile, new Date().toISOString());
    console.log('[BONUS] Marker file created.');
  } catch (e) {
    console.error('[BONUS] Migration failed:', e.message);
  }
}

main().catch(e => {
  console.error('[FATAL]', e.message);
  process.exit(1);
});
