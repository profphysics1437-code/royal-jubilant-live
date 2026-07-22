#!/bin/bash
# Push to GitHub — but first set schema back to mysql for production
cd /home/z/my-project

# Set schema back to mysql for production
sed -i 's/provider = "sqlite"/provider = "mysql"/' prisma/schema.prisma

# Commit and push
git add -A
git commit -m "update: $(date '+%Y-%m-%d %H:%M') changes"
git push origin main

echo "✅ Pushed to GitHub"
echo ""
echo "⚠️  Now run ./LOCAL-DEV.sh to switch back to local dev mode"
