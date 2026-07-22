#!/bin/bash
# Setup local dev (SQLite) — for local preview only
cd /home/z/my-project

# Set schema to sqlite for local dev
sed -i 's/provider = "mysql"/provider = "sqlite"/' prisma/schema.prisma

# Remove MySQL annotations (not needed for sqlite)
sed -i 's/ @db\.Text//g; s/ @db\.LongText//g; s/ @db\.VarChar([^)]*)//g' prisma/schema.prisma

# Update .env for local
cat > .env << 'ENV'
DATABASE_URL=file:./db/custom.db
NEXTAUTH_SECRET=CVhmTyhLAckaJX/ZEBDV4Dt8VC3zB2GZsbxymybVoWw=
NEXTAUTH_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
ENV

# Regenerate Prisma
npx prisma generate

# Restart dev server
pkill -f "next-server" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2
rm -rf .next
nohup npm run dev > dev.log 2>&1 &

sleep 15
echo "✅ Local dev ready at http://localhost:3000"
