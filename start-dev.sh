#!/bin/bash
# Daemon-style script to start Next.js dev server and keep it running
# Detaches completely from the calling shell

cd /home/z/my-project

# Kill any existing next processes
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 2

# Clear cache to avoid stale state
rm -rf .next 2>/dev/null

# Start dev server using setsid + nohup + disown (triple-detached)
# Redirect all stdio to dev.log
setsid nohup node_modules/.bin/next dev -p 3000 > /home/z/my-project/dev.log 2>&1 < /dev/null &
DEV_PID=$!
disown $DEV_PID 2>/dev/null || true

# Save PID
echo $DEV_PID > /home/z/my-project/.zscripts/dev.pid

# Give it a moment to start
sleep 3

# Verify it's still alive
if ps -p $DEV_PID > /dev/null 2>&1; then
  echo "Dev server started, PID: $DEV_PID"
else
  echo "ERROR: Dev server died immediately"
  exit 1
fi

# Pre-warm the homepage by triggering compile
# Use a sub-shell with its own timeout
(sleep 2 && curl -s --max-time 90 -o /dev/null http://localhost:3000/) &

exit 0
