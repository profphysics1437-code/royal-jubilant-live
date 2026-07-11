const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES
// ═══════════════════════════════════════════════════════════

// Database — SQLite (absolute path)
const dbFile = path.join(__dirname, 'db', 'custom.db');
if (!fs.existsSync(path.dirname(dbFile))) fs.mkdirSync(path.dirname(dbFile), { recursive: true });
process.env.DATABASE_URL = 'file:' + dbFile;

// NextAuth
process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

// ═══════════════════════════════════════════════════════════
// START SERVER — Use Next.js standalone (most reliable on Hostinger)
// ═══════════════════════════════════════════════════════════

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
const nextCli = path.join(__dirname, 'node_modules', '.bin', 'next');

if (fs.existsSync(standaloneServer)) {
  // Standalone mode (preferred — no npx needed)
  console.log('[app] Starting standalone server...');
  
  // Copy static files to standalone
  const standaloneStatic = path.join(__dirname, '.next', 'standalone', '.next', 'static');
  const staticDir = path.join(__dirname, '.next', 'static');
  if (!fs.existsSync(standaloneStatic) && fs.existsSync(staticDir)) {
    fs.mkdirSync(path.dirname(standaloneStatic), { recursive: true });
    fs.cpSync(staticDir, standaloneStatic, { recursive: true });
  }
  
  // Copy public folder
  const standalonePublic = path.join(__dirname, '.next', 'standalone', 'public');
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(standalonePublic) && fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, standalonePublic, { recursive: true });
  }
  
  // Copy db folder
  const standaloneDb = path.join(__dirname, '.next', 'standalone', 'db');
  const dbDir = path.join(__dirname, 'db');
  if (!fs.existsSync(standaloneDb) && fs.existsSync(dbDir)) {
    fs.cpSync(dbDir, standaloneDb, { recursive: true });
  }
  
  require(standaloneServer);
} else if (fs.existsSync(nextCli)) {
  // Fallback: next start using direct binary (no npx)
  console.log('[app] Starting via next binary...');
  const { spawn } = require('child_process');
  const child = spawn('node', [nextCli, 'start', '-p', process.env.PORT], {
    stdio: 'inherit',
    env: process.env
  });
  child.on('error', (e) => {
    console.error('[app] Failed to start:', e.message);
    process.exit(1);
  });
} else {
  console.error('[app] No server found. Neither standalone nor next binary exists.');
  process.exit(1);
}
