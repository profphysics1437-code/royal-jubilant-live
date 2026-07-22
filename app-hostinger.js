const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// FULLY HARDCODED — no env var fallbacks, no .env dependency
process.env.DATABASE_URL = 'file:' + path.join(__dirname, 'db', 'custom.db');
process.env.NEXTAUTH_SECRET = 'CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=';
process.env.NEXTAUTH_URL = 'https://www.royaljubilant.com';
process.env.NODE_ENV = 'production';
process.env.PORT = '3000';
process.env.UV_THREADPOOL_SIZE = '4';

console.log('[app] DB: SQLite at', process.env.DATABASE_URL);
console.log('[app] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('[app] NODE_ENV:', process.env.NODE_ENV);

// ════════════════════════════════════════════════════════
// ENSURE PRISMA CLIENT EXISTS before starting app
// This fixes: admin login fail, RJ AI fail, properties missing
// ════════════════════════════════════════════════════════
const prismaClientDir = path.join(__dirname, 'node_modules', '.prisma', 'client');
const prismaBin = path.join(__dirname, 'node_modules', '.bin', 'prisma');

if (!fs.existsSync(prismaClientDir)) {
  console.log('[app] Prisma Client missing — generating now...');
  try {
    if (fs.existsSync(prismaBin)) {
      execSync(`"${prismaBin}" generate`, { stdio: 'inherit', cwd: __dirname, env: process.env });
    } else {
      // Install prisma if binary doesn't exist
      console.log('[app] Prisma binary not found — installing...');
      execSync('npm install prisma@6.11.1 @prisma/client@6.11.1 --ignore-scripts', {
        stdio: 'inherit', cwd: __dirname, env: process.env
      });
      execSync(`"${prismaBin}" generate`, { stdio: 'inherit', cwd: __dirname, env: process.env });
    }
    console.log('[app] ✅ Prisma Client generated');
  } catch (e) {
    console.error('[app] ⚠️  Prisma generate failed:', e.message);
    console.error('[app] App may not work properly without Prisma Client');
  }
} else {
  console.log('[app] ✅ Prisma Client already exists');
}

// ════════════════════════════════════════════════════════
// START APP
// ════════════════════════════════════════════════════════
try {
  execSync('npx next start -p ' + process.env.PORT, { stdio: 'inherit', env: process.env });
} catch (e) {
  // Fallback to standalone server if next start fails
  var s = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(s)) {
    var st = path.join(__dirname, '.next', 'static');
    var ss = path.join(__dirname, '.next', 'standalone', '.next', 'static');
    if (!fs.existsSync(ss) && fs.existsSync(st)) {
      fs.mkdirSync(path.dirname(ss), { recursive: true });
      fs.cpSync(st, ss, { recursive: true });
    }
    var p = path.join(__dirname, 'public');
    var sp = path.join(__dirname, '.next', 'standalone', 'public');
    if (!fs.existsSync(sp) && fs.existsSync(p)) {
      fs.cpSync(p, sp, { recursive: true });
    }
    require(s);
  } else {
    console.error('[app] FATAL: No build found. Run "npx next build" first.');
    process.exit(1);
  }
}
