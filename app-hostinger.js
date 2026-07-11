const fs = require('fs');
const path = require('path');

// Database — SQLite (absolute path)
const dbFile = path.join(__dirname, 'db', 'custom.db');
if (!fs.existsSync(path.dirname(dbFile))) fs.mkdirSync(path.dirname(dbFile), { recursive: true });
process.env.DATABASE_URL = 'file:' + dbFile;

// NextAuth
process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

console.log('[app-hostinger] Environment:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL);
console.log('  NEXTAUTH_SECRET: Set');
console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

// Start server
const { execSync } = require('child_process');
try {
  console.log('[app] Starting Next.js production server on port ' + process.env.PORT + '...');
  execSync('npx next start -p ' + process.env.PORT, { stdio: 'inherit', env: process.env });
} catch (e) {
  console.error('[app] next start failed:', e.message);
  var standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(standaloneServer)) {
    console.log('[app] Falling back to standalone server...');
    require(standaloneServer);
  } else {
    console.error('[app] No server found. Exiting.');
    process.exit(1);
  }
}
