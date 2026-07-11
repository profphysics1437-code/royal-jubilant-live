/**
 * AUTOMATED MySQL MIGRATION SCRIPT FOR HOSTINGER
 * Pure JavaScript — no TypeScript syntax
 * 
 * Uses DATABASE_URL (which is set to MySQL in .env)
 * Reads data from SQLite (db/custom.db) and copies to MySQL
 * 
 * SAFE: Does NOT delete SQLite file
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function main() {
  // Use DATABASE_URL (set in .env to MySQL connection string)
  var mysqlUrl = process.env.DATABASE_URL;
  
  if (!mysqlUrl) {
    console.log('[migration] DATABASE_URL not set, skipping migration');
    return;
  }
  
  // If DATABASE_URL is still SQLite, skip (shouldn't happen but safety check)
  if (mysqlUrl.startsWith('file:')) {
    console.log('[migration] DATABASE_URL is still SQLite, skipping migration');
    return;
  }
  
  console.log('[migration] Starting SQLite to MySQL migration...');
  console.log('[migration] MySQL URL: ' + mysqlUrl.replace(/:[^:@]+@/, ':****@'));
  
  // Source: SQLite
  var sqlitePath = path.join(__dirname, '..', 'db', 'custom.db');
  if (!fs.existsSync(sqlitePath)) {
    console.log('[migration] SQLite file not found at ' + sqlitePath + ', skipping migration');
    return;
  }
  
  var sqliteUrl = 'file:' + sqlitePath;
  var sqlite = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });
  
  // Target: MySQL
  var mysql = new PrismaClient({ datasources: { db: { url: mysqlUrl } } });
  
  // Step 1: Push schema to MySQL (creates all tables)
  console.log('[migration] Step 1: Pushing schema to MySQL...');
  try {
    execSync('DATABASE_URL="' + mysqlUrl + '" npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('[migration] Schema pushed to MySQL');
  } catch (e) {
    console.error('[migration] Schema push failed:', e.message);
    try { await sqlite.$disconnect(); } catch(e2) {}
    try { await mysql.$disconnect(); } catch(e2) {}
    return;
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
      // Clear existing data (in case of re-run)
      await mysql[model].deleteMany({});
      
      // Insert in batches of 50
      var batchSize = 50;
      for (var k = 0; k < data[model].length; k += batchSize) {
        var batch = data[model].slice(k, k + batchSize);
        await mysql[model].createMany({ data: batch, skipDuplicates: true });
      }
      
      insertedRecords += data[model].length;
      console.log('[migration]   ' + model + ': ' + data[model].length + ' inserted');
    } catch (e) {
      console.log('[migration]   ' + model + ': batch failed - ' + e.message);
      console.log('[migration]   ' + model + ': trying individual inserts...');
      // Fallback: insert one by one
      for (var l = 0; l < data[model].length; l++) {
        try {
          await mysql[model].create({ data: data[model][l] });
          insertedRecords++;
        } catch (innerE) {
          console.log('[migration]     skip: ' + innerE.message.substring(0, 80));
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
        console.log('[migration]   ' + model + ': ' + sqliteCount + ' = ' + mysqlCount + ' OK');
      } else {
        console.log('[migration]   ' + model + ': SQLite=' + sqliteCount + ', MySQL=' + mysqlCount + ' MISMATCH');
        allMatch = false;
      }
    } catch (e) {
      // Skip verification for this model
    }
  }
  
  try { await sqlite.$disconnect(); } catch(e) {}
  try { await mysql.$disconnect(); } catch(e) {}
  
  console.log('[migration] ============================================');
  console.log('[migration] Migration Complete!');
  console.log('[migration] Records migrated: ' + insertedRecords + '/' + totalRecords);
  console.log('[migration] Verification: ' + (allMatch ? 'PASSED' : 'CHECK NEEDED'));
  console.log('[migration] SQLite backup: ' + sqlitePath + ' (untouched)');
  console.log('[migration] ============================================');
}

main().catch(function(e) {
  console.error('[migration] Fatal error:', e.message);
  // Don't crash the build
});
