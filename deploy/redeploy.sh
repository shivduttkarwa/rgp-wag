#!/usr/bin/env bash
# redeploy.sh — pull latest code and restart services on EC2
# Usage:
#   bash /home/ubuntu/rgp-wag/deploy/redeploy.sh          # backend only
#   bash /home/ubuntu/rgp-wag/deploy/redeploy.sh --full   # backend + rebuild frontend
set -euo pipefail

PROJECT=/home/ubuntu/rgp-wag
BACKEND=$PROJECT/backend
FRONT=$PROJECT/front

FULL=false
[[ "${1:-}" == "--full" ]] && FULL=true

echo "======================================================"
echo " RGP — Redeploy $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

# ── 1. Pull latest code ───────────────────────────────────────────────────────
echo ""
echo "[ 1 ] Pulling latest code..."
cd $PROJECT
git fetch origin
git reset --hard origin/master
git clean -fd

# ── 2. Backend: install deps + migrate + collectstatic ───────────────────────
echo ""
echo "[ 2 ] Updating backend..."
cd $BACKEND
source .venv/bin/activate
pip install -q -r requirements.txt
python manage.py migrate --noinput
python manage.py collectstatic --noinput -v 0

# ── 3. Restart Gunicorn ───────────────────────────────────────────────────────
echo ""
echo "[ 3 ] Restarting Gunicorn..."
sudo systemctl restart rgp-gunicorn
sudo systemctl is-active rgp-gunicorn

# ── 4. Rebuild frontend (only with --full) ────────────────────────────────────
if [ "$FULL" = true ]; then
  echo ""
  echo "[ 4 ] Rebuilding frontend..."
  cd $FRONT
  npm install --silent
  npm run build
  echo "      Frontend built."
fi

echo ""
echo "======================================================"
echo " Done! Site is live at http://54.252.235.169"
echo "======================================================"
