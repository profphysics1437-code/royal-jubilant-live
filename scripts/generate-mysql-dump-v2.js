/**
 * MySQL Dump Generator v2 — uses ACTUAL SQLite schema
 * Reads each table's actual columns from SQLite and generates matching MySQL schema
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const sqliteUrl = 'file:' + path.join(__dirname, '..', 'db', 'custom.db');
const db = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });

// Convert SQLite CREATE TABLE to MySQL CREATE TABLE
function sqliteToMySQL(sqliteSchema, tableName) {
  // Extract column definitions
  let inner = sqliteSchema.replace(/CREATE TABLE ".*?" \(/, '').replace(/\)$/, '');
  let lines = inner.split(',\n').map(l => l.trim()).filter(Boolean);
  
  // First pass: identify which columns are PRIMARY KEY or UNIQUE
  let pkColumns = new Set();
  let uniqueColumns = new Set();
  for (let line of lines) {
    if (line.includes('PRIMARY KEY')) {
      const m = line.match(/^"([^"]+)"/);
      if (m) pkColumns.add(m[1]);
    }
    if (line.includes('UNIQUE')) {
      const m = line.match(/^"([^"]+)"/);
      if (m) uniqueColumns.add(m[1]);
    }
  }
  
  let mysqlLines = [];
  for (let line of lines) {
    // Skip standalone constraint lines (FOREIGN KEY, etc.)
    if (line.startsWith('CONSTRAINT') || line.startsWith('FOREIGN KEY') || line.startsWith('PRIMARY KEY (') || line.startsWith('UNIQUE (')) {
      continue;
    }
    
    // Replace double quotes with backticks
    line = line.replace(/"/g, '`');
    
    // Get column name
    const colMatch = line.match(/^`(\w+)`/);
    const colName = colMatch ? colMatch[1] : null;
    
    // Convert TEXT to appropriate type
    // - PRIMARY KEY or UNIQUE → VARCHAR(255)
    // - Regular TEXT → LONGTEXT (for long content) or TEXT
    if (pkColumns.has(colName) || uniqueColumns.has(colName)) {
      line = line.replace(/\bTEXT\b/g, 'VARCHAR(255)');
    } else {
      // Long content fields → LONGTEXT
      const longFields = ['description', 'biography', 'body', 'quote', 'answer', 'overview', 
                         'lifestyle', 'images', 'amenities', 'features', 'paymentPlan', 
                         'notes', 'message', 'content', 'metadata', 'highlights', 'schools',
                         'hospitals', 'transport', 'shopping', 'nearbyCommunities', 'stats',
                         'indoorFeatures', 'outdoorFeatures', 'buildingAmenities', 
                         'nearbyLandmarks', 'viewFeatures', 'tags', 'specializations', 
                         'communities', 'awards', 'topProjects', 'seoDescription', 'metaDescription',
                         'passwordHash', 'coverImage', 'videoUrl', 'virtualTourUrl', 'floorPlanUrl',
                         'buttonLink', 'imageUrl', 'website', 'photo', 'avatar', 'logo',
                         'thumbnail', 'locationAddress', 'ogImage', 'youtubeUrl'];
      if (longFields.includes(colName)) {
        line = line.replace(/\bTEXT\b/g, 'LONGTEXT');
      } else {
        line = line.replace(/\bTEXT\b/g, 'TEXT');
      }
    }
    
    // Convert types
    line = line.replace(/\bINTEGER\b/g, 'INT');
    line = line.replace(/\bBOOLEAN\b/g, 'TINYINT(1)');
    line = line.replace(/\bDATETIME\b/g, 'DATETIME(3)');
    line = line.replace(/\bREAL\b/g, 'DECIMAL(20,4)');
    line = line.replace(/\bNUMERIC\b/g, 'DECIMAL(20,4)');
    
    // Convert DEFAULT true/false to 1/0
    line = line.replace(/DEFAULT\s+true/gi, 'DEFAULT 1');
    line = line.replace(/DEFAULT\s+false/gi, 'DEFAULT 0');
    
    // Convert CURRENT_TIMESTAMP to CURRENT_TIMESTAMP(3)
    line = line.replace(/CURRENT_TIMESTAMP(?!\()/g, 'CURRENT_TIMESTAMP(3)');
    
    // Remove "PRIMARY KEY" inline — we'll add it separately for VARCHAR
    // Actually keep it inline, MySQL handles VARCHAR PRIMARY KEY fine
    
    mysqlLines.push('  ' + line);
  }
  
  return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n${mysqlLines.join(',\n')}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;
}

function escapeValue(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (v instanceof Date) {
    return "'" + v.toISOString().slice(0, 19).replace('T', ' ') + "'";
  }
  if (typeof v === 'object') {
    const json = JSON.stringify(v);
    return "'" + json.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  const s = String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return "'" + s + "'";
}

async function main() {
  console.log('[1/4] Getting all table names from SQLite...');
  
  const tables = await db.$queryRawUnsafe(
    `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%' ORDER BY name`
  );
  
  console.log(`[OK] Found ${tables.length} tables`);
  
  let sql = `-- MySQL dump generated from SQLite (v2 - using actual schema)
-- Royal Jubilant Real Estate LLC
-- Generated: ${new Date().toISOString()}
-- 
-- Import instructions:
-- 1. Open phpMyAdmin on Hostinger
-- 2. Select database: u432212399_rjcom
-- 3. Click "Import" tab
-- 4. Upload this file
-- 5. Click "Go" to execute

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

`;

  console.log('[2/4] Generating CREATE TABLE statements...');
  let totalRecords = 0;
  
  for (const t of tables) {
    const tableName = t.name;
    
    // Get schema
    const schemaRows = await db.$queryRawUnsafe(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`
    );
    
    if (!schemaRows[0] || !schemaRows[0].sql) {
      console.log(`  SKIP ${tableName}: no schema`);
      continue;
    }
    
    const mysqlSchema = sqliteToMySQL(schemaRows[0].sql, tableName);
    
    sql += `\n-- Table: ${tableName}\n`;
    sql += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
    sql += mysqlSchema + '\n\n';
    
    console.log(`  + ${tableName}: schema created`);
  }
  
  console.log('[3/4] Generating INSERT statements...');
  
  for (const t of tables) {
    const tableName = t.name;
    
    try {
      // Get all records
      const records = await db.$queryRawUnsafe(`SELECT * FROM "${tableName}"`);
      if (records.length === 0) continue;
      
      console.log(`  + ${tableName}: ${records.length} records`);
      sql += `\n-- Data for ${tableName}: ${records.length} records\n`;
      
      for (const record of records) {
        const keys = Object.keys(record);
        const escapedKeys = keys.map(k => '`' + k + '`').join(', ');
        const values = keys.map(k => escapeValue(record[k]));
        sql += `INSERT INTO \`${tableName}\` (${escapedKeys}) VALUES (${values.join(', ')});\n`;
        totalRecords++;
      }
    } catch (e) {
      console.log(`  ! ${tableName}: ${e.message}`);
    }
  }
  
  sql += `\nSET FOREIGN_KEY_CHECKS = 1;\n`;
  sql += `\n-- End of dump\n-- Total records: ${totalRecords}\n`;
  
  const outputPath = path.join(__dirname, '..', 'mysql-dump-v2.sql');
  fs.writeFileSync(outputPath, sql);
  
  console.log(`\n[4/4] Done!`);
  console.log(`Output: ${outputPath}`);
  console.log(`File size: ${fs.statSync(outputPath).size} bytes`);
  console.log(`Total records: ${totalRecords}`);
  console.log(`Tables: ${tables.length}`);
  
  await db.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
