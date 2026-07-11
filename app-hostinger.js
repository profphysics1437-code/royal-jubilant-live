const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// ENVIRONMENT VARIABLES — Set BEFORE starting server
// Password: Royal@2026@# → URL-encoded: Royal%402026%40%23
// ═══════════════════════════════════════════════════════════

process.env.DATABASE_URL = 'mysql://u432212399_adminrjcom:Royal%402026%40%23@localhost:3306/u432212399_rjcom';
process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

console.log('[app-hostinger] Environment FORCED:');
console.log('  DATABASE_URL: mysql://u432212399_adminrjcom:****@localhost:3306/u432212399_rjcom');
console.log('  NEXTAUTH_SECRET: Set');
console.log('  NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

// ═══════════════════════════════════════════════════════════
// START SERVER — Use next start (simpler, more reliable on Hostinger)
// ═══════════════════════════════════════════════════════════

const { execSync } = require('child_process');

try {
  console.log('[app] Starting Next.js production server on port ' + process.env.PORT + '...');
  execSync('npx next start -p ' + process.env.PORT, { 
    stdio: 'inherit',
    env: process.env 
  });
} catch (e) {
  console.error('[app] Failed to start:', e.message);
  
  // Fallback: try standalone if exists
  var standaloneServer = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(standaloneServer)) {
    console.log('[app] Falling back to standalone server...');
    require(standaloneServer);
  } else {
    console.error('[app] No server found. Exiting.');
    process.exit(1);
  }
}
