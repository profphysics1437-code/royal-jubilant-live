#!/bin/bash
# Pull latest from GitHub
cd /home/z/my-project
git fetch origin
git reset --hard origin/main
echo "✅ Pulled latest from GitHub"
git log --oneline -3
