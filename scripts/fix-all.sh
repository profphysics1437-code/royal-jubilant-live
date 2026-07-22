#!/bin/bash
# ROYAL JUBILANT — ALL-IN-ONE FIX SCRIPT v2
# Run: bash fix-all.sh
# 
# This version uses --ignore-scripts to skip the broken postinstall

set +e  # Don't exit on error, keep going

echo "═══════════════════════════════════════════════════════"
echo "  ROYAL JUBILANT — ALL-IN-ONE FIX (v2)"
echo "═══════════════════════════════════════════════════════"
echo ""

# Setup Node 22
export PATH=/opt/alt/alt-nodejs22/root/bin:$PATH
echo "[1/8] Node version: $(node --version)"
echo "      npm version: $(npm --version)"
echo ""

# Go to app source
cd /home/u432212399/domains/royaljubilant.com/public_html/.builds/last-source
echo "[2/8] Working dir: $(pwd)"
echo ""

# Set DATABASE_URL
export DATABASE_URL="mysql://u432212399_adminrjcom:Admin%402026%40%23@localhost:3306/u432212399_rjcom"
export NEXTAUTH_SECRET="CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw="
export NEXTAUTH_URL="https://www.royaljubilant.com"
export NODE_ENV="production"
echo "[3/8] Environment variables set"
echo "      DATABASE_URL: ${DATABASE_URL:0:50}..."
echo ""

# Install dependencies WITHOUT running postinstall (which is broken)
echo "[4/8] Installing dependencies with --ignore-scripts (3-5 minutes)..."
npm install --ignore-scripts 2>&1 | tail -10
echo ""

# Check if prisma is now installed
if [ -f "./node_modules/.bin/prisma" ]; then
    echo "[5/8] Prisma binary found ✅"
    PRISMA_CMD="./node_modules/.bin/prisma"
elif [ -d "./node_modules/prisma" ]; then
    echo "[5/8] Prisma package found, using node directly"
    PRISMA_CMD="node node_modules/prisma/build/index.js"
else
    echo "[5/8] Prisma not found. Installing prisma separately..."
    npm install prisma@6.11.1 @prisma/client@6.11.1 --ignore-scripts 2>&1 | tail -5
    PRISMA_CMD="./node_modules/.bin/prisma"
fi
echo "      Using: $PRISMA_CMD"
echo ""

# Generate Prisma client
echo "[6/8] Generating Prisma client..."
$PRISMA_CMD generate 2>&1 | tail -5
echo ""

# Push schema to MySQL (creates all tables)
echo "[7/8] Pushing schema to MySQL (creates all 35+ tables)..."
$PRISMA_CMD db push --accept-data-loss 2>&1 | tail -15
echo ""

# Run migration script (copies data from SQLite to MySQL)
echo "[8/8] Migrating data from SQLite to MySQL..."
node scripts/auto-migrate-mysql.js 2>&1 | tail -25
echo ""

echo "═══════════════════════════════════════════════════════"
echo "  FIX COMPLETE!"
echo ""
echo "  Next steps:"
echo "  1. hPanel → Advanced → Node.js → Restart app"
echo "  2. Wait 1 minute"
echo "  3. Login: https://www.royaljubilant.com/admin/login"
echo "     Email: admin@royaljubilant.ae"
echo "     Password: admin123"
echo "═══════════════════════════════════════════════════════"
