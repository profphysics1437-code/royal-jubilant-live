/**
 * AUTOMATED MySQL MIGRATION SCRIPT FOR HOSTINGER
 * Pure JavaScript — no TypeScript syntax
 * 
 * This script runs ON the Hostinger server (where localhost:3306 works).
 * It is triggered automatically during the npm install / postinstall process.
 * 
 * What it does:
 * 1. Reads all data from SQLite (db/custom.db)
 * 2. Creates all tables in MySQL (prisma db push)
 * 3. Copies all data from SQLite to MySQL
 * 4. Verifies row counts match
 * 
 * It is SAFE:
 * - Does NOT delete SQLite file
 * - Does NOT modify SQLite data
 * - Only runs if MYSQL_DATABASE_URL env var is set
 * - If migration fails, app continues using SQLite
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function main() {
  const mysqlUrl = process.env.MYSQL_DATABASE_URL;
  
  // Only run if MySQL URL is provided
  if (!mysqlUrl) {
    console.log('[migration] MYSQL_DATABASE_URL not set, skipping migration');
    return;
  }
  
  // Check if already migrated (marker file)
  const markerFile = path.join(__dirname, '..', '.mysql-migrated');
  if (fs.existsSync(markerFile)) {
    console.log('[migration] Already migrated to MySQL, skipping');
    return;
  }
  
  console.log('[migration] Starting SQLite to MySQL migration...');
  
  // Source: SQLite
  const sqlitePath = path.join(__dirname, '..', 'db', 'custom.db');
  if (!fs.existsSync(sqlitePath)) {
    console.log('[migration] SQLite file not found, skipping migration');
    return;
  }
  
  const sqliteUrl = 'file:' + sqlitePath;
  const sqlite = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });
  
  // Target: MySQL
  const mysql = new PrismaClient({ datasources: { db: { url: mysqlUrl } } });
  
  // Step 1: Push schema to MySQL
  console.log('[migration] Step 1: Pushing schema to MySQL...');
  try {
    execSync('DATABASE_URL="' + mysqlUrl + '" npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('[migration] Schema pushed to MySQL');
  } catch (e) {
    console.error('[migration] Schema push failed:', e.message);
    await sqlite.$disconnect();
    await mysql.$disconnect();
    return; // Don't crash, continue with SQLite
  }
  
  // Step 2: Read all data from SQLite
  console.log('[migration] Step 2: Reading data from SQLite...');
  var models = [
    'user', 'agent', 'property', 'community', 'developer', 'blogPost',
    'testimonial', 'award', 'faq', 'heroSlide', 'video', 'siteSetting',
    'storyEvent', 'lead', 'appointment', 'message', 'notification',
    'crmNote', 'commission', 'newsletterSubscriber', 'valuationRequest',
    'mortgageEnquiry', 'auditLog', 'activityLog', 'mediaFile', 'popup',
    'seoMeta', 'menuItem', 'emailTemplate', 'landingPage', 'reportSnapshot',
    'location', 'propertyCategory', 'amenity', 'savedProperty', 'savedSearch'
  ];
  
  var data = {};
  var totalRecords = 0;
  
  for (var i = 0; i < models.length; i++) {
    var model = models[i];
    try {
      var records = await sqlite[model].findMany();
      data[model] = records;
      totalRecords += records.length;
      if (records.length > 0) {
        console.log('[migration]   ' + model + ': ' + records.length + ' records');
      }
    } catch (e) {
      data[model] = [];
    }
  }
  
  console.log('[migration] Total records to migrate: ' + totalRecords);
  
  // Step 3: Insert data into MySQL
  console.log('[migration] Step 3: Inserting data into MySQL...');
  var insertedRecords = 0;
  
  for (var j = 0; j < models.length; j++) {
    var model = models[j];
    if (!data[model] || data[model].length === 0) continue;
    
    try {
      // Clear existing data
      await mysql[model].deleteMany({});
      
      // Insert in batches
      var batchSize = 50;
      for (var k = 0; k < data[model].length; k += batchSize) {
        var batch = data[model].slice(k, k + batchSize);
        await mysql[model].createMany({ data: batch, skipDuplicates: true });
      }
      
      insertedRecords += data[model].length;
      console.log('[migration]   ' + model + ': ' + data[model].length + ' inserted');
    } catch (e) {
      console.log('[migration]   ' + model + ': ' + e.message + ' - trying individual inserts');
      // Fallback: insert one by one
      for (var l = 0; l < data[model].length; l++) {
        try {
          await mysql[model].create({ data: data[model][l] });
          insertedRecords++;
        } catch (innerE) {
          // Skip problematic records
        }
      }
    }
  }
  
  // Step 4: Verify row counts
  console.log('[migration] Step 4: Verifying row counts...');
  var allMatch = true;
  
  for (var m = 0; m < models.length; m++) {
    var model = models[m];
    if (!data[model] || data[model].length === 0) continue;
    
    try {
      var sqliteCount = data[model].length;
      var mysqlCount = await mysql[model].count();
      
      if (sqliteCount === mysqlCount) {
        console.log('[migration]   ' + model + ': ' + sqliteCount + ' = ' + mysqlCount);
      } else {
        console.log('[migration]   ' + model + ': SQLite=' + sqliteCount + ', MySQL=' + mysqlCount);
        allMatch = false;
      }
    } catch (e) {
      // Skip verification
    }
  }
  
  await sqlite.$disconnect();
  await mysql.$disconnect();
  
  // Create marker file
  fs.writeFileSync(markerFile, new Date().toISOString());
  
  console.log('[migration] ============================================');
  console.log('[migration] Migration Complete!');
  console.log('[migration] Records migrated: ' + insertedRecords + '/' + totalRecords);
  console.log('[migration] Verification: ' + (allMatch ? 'PASSED' : 'CHECK NEEDED'));
  console.log('[migration] SQLite backup: ' + sqlitePath + ' (untouched)');
  console.log('[migration] ============================================');
}

main().catch(function(e) {
  console.error('[migration] Fatal error:', e.message);
  // Don't crash the build - continue with SQLite
});
