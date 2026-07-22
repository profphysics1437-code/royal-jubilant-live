#!/usr/bin/env bash
# Assembles a production-ready deployment package for Hostinger (Node.js VPS).
# Output: /home/z/my-project/download/royal-jubilant-deploy.zip

set -euo pipefail

PROJECT_DIR="/home/z/my-project"
BUILD_DIR="$PROJECT_DIR/.next/standalone"
DEPLOY_DIR="$PROJECT_DIR/deploy-staging"
ZIP_OUT="$PROJECT_DIR/download/royal-jubilant-deploy.zip"

echo "🧹 Cleaning staging directory..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "📦 Copying standalone build..."
# Copy the entire standalone directory (server.js, .next/, node_modules/, public/, package.json)
cp -r "$BUILD_DIR/." "$DEPLOY_DIR/"

echo "🎨 Copying static assets..."
# Next.js standalone does NOT include .next/static by design — must copy manually
mkdir -p "$DEPLOY_DIR/.next/static"
cp -r "$PROJECT_DIR/.next/static/." "$DEPLOY_DIR/.next/static/"

echo "🌐 Copying public folder (full version)..."
# Replace the partial public/ with the full one (includes videos, team photos, uploads)
rm -rf "$DEPLOY_DIR/public"
cp -r "$PROJECT_DIR/public" "$DEPLOY_DIR/public/"

echo "🗄️ Copying Prisma schema + migrations..."
mkdir -p "$DEPLOY_DIR/prisma"
cp "$PROJECT_DIR/prisma/schema.prisma" "$DEPLOY_DIR/prisma/"

echo "💾 Copying pre-seeded SQLite database..."
# Include the seeded DB so the site is fully populated on first boot
mkdir -p "$DEPLOY_DIR/db"
cp "$PROJECT_DIR/db/custom.db" "$DEPLOY_DIR/db/custom.db"

echo "📝 Creating production package.json..."
cat > "$DEPLOY_DIR/package.json" <<'PKGJSON'
{
  "name": "royal-jubilant-real-estate",
  "version": "1.0.0",
  "private": true,
  "description": "Royal Jubilant Real Estate LLC — luxury Dubai real estate platform",
  "scripts": {
    "build": "echo Pre-built package — skipping build step",
    "start": "node resolve-db-path.js && node server.js",
    "start:prod": "NODE_ENV=production node resolve-db-path.js && NODE_ENV=production node server.js",
    "db:push": "node resolve-db-path.js && prisma db push --accept-data-loss",
    "db:generate": "prisma generate",
    "db:seed": "tsx scripts/seed-production.ts",
    "db:seed-portal": "tsx scripts/seed-portal-data.ts",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^6.11.1",
    "bcryptjs": "^3.0.3",
    "next": "^16.1.1",
    "next-auth": "^4.24.11",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "engines": {
    "node": ">=18.17.0"
  }
}
PKGJSON

echo "🔐 Creating .env.example..."
cat > "$DEPLOY_DIR/.env.example" <<'ENVEXAMPLE'
# ====================================================================
# Royal Jubilant Real Estate — Environment Configuration
# ====================================================================
# Copy this file to `.env` on the server and fill in real values.
# Generate a new NEXTAUTH_SECRET with: openssl rand -base64 32
# ====================================================================

# Database — SQLite file path (relative to project root)
DATABASE_URL=file:./db/custom.db

# NextAuth — REQUIRED for login to work
NEXTAUTH_SECRET=REPLACE_WITH_RANDOM_32_BYTE_BASE64_STRING
NEXTAUTH_URL=https://your-domain.com

# Optional: SMTP for email sending (leave empty to disable)
# SMTP_HOST=smtp.hostinger.com
# SMTP_PORT=465
# SMTP_USER=noreply@your-domain.com
# SMTP_PASS=your-email-password
# SMTP_FROM="Royal Jubilant <noreply@your-domain.com>"

# Optional: Google OAuth for social login (leave empty to disable)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
ENVEXAMPLE

echo "📄 Creating .env (with placeholder values)..."
cp "$DEPLOY_DIR/.env.example" "$DEPLOY_DIR/.env"

echo "🚀 Creating PM2 ecosystem file..."
cat > "$DEPLOY_DIR/ecosystem.config.cjs" <<'PM2CONFIG'
module.exports = {
  apps: [{
    name: 'royal-jubilant',
    script: 'server.js',
    cwd: __dirname,
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    max_memory_restart: '512M',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    merge_logs: true,
  }],
};
PM2CONFIG

echo "📜 Creating startup script..."
cat > "$DEPLOY_DIR/start.sh" <<'STARTSH'
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
STARTSH
chmod +x "$DEPLOY_DIR/start.sh"

echo "🔧 Creating cross-platform DB path resolver..."
cat > "$DEPLOY_DIR/resolve-db-path.js" <<'RESOLVEDB'
// Resolves the absolute SQLite DB path and writes it to .env
// Run before server.js: node resolve-db-path.js && node server.js
const fs = require('fs');
const path = require('path');

const appDir = __dirname;
const dbPath = path.join(appDir, 'db', 'custom.db');
const dbUrl = `file:${dbPath}`;
const envPath = path.join(appDir, '.env');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  if (/^DATABASE_URL=/m.test(envContent)) {
    envContent = envContent.replace(/^DATABASE_URL=.*/m, `DATABASE_URL=${dbUrl}`);
  } else {
    envContent += `\nDATABASE_URL=${dbUrl}\n`;
  }
} else {
  envContent = `DATABASE_URL=${dbUrl}\n`;
}
fs.writeFileSync(envPath, envContent);
console.log(`[resolve-db-path] DATABASE_URL=${dbUrl}`);
RESOLVEDB

echo "📖 Copying seed scripts (optional, for re-seeding)..."
mkdir -p "$DEPLOY_DIR/scripts"
cp "$PROJECT_DIR/scripts/seed-production.ts" "$DEPLOY_DIR/scripts/" 2>/dev/null || true
cp "$PROJECT_DIR/scripts/seed-portal-data.ts" "$DEPLOY_DIR/scripts/" 2>/dev/null || true
cp "$PROJECT_DIR/scripts/patch-agent-listings.ts" "$DEPLOY_DIR/scripts/" 2>/dev/null || true

echo "📚 Writing README.md with deployment instructions..."
cat > "$DEPLOY_DIR/README.md" <<'README'
# Royal Jubilant Real Estate LLC — Production Deployment

This package contains a **production-ready build** of the Royal Jubilant Real
Estate platform (Next.js 16 + Prisma + SQLite) for deployment on a
**Hostinger Node.js VPS** (or any Node.js-capable host).

---

## 📦 What's Inside

| Path | Purpose |
|------|---------|
| `server.js` | Standalone Next.js production server (entry point) |
| `.next/` | Compiled Next.js app (server + static chunks) |
| `node_modules/` | Minimal production dependencies (already installed) |
| `public/` | Static assets (logos, team photos, videos, uploads) |
| `prisma/schema.prisma` | Database schema |
| `db/custom.db` | Pre-seeded SQLite database (16 properties, 8 agents, 6 communities, 31 leads, etc.) |
| `package.json` | Scripts for `start`, `db:push`, `db:generate` |
| `ecosystem.config.cjs` | PM2 process manager config |
| `start.sh` | One-command startup script |
| `.env.example` | Environment variable template |
| `scripts/` | Seed scripts (optional, for re-seeding) |

---

## 🚀 Deployment on Hostinger

### Option A — Hostinger VPS (recommended)

1. **Upload the zip** to your Hostinger VPS:
   - SSH into your VPS: `ssh root@your-server-ip`
   - Or use Hostinger File Manager → upload `royal-jubilant-deploy.zip` to `/var/www/` (or your preferred dir)
   - Unzip: `unzip royal-jubilant-deploy.zip -d /var/www/royal-jubilant`

2. **Install Node.js 18+ and PM2** (if not already installed):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
   apt-get install -y nodejs
   npm install -g pm2
   ```

3. **Configure environment**:
   ```bash
   cd /var/www/royal-jubilant
   cp .env.example .env
   nano .env  # edit NEXTAUTH_SECRET and NEXTAUTH_URL
   ```
   Generate a new secret: `openssl rand -base64 32`
   Set `NEXTAUTH_URL=https://your-domain.com`

4. **Start the app**:
   ```bash
   cd /var/www/royal-jubilant
   bash start.sh
   ```
   This will:
   - Sync the Prisma schema
   - Generate the Prisma client
   - Start the server on port 3000 via PM2

5. **Set up Nginx reverse proxy** (Hostinger usually has this in hPanel):
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
     }
   }
   ```
   Then enable SSL with: `certbot --nginx -d your-domain.com`

6. **Verify**:
   - Visit `https://your-domain.com` — homepage should load
   - Visit `https://your-domain.com/admin` — log in with `admin@royaljubilant.ae` / `admin123`
   - **CHANGE THE ADMIN PASSWORD IMMEDIATELY** after first login

### Option B — Hostinger Shared Hosting with Node.js

Hostinger shared hosting supports Node.js apps via hPanel:

1. Go to **hPanel → Advanced → Node.js**
2. Click **Create Node.js App**
3. Set:
   - **Node.js version**: 18.x or 20.x
   - **Application root**: `royal-jubilant`
   - **Application URL**: your domain
   - **Application startup file**: `server.js`
4. Upload `royal-jubilant-deploy.zip` via File Manager → unzip into the application root
5. Edit `.env` with your real values (especially `NEXTAUTH_SECRET`)
6. In hPanel → Node.js → click **Run NPM Install** (dependencies are pre-bundled, but this ensures Prisma client is built)
7. Click **Start App**
8. Visit your domain to verify

---

## 🔐 Default Login Credentials

**CHANGE THESE IMMEDIATELY after deployment.**

| Portal | URL | Email | Password |
|--------|-----|-------|----------|
| Admin CMS | `/admin` | `admin@royaljubilant.ae` | `admin123` |
| Agent CRM | `/agent` | `awais.ali@royaljubilant.ae` | `zeerak2026` |
| Agent CRM | `/agent` | `maria.raza@royaljubilant.ae` | `maria2026` |
| Agent CRM | `/agent` | `muhammad.naeem.zafar@royaljubilant.ae` | `naeem2026` |
| Agent CRM | `/agent` | `naqash.haider@royaljubilant.ae` | `naqash2026` |
| Agent CRM | `/agent` | `muhammad.saleem.khan@royaljubilant.ae` | `saleem2026` |
| Agent CRM | `/agent` | `ahmad.raza@royaljubilant.ae` | `ahmad2026` |
| Agent CRM | `/agent` | `muhammad.nazim@royaljubilant.ae` | `nazim2026` |
| Agent CRM | `/agent` | `ahmad.ali@royaljubilant.ae` | `ahmad2026` |

To reset a password, edit the user in the admin portal, or run this SQL on the
SQLite DB (replace `NEW_PASSWORD`):
```sql
-- Generate the hash first: node -e "console.log(require('bcryptjs').hashSync('NEW_PASSWORD',10))"
UPDATE User SET passwordHash = '<generated_hash>' WHERE email = 'admin@royaljubilant.ae';
```

---

## 🗄️ Database Notes

- The included `db/custom.db` is **pre-seeded** with:
  - 11 users (1 admin, 9 agents, 1 demo customer)
  - 8 agents (with bios, awards, specializations)
  - 18 properties (sale, rent, off-plan, commercial)
  - 6 communities, 6 developers, 6 awards, 4 testimonials
  - 31 leads, 20 appointments, 52 CRM notes, 12 commissions
  - 8 valuations, 8 mortgage enquiries, 12 newsletter subs
  - 6 email templates, 5 report snapshots, 3 popups
  - 58 activity logs, 25 audit logs, 20 messages, 25 notifications
  - 5 hero slides, 128 locations, 28 categories, 102 amenities
  - 44 menu items, 9 SEO meta entries, 8 FAQs, 7 videos
  - 20 media files, 4 landing pages, 64 site settings
- To start fresh: `rm db/custom.db && npx prisma db push && npx tsx scripts/seed-production.ts && npx tsx scripts/seed-portal-data.ts`

---

## 🛠️ Common Operations

```bash
# View app logs (PM2)
pm2 logs royal-jubilant

# Restart app
pm2 restart royal-jubilant

# Stop app
pm2 stop royal-jubilant

# Re-sync DB schema (after schema.prisma edits)
npx prisma db push --accept-data-loss

# Re-seed all data (DESTRUCTIVE — overwrites existing)
npx tsx scripts/seed-production.ts
npx tsx scripts/seed-portal-data.ts

# Open SQLite shell
sqlite3 db/custom.db
```

---

## ⚠️ Important Notes

1. **NextAuth Secret**: The included `.env` has a placeholder — you MUST generate a real one (`openssl rand -base64 32`) or login will silently fail.
2. **HTTPS**: Set `NEXTAUTH_URL` to your actual HTTPS domain, not `http://`.
3. **File Permissions**: Ensure `db/` and `logs/` are writable by the Node.js process user.
4. **Backups**: The SQLite DB is a single file at `db/custom.db` — back it up regularly.
5. **Node Version**: Requires Node.js 18.17+ (Node 20 LTS recommended).
6. **Memory**: Minimum 512MB RAM (1GB+ recommended for build steps).

---

## 📞 Support

For issues with this deployment, check:
1. `pm2 logs royal-jubilant` — application logs
2. `logs/error.log` — PM2 error log
3. Verify `.env` is correctly configured
4. Verify `db/custom.db` is writable

---

**Royal Jubilant Real Estate LLC** — luxury Dubai real estate platform.
Built with Next.js 16, TypeScript, Prisma, Tailwind CSS 4, shadcn/ui.
README

echo "🗜️ Creating zip archive..."
cd "$PROJECT_DIR"
rm -f "$ZIP_OUT"
cd "$DEPLOY_DIR"
zip -r -q "$ZIP_OUT" . -x "*.DS_Store" -x "node_modules/.cache/*" -x ".next/cache/*"
cd "$PROJECT_DIR"

echo "✅ Package created successfully!"
echo ""
echo "📦 Output: $ZIP_OUT"
echo "📊 Size: $(du -h "$ZIP_OUT" | cut -f1)"
echo "📁 Contents: $(find "$DEPLOY_DIR" -type f | wc -l) files"
echo ""
echo "--- Top-level contents ---"
ls -la "$DEPLOY_DIR" | head -20
