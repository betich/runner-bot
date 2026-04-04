#!/bin/bash
# Sync source to Raspberry Pi and restart the bot
# Usage: ./deploy.sh [rpi-host]  (default: rpi)
#
# First-time setup on the Pi:
#   ./deploy.sh --setup [rpi-host]

set -e

SETUP=false
if [[ "$1" == "--setup" ]]; then
  SETUP=true
  shift
fi

HOST=${1:-rpi}
REMOTE_DIR="code/line-runner-bot"
REMOTE_USER=$(ssh "$HOST" whoami)
BUN=$(ssh "$HOST" "bash -li -c 'which bun' 2>/dev/null")
SERVICE="line-runner-bot@${REMOTE_USER}"

if [[ -z "$BUN" ]]; then
  echo "Error: bun not found on $HOST" >&2
  exit 1
fi
echo "==> Using bun at $BUN"

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
ssh "$HOST" "cd $REMOTE_DIR && $BUN install --production && $BUN run build"

if $SETUP; then
  echo "==> Installing systemd service"
  ssh -t "$HOST" "
    sed 's|ExecStart=.*|ExecStart=$BUN run dist/index.js|' /home/$REMOTE_USER/$REMOTE_DIR/line-runner-bot.service | sudo tee /etc/systemd/system/line-runner-bot@.service > /dev/null &&
    sudo systemctl daemon-reload &&
    sudo systemctl enable $SERVICE &&
    sudo systemctl start $SERVICE
  "
  echo "==> Service installed and started"
else
  echo "==> Restarting bot"
  ssh "$HOST" "sudo systemctl restart $SERVICE"
fi

echo "==> Done! Bot is running on $HOST"
echo "    Logs: ssh $HOST 'journalctl -u $SERVICE -f'"
