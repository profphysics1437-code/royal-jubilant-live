# Royal Jubilant Real Estate LLC — Hostinger Deployment Package (v2)

**Fixes in v2:**
- ✅ Added `app.js` — Passenger-compatible entry point
- ✅ Added `app-hostinger.js` — Resolves DB path before server start
- ✅ Added `.htaccess` — Apache/LiteSpeed rewrite rules for clean routing
- ✅ Added `setup-hostinger.sh` — One-command setup via SSH
- ✅ Added `.hostinger/app.json` — Hostinger platform config hint

## Deploy Steps (Hostinger Business Plan)

### Method 1: Via hPanel "Node.js" section (recommended)

1. Login to **hPanel → Advanced → Node.js**
2. Click **Create Node.js App** (or edit existing one)
3. Configure:
   - **App name:** `royal-jubilant`
   - **Domain:** `www.royaljubilant.com`
   - **App directory:** `public_html` (or your chosen folder)
   - **Node.js version:** `22.x`
   - **Startup file:** `app.js` ← CRITICAL (not server.js)
   - **Package manager:** `npm`
4. Upload `royal-jubilant-deploy-hostinger.zip`
5. Click **Save & Deploy**
6. Add Environment Variables (in the same Node.js panel):
   ```
   DATABASE_URL = file:/home/uXXXXX/domains/royaljubilant.com/public_html/db/custom.db
   NEXTAUTH_SECRET = CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=
   NEXTAUTH_URL = https://www.royaljubilant.com
   NODE_ENV = production
   PORT = 3000
   ```
   > Replace `uXXXXX` with your Hostinger username (visible at top of hPanel)
7. Click **Restart App** / **Run NPM Install** (if available)
8. Visit `https://www.royaljubilant.com`

### Method 2: Via SSH (faster, more control)

```bash
# SSH in
ssh uXXXXX@your-server-ip

# Navigate to your domain's web root
cd ~/domains/royaljubilant.com/public_html

# Backup the old site (if any)
mv index.html index.html.old 2>/dev/null
mv index.php index.php.old 2>/dev/null

# Upload the zip via SFTP, then unzip
unzip royal-jubilant-deploy-hostinger.zip

# Run the setup script
bash setup-hostinger.sh

# Back in hPanel → Node.js, set:
#   Startup file: app.js
#   Restart the app
```

## Critical Settings Checklist

| Setting | Required value |
|---|---|
| **Startup file** | `app.js` (NOT server.js, NOT index.js) |
| **Root directory** | `/` (where you unzipped) |
| **Node version** | `22.x` (or 18.x minimum) |
| **App directory permissions** | `755` |
| **db/ folder permissions** | `775` |
| **db/custom.db permissions** | `664` (writable by app) |
| **DATABASE_URL env var** | Absolute path — see above |
| **NEXTAUTH_SECRET env var** | Set to a stable random string |

## If Still Getting 403

1. Check hPanel → Node.js → **Logs** tab for errors
2. Verify `app.js` exists at the root of your app folder (not in a subfolder)
3. Verify env vars are set (most common cause of crash)
4. Try restarting the app: hPanel → Node.js → your app → **Restart**
5. Check file permissions via SSH:
   ```bash
   ls -la ~/domains/royaljubilant.com/public_html/
   # Should show:
   # -rwxr-xr-x app.js
   # drwxrwxr-x db/
   # -rw-rw-r-- db/custom.db
   ```
6. If the app crashed, check the log file:
   ```bash
   cat ~/domains/royaljubilant.com/logs/*.log | tail -50
   ```

## Default Admin Login

- URL: `https://www.royaljubilant.com/admin/login`
- Email: `admin@royaljubilant.com`
- Password: `admin123`
- **CHANGE PASSWORD IMMEDIATELY after first login**

## What's Different from v1

v1 used `server.js` as the entry point — Hostinger Passenger couldn't
launch it because Next.js standalone's `startServer()` pattern doesn't
match what Passenger expects.

v2 adds `app.js` as a thin wrapper that:
1. Sets `NODE_ENV=production`
2. Requires `server.js` (which calls `startServer()`)
3. Passenger spawns `app.js`, Next.js binds to PORT, Passenger proxies traffic

This is the officially supported pattern for Next.js on Phusion Passenger.
