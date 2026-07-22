#!/usr/bin/env bash
# Royal Jubilant — production startup script
# Usage: bash start.sh
set -e

echo "🚀 Starting Royal Jubilant Real Estate..."

# Resolve absolute DB path — Prisma 6 resolves SQLite relative paths relative
# to schema.prisma location, so we MUST use an absolute path for portability.
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
ABS_DB_PATH="$APP_DIR/db/custom.db"
ABS_DB_URL="file:$ABS_DB_PATH"

echo "📂 App directory: $APP_DIR"
echo "💾 Database path: $ABS_DB_PATH"

# Update .env with resolved absolute DB path (preserves NEXTAUTH_SECRET if user set one)
if [ -f .env ]; then
  # Replace or add DATABASE_URL line
  if grep -q "^DATABASE_URL=" .env; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=$ABS_DB_URL|" .env
  else
    echo "DATABASE_URL=$ABS_DB_URL" >> .env
  fi
else
  echo "DATABASE_URL=$ABS_DB_URL" > .env
fi

# Ensure db directory exists
mkdir -p "$APP_DIR/db"

# Ensure DB exists and schema is in sync
echo "📊 Syncing database schema..."
npx prisma db push --accept-data-loss 2>&1 | tail -5

# Generate Prisma client (if missing)
echo "🔧 Generating Prisma client..."
npx prisma generate 2>&1 | tail -3

# Create logs directory
mkdir -p logs

# Start the server
echo "✨ Launching server on port ${PORT:-3000}..."
if command -v pm2 >/dev/null 2>&1; then
  echo "  Using PM2..."
  pm2 start ecosystem.config.cjs --update-env
  pm2 logs royal-jubilant --lines 20
else
  echo "  Using plain Node.js..."
  NODE_ENV=production node server.js
fi
