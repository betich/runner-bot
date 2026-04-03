#!/bin/bash
# Sync source to Raspberry Pi and restart the bot
# Usage: ./deploy.sh [rpi-host]  (default: rpi)

set -e

HOST=${1:-rpi}
REMOTE_DIR="code/line-runner-bot"

echo "==> Syncing to $HOST:$REMOTE_DIR"
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude 'data' \
  --exclude '.env' \
  --exclude '*.db' \
  --exclude '.DS_Store' \
  /Users/betich/code/playground/line-runner-bot/ \
  "$HOST:$REMOTE_DIR/"

echo "==> Installing dependencies & building on Pi"
ssh "$HOST" "cd $REMOTE_DIR && npm install --omit=dev && npm run build"

echo "==> Restarting bot"
ssh "$HOST" "cd $REMOTE_DIR && pm2 restart line-runner-bot 2>/dev/null || pm2 start dist/index.js --name line-runner-bot"

echo "==> Done! Bot is running on $HOST"
