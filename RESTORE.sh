#!/bin/bash
# ════════════════════════════════════════════════════════
#  ROYAL JUBILANT — ONE COMMAND RESTORE
#  Run: bash RESTORE.sh
# ════════════════════════════════════════════════════════

cd /home/z/my-project

echo "═══════════════════════════════════════════════════════"
echo "  ROYAL JUBILANT — RESTORING LATEST STATE"
echo "═══════════════════════════════════════════════════════"

# Step 1: Add remote if missing
if ! git remote | grep -q origin; then
  git remote add origin https://github.com/profphysics1437-code/royal-jubilant-live.git
fi

# Step 2: Fetch latest
echo "[1/4] Fetching from GitHub..."
git fetch origin 2>&1 | tail -2

# Step 3: Reset to latest main
echo "[2/4] Resetting to latest GitHub main..."
git reset --hard origin/main 2>&1 | tail -2

# Step 4: Setup local dev (SQLite)
echo "[3/4] Setting up local dev (SQLite)..."

# Set schema to sqlite
sed -i 's/provider = "mysql"/provider = "sqlite"/' prisma/schema.prisma
# Remove MySQL annotations
sed -i 's/ @db\.Text//g; s/ @db\.LongText//g; s/ @db\.VarChar([^)]*)//g' prisma/schema.prisma

# Create .env for local dev
cat > .env << 'ENV'
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=
NEXTAUTH_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
ENV

# Step 5: Generate Prisma + start server
echo "[4/4] Generating Prisma + starting server..."
npx prisma generate 2>&1 | tail -2

pkill -f "next-server" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2
rm -rf .next
nohup npm run dev > dev.log 2>&1 &

sleep 15

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ READY!"
echo ""
echo "  Local Preview: http://localhost:3000"
echo "  Admin Login:   http://localhost:3000/admin/login"
echo "  Email:         admin@royaljubilant.ae"
echo "  Password:      admin123"
echo ""
echo "  Latest commit: $(git log --oneline -1)"
echo "═══════════════════════════════════════════════════════"
