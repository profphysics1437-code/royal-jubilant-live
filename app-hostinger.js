const fs = require('fs');
const path = require('path');

// Resolve absolute DB path
const dbFile = path.join(__dirname, 'db', 'custom.db');
if (!fs.existsSync(path.dirname(dbFile))) fs.mkdirSync(path.dirname(dbFile), { recursive: true });
process.env.DATABASE_URL = `file:${dbFile}`;
console.log('[resolve-db] DATABASE_URL =', process.env.DATABASE_URL);

// Try standalone server first, then regular server
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
  // Fallback: use next start
  console.log('[app] No server.js found, using next start');
  const { execSync } = require('child_process');
  execSync('npx next start -p ' + (process.env.PORT || 3000), { stdio: 'inherit' });
}
