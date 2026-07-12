#!/bin/bash
# ROYAL JUBILANT — ALL-IN-ONE FIX SCRIPT
# Run: bash fix-all.sh

set -e

echo "═══════════════════════════════════════════════════════"
echo "  ROYAL JUBILANT — ALL-IN-ONE FIX"
echo "═══════════════════════════════════════════════════════"
echo ""

# Setup Node 22
export PATH=/opt/alt/alt-nodejs22/root/bin:$PATH
echo "[1/7] Node version: $(node --version)"
echo ""

# Go to app source
cd /home/u432212399/domains/royaljubilant.com/public_html/.builds/last-source
echo "[2/7] Working dir: $(pwd)"
echo ""

# Set DATABASE_URL
export DATABASE_URL="mysql://u432212399_adminrjcom:Admin%402026%40%23@localhost:3306/u432212399_rjcom"
echo "[3/7] DATABASE_URL set"
echo ""

# Install dependencies (just prisma + client)
echo "[4/7] Installing dependencies (this takes 3-5 minutes)..."
npm install --production=false 2>&1 | tail -5
echo ""

# Generate Prisma client
echo "[5/7] Generating Prisma client..."
./node_modules/.bin/prisma generate 2>&1 | tail -3
echo ""

# Push schema to MySQL (creates all tables)
echo "[6/7] Pushing schema to MySQL (creates all 35+ tables)..."
./node_modules/.bin/prisma db push --accept-data-loss 2>&1 | tail -10
echo ""

# Run migration script (copies data from SQLite to MySQL)
echo "[7/7] Migrating data from SQLite to MySQL..."
node scripts/auto-migrate-mysql.js 2>&1 | tail -20
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  DONE! Now:"
echo "  1. hPanel → Advanced → Node.js → Restart app"
echo "  2. Login: https://www.royaljubilant.com/admin/login"
echo "     Email: admin@royaljubilant.ae"
echo "     Password: admin123"
echo "═══════════════════════════════════════════════════════"
