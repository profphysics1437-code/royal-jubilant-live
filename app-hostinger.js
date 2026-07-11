const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES — Set ALL required vars as fallbacks
// This ensures the app works even if .env is missing (e.g., GitHub deploy)
// ═══════════════════════════════════════════════════════════

// Database — absolute path to SQLite file
const dbFile = path.join(__dirname, 'db', 'custom.db');
if (!fs.existsSync(path.dirname(dbFile))) fs.mkdirSync(path.dirname(dbFile), { recursive: true });
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = `file:${dbFile}`;

// NextAuth — required for JWT token creation
if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
if (!process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';

// Node environment
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
if (!process.env.PORT) process.env.PORT = '3000';

console.log('[app-hostinger] Environment configured:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL);
console.log('  NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing');
console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
const regularServer = path.join(__dirname, 'server.js');

if (fs.existsSync(standaloneServer)) {
  console.log('[app] Starting standalone server from .next/standalone/server.js');
  
  // Copy static files to standalone if missing
  const standaloneStatic = path.join(__dirname, '.next', 'standalone', '.next', 'static');
  const staticDir = path.join(__dirname, '.next', 'static');
  if (!fs.existsSync(standaloneStatic) && fs.existsSync(staticDir)) {
    fs.mkdirSync(path.dirname(standaloneStatic), { recursive: true });
    fs.cpSync(staticDir, standaloneStatic, { recursive: true });
  }
  
  // Copy public folder to standalone
  const standalonePublic = path.join(__dirname, '.next', 'standalone', 'public');
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(standalonePublic) && fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, standalonePublic, { recursive: true });
  }
  
  // Copy db folder to standalone
  const standaloneDb = path.join(__dirname, '.next', 'standalone', 'db');
  const dbDir = path.join(__dirname, 'db');
  if (!fs.existsSync(standaloneDb) && fs.existsSync(dbDir)) {
    fs.cpSync(dbDir, standaloneDb, { recursive: true });
  }
  
  require(standaloneServer);
} else if (fs.existsSync(regularServer)) {
  console.log('[app] Starting regular server from ./server.js');
  require(regularServer);
} else {
  console.log('[app] No server.js found, using next start');
  const { execSync } = require('child_process');
  execSync('npx next start -p ' + (process.env.PORT || 3000), { stdio: 'inherit' });
}
