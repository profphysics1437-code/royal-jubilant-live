/**
 * SCHEMA SETUP — auto-detect environment and set correct Prisma provider
 * 
 * Runs before prisma generate:
 * - Local dev (NODE_ENV=development or DATABASE_URL=file:) → SQLite
 * - Hostinger production (NODE_ENV=production or DATABASE_URL=mysql:) → MySQL
 * 
 * This fixes the root cause of admin login failing on Hostinger.
 */

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.log('[schema] schema.prisma not found, skipping');
  process.exit(0);
}

const schema = fs.readFileSync(schemaPath, 'utf8');
const dbUrl = process.env.DATABASE_URL || '';

// Detect environment
const isProduction = 
  process.env.NODE_ENV === 'production' || 
  dbUrl.startsWith('mysql:') || 
  dbUrl.startsWith('mysql://');

const targetProvider = isProduction ? 'mysql' : 'sqlite';
const currentMatch = schema.match(/provider\s*=\s*"(sqlite|mysql)"/);
const currentProvider = currentMatch ? currentMatch[1] : null;

if (currentProvider === targetProvider) {
  console.log(`[schema] Provider already set to ${targetProvider} ✓`);
  process.exit(0);
}

// Update schema
const updatedSchema = schema.replace(
  /provider\s*=\s*"(sqlite|mysql)"/,
  `provider = "${targetProvider}"`
);

fs.writeFileSync(schemaPath, updatedSchema);
console.log(`[schema] Provider changed: ${currentProvider} → ${targetProvider}`);
console.log(`[schema] Environment: ${isProduction ? 'PRODUCTION (MySQL)' : 'DEVELOPMENT (SQLite)'}`);
