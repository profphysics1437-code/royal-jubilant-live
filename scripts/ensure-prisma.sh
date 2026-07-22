#!/bin/bash
# ════════════════════════════════════════════════════════
#  ENSURE PRISMA — bulletproof Prisma Client generation
#  Runs before build AND before app start
# ════════════════════════════════════════════════════════

set -e
cd "$(dirname "$0")/.."

echo "[ensure-prisma] Checking Prisma Client..."

# Try multiple ways to run prisma generate
PRISMA_BIN="./node_modules/.bin/prisma"
NPX_PRISMA="npx prisma@6.11.1"

if [ -f "$PRISMA_BIN" ]; then
  echo "[ensure-prisma] Using local prisma binary"
  $PRISMA_BIN generate
elif command -v npx &> /dev/null; then
  echo "[ensure-prisma] Using npx prisma"
  $NPX_PRISMA generate
else
  echo "[ensure-prisma] ERROR: Cannot find prisma. Trying npm install..."
  npm install prisma@6.11.1 @prisma/client@6.11.1 --ignore-scripts 2>&1 | tail -3
  if [ -f "$PRISMA_BIN" ]; then
    $PRISMA_BIN generate
  else
    echo "[ensure-prisma] FATAL: Prisma still not available"
    exit 1
  fi
fi

# Verify
if [ -d "node_modules/.prisma/client" ]; then
  echo "[ensure-prisma] ✅ Prisma Client generated successfully"
  ls node_modules/.prisma/client/ | head -3
else
  echo "[ensure-prisma] ⚠️  Client directory not found, trying again..."
  $PRISMA_BIN generate 2>&1 || $NPX_PRISMA generate 2>&1
fi
