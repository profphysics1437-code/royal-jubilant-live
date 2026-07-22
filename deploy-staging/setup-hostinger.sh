#!/usr/bin/env bash
# Royal Jubilant — Hostinger shared hosting boot script
# Run this via SSH after uploading the zip
set -e

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR"

echo "📍 App directory: $APP_DIR"

# Fix permissions (Hostinger requires these)
echo "🔐 Setting permissions..."
chmod -R 755 .
chmod -R 775 db .next
chmod 664 db/custom.db 2>/dev/null || true
chmod 664 .env 2>/dev/null || true
chmod 644 .htaccess app.js app-hostinger.js server.js 2>/dev/null || true

# Resolve absolute DB path
echo "💾 Resolving DB path..."
node -e "
const path = require('path');
const fs = require('fs');
const dbFile = path.join('$APP_DIR', 'db', 'custom.db');
const envPath = path.join('$APP_DIR', '.env');
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
if (/^DATABASE_URL=/m.test(env)) {
  env = env.replace(/^DATABASE_URL=.*$/m, 'DATABASE_URL=file:' + dbFile);
} else {
  env = env + '\nDATABASE_URL=file:' + dbFile;
}
fs.writeFileSync(envPath, env);
console.log('DATABASE_URL=file:' + dbFile);
"

# Sync DB schema
echo "📊 Syncing database schema..."
npx prisma db push --accept-data-loss 2>&1 | tail -3

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate 2>&1 | tail -2

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now in hPanel → Node.js → your app:"
echo "  • Startup file: app.js (or app-hostinger.js)"
echo "  • Root directory: /"
echo "  • Save and click 'Restart' / 'Redeploy'"
echo ""
echo "Environment variables to set in hPanel:"
echo "  DATABASE_URL = file:$APP_DIR/db/custom.db"
echo "  NEXTAUTH_SECRET = CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw="
echo "  NEXTAUTH_URL = https://www.royaljubilant.com"
echo "  NODE_ENV = production"
echo "  PORT = 3000"
