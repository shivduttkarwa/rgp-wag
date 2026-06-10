#!/usr/bin/env bash
# redeploy.sh — apply changes and restart services
# Run this on EC2 after editing code.
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
echo " RGP — Deploy $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================"

# ── 1. Backend: migrations + collectstatic ────────────────────────────────────
echo ""
echo "[ 1 ] Updating backend..."
cd $BACKEND
source .venv/bin/activate
pip install -q -r requirements.txt
python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput -v 0

# ── 2. Restart Gunicorn ───────────────────────────────────────────────────────
echo ""
echo "[ 2 ] Restarting Gunicorn..."
sudo systemctl restart rgp-gunicorn
sudo systemctl is-active rgp-gunicorn

# ── 3. Rebuild frontend (only with --full) ────────────────────────────────────
if [ "$FULL" = true ]; then
  echo ""
  echo "[ 3 ] Rebuilding frontend..."
  cd $FRONT
  npm install --silent
  npm run build
  echo "      Frontend built."
fi

echo ""
echo "======================================================"
echo " Done! Site is live at http://54.252.235.169"
echo "======================================================"
