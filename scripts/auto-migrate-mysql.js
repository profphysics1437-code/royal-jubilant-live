/**
 * AUTOMATED MySQL MIGRATION SCRIPT FOR HOSTINGER
 * Pure JavaScript — no TypeScript syntax
 * 
 * Loads .env explicitly, then migrates data from SQLite to MySQL
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// ═══════════════════════════════════════════════════════════
// LOAD .env FILE MANUALLY (Node.js doesn't load it automatically)
// ═══════════════════════════════════════════════════════════

function loadEnvFile() {
  var envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('[migration] .env file not found at ' + envPath);
    return false;
  }
  
  var envContent = fs.readFileSync(envPath, 'utf8');
  var lines = envContent.split('\n');
  
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;
    
    var eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;
    
    var key = line.substring(0, eqIndex).trim();
    var value = line.substring(eqIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }
    
    // Only set if not already set by environment
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
  
  console.log('[migration] .env loaded from ' + envPath);
  return true;
}

// Load .env file
loadEnvFile();

// ═══════════════════════════════════════════════════════════
// HARDCODE FALLBACK — if .env doesn't have it, use this
// ═══════════════════════════════════════════════════════════

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://u432212399_adminrjcom:Royal%402026%40%23@localhost:3306/u432212399_rjcom';
  console.log('[migration] DATABASE_URL was not set, using hardcoded fallback');
}

// ═══════════════════════════════════════════════════════════
// MIGRATION LOGIC
// ═══════════════════════════════════════════════════════════

async function main() {
  var mysqlUrl = process.env.DATABASE_URL;
  
  console.log('[migration] DATABASE_URL: ' + mysqlUrl.replace(/:[^:@]+@/, ':****@'));
  
  // If DATABASE_URL is SQLite, skip
  if (mysqlUrl.startsWith('file:')) {
    console.log('[migration] DATABASE_URL is SQLite, skipping migration');
    return;
  }
  
  // Check if already migrated
  var markerFile = path.join(__dirname, '..', '.mysql-migrated');
  if (fs.existsSync(markerFile)) {
    console.log('[migration] Already migrated (marker file exists), skipping');
    return;
  }
  
  console.log('[migration] Starting SQLite to MySQL migration...');
  
  // Source: SQLite
  var sqlitePath = path.join(__dirname, '..', 'db', 'custom.db');
  if (!fs.existsSync(sqlitePath)) {
    console.log('[migration] SQLite file not found at ' + sqlitePath);
    return;
  }
  
  var sqliteUrl = 'file:' + sqlitePath;
  console.log('[migration] SQLite path: ' + sqlitePath);
  
  var sqlite = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });
  var mysql = new PrismaClient({ datasources: { db: { url: mysqlUrl } } });
  
  // Step 1: Push schema to MySQL
  console.log('[migration] Step 1: Pushing schema to MySQL...');
  try {
    execSync('DATABASE_URL="' + mysqlUrl + '" npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
    });
    console.log('[migration] Schema pushed to MySQL');
  } catch (e) {
    console.error('[migration] Schema push FAILED:', e.message);
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
        console.log('[migration]   ' + model + ': ' + records.length + ' records read');
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
      await mysql[model].deleteMany({});
      
      var batchSize = 50;
      for (var k = 0; k < data[model].length; k += batchSize) {
        var batch = data[model].slice(k, k + batchSize);
        await mysql[model].createMany({ data: batch, skipDuplicates: true });
      }
      
      insertedRecords += data[model].length;
      console.log('[migration]   ' + model + ': ' + data[model].length + ' inserted');
    } catch (e) {
      console.log('[migration]   ' + model + ': batch failed - ' + e.message);
      for (var l = 0; l < data[model].length; l++) {
        try {
          await mysql[model].create({ data: data[model][l] });
          insertedRecords++;
        } catch (innerE) {
          // skip
        }
      }
    }
  }
  
  // Step 4: Verify
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
    } catch (e) {}
  }
  
  try { await sqlite.$disconnect(); } catch(e) {}
  try { await mysql.$disconnect(); } catch(e) {}
  
  // Create marker file
  if (allMatch && insertedRecords > 0) {
    fs.writeFileSync(markerFile, new Date().toISOString());
  }
  
  console.log('[migration] ============================================');
  console.log('[migration] Migration Complete!');
  console.log('[migration] Records migrated: ' + insertedRecords + '/' + totalRecords);
  console.log('[migration] Verification: ' + (allMatch ? 'PASSED' : 'CHECK NEEDED'));
  console.log('[migration] ============================================');
}

main().catch(function(e) {
  console.error('[migration] Fatal error:', e.message);
});
