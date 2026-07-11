const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES
// ═══════════════════════════════════════════════════════════

// Database — MySQL connection (Hostinger)
// Password: Royal@2026@# → URL-encoded: Royal%402026%40%23
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://u432212399_adminrjcom:Royal%402026%40%23@localhost:3306/u432212399_rjcom';
}

// NextAuth
if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
if (!process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';

// Node
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
if (!process.env.PORT) process.env.PORT = '3000';

console.log('[app-hostinger] Environment configured:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
console.log('  NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✓ Set' : '✗ Missing');
console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

const standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
const regularServer = path.join(__dirname, 'server.js');

if (fs.existsSync(standaloneServer)) {
  console.log('[app] Starting standalone server from .next/standalone/server.js');
  
  // Copy static files
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
  
  require(standaloneServer);
} else if (fs.existsSync(regularServer)) {
  console.log('[app] Starting regular server from ./server.js');
  require(regularServer);
} else {
  console.log('[app] No server.js found, using next start');
  const { execSync } = require('child_process');
  execSync('npx next start -p ' + (process.env.PORT || 3000), { stdio: 'inherit' });
}
