/**
 * PostgreSQL Data Migration Script
 * Reads all data from SQLite and generates PostgreSQL INSERT statements
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const sqliteUrl = 'file:' + path.join(__dirname, '..', 'db', 'custom.db');
const db = new PrismaClient({ datasources: { db: { url: sqliteUrl } } });

function escapeValue(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (v instanceof Date) {
    return "'" + v.toISOString().slice(0, 19).replace('T', ' ') + "'";
  }
  if (typeof v === 'object') {
    const json = JSON.stringify(v);
    return "'" + json.replace(/\\/g, '\\\\').replace(/'/g, "''") + "'";
  }
  const s = String(v).replace(/\\/g, '\\\\').replace(/'/g, "''");
  return "'" + s + "'";
}

async function main() {
  console.log('[1/3] Reading data from SQLite...');
  
  const models = [
    'user', 'agent', 'property', 'community', 'developer', 'blogPost',
    'testimonial', 'award', 'faq', 'heroSlide', 'video', 'siteSetting',
    'lead', 'appointment', 'message', 'notification',
    'crmNote', 'commission', 'newsletterSubscriber', 'valuationRequest',
    'mortgageEnquiry', 'auditLog', 'activityLog', 'mediaFile', 'popup',
    'seoMeta', 'menuItem', 'emailTemplate', 'landingPage', 'reportSnapshot',
    'location', 'propertyCategory', 'amenity', 'savedProperty', 'savedSearch',
    'storyEvent'
  ];
  
  let sql = `-- PostgreSQL data migration from SQLite
-- Royal Jubilant Real Estate LLC
-- Generated: ${new Date().toISOString()}
-- 
-- Run this in Supabase SQL Editor AFTER running supabase-schema.sql

SET session_replication_role = 'replica'; -- Disable FK checks for faster inserts

`;
  
  console.log('[2/3] Generating INSERT statements...');
  let totalRecords = 0;
  
  for (const model of models) {
    try {
      const records = await db[model].findMany();
      if (records.length === 0) continue;
      
      const tableName = model.charAt(0).toUpperCase() + model.slice(1);
      console.log(`  ${tableName}: ${records.length} records`);
      
      sql += `\n-- Data for "${tableName}": ${records.length} records\n`;
      
      for (const record of records) {
        const keys = Object.keys(record);
        const escapedKeys = keys.map(k => `"${k}"`).join(', ');
        const values = keys.map(k => escapeValue(record[k]));
        sql += `INSERT INTO "${tableName}" (${escapedKeys}) VALUES (${values.join(', ')});\n`;
        totalRecords++;
      }
    } catch (e) {
      // skip
    }
  }
  
  sql += `\nSET session_replication_role = 'origin'; -- Re-enable FK checks\n`;
  sql += `\n-- End of data migration\n-- Total records: ${totalRecords}\n`;
  
  const outputPath = path.join(__dirname, '..', 'supabase-data.sql');
  fs.writeFileSync(outputPath, sql);
  
  console.log(`\n[3/3] Done!`);
  console.log(`Schema SQL: supabase-schema.sql (run first)`);
  console.log(`Data SQL:   supabase-data.sql (run second)`);
  console.log(`Total records: ${totalRecords}`);
  
  await db.$disconnect();
}

main().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
