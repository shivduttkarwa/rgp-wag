#!/usr/bin/env bash
# deploy-ec2.sh — one-shot setup for Real Gold Properties on Ubuntu 24.04 EC2
# Run as ubuntu user:  bash /home/ubuntu/rgp-wag/deploy/deploy-ec2.sh
set -euo pipefail

PROJECT=/home/ubuntu/rgp-wag
BACKEND=$PROJECT/backend
FRONT=$PROJECT/front

echo "======================================================"
echo " RGP — EC2 first-time deploy"
echo "======================================================"

# ── 1. System packages ────────────────────────────────────────────────────────
echo ""
echo "[ 1/8 ] Installing system packages..."
sudo apt-get update -qq
sudo apt-get install -y -qq \
    python3.12 python3.12-venv python3.12-dev python3-pip \
    build-essential libpq-dev nginx curl

# Node 20 LTS via NodeSource
if ! command -v node &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - >/dev/null
    sudo apt-get install -y -qq nodejs
fi
echo "    python $(python3.12 --version)  node $(node --version)  nginx $(nginx -v 2>&1 | cut -d/ -f2)"

# ── 2. Backend venv + dependencies ───────────────────────────────────────────
echo ""
echo "[ 2/8 ] Setting up Python venv..."
cd "$BACKEND"
if [ ! -d .venv ]; then
    python3.12 -m venv .venv
fi
source .venv/bin/activate
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo "    dependencies installed"

# ── 3. Backend .env ───────────────────────────────────────────────────────────
echo ""
echo "[ 3/8 ] Writing backend/.env..."
if [ ! -f "$BACKEND/.env" ]; then
    SECRET=$(python -c "import secrets; print(secrets.token_urlsafe(50))")
    sed "s/^SECRET_KEY=$/SECRET_KEY=$SECRET/" "$BACKEND/.env.example" > "$BACKEND/.env"
    echo "    .env created with generated SECRET_KEY"
else
    echo "    .env already exists — skipping (won't overwrite)"
fi

# ── 4. Migrate, collectstatic, media dir ─────────────────────────────────────
echo ""
echo "[ 4/8 ] Running Django setup..."
cd "$BACKEND"
source .venv/bin/activate
mkdir -p media
python manage.py migrate --noinput
python manage.py collectstatic --noinput -v 0
echo "    migrate + collectstatic done"

# ── 5. Frontend build ─────────────────────────────────────────────────────────
echo ""
echo "[ 5/8 ] Building React frontend..."
cd "$FRONT"
if [ ! -f .env ]; then
    cp .env.production.example .env
fi
npm install --silent
npm run build
echo "    dist/ built"

# ── 6. Nginx ──────────────────────────────────────────────────────────────────
echo ""
echo "[ 6/8 ] Configuring Nginx..."
sudo cp "$PROJECT/deploy/nginx/rgp-demo" /etc/nginx/sites-available/rgp-demo
sudo ln -sf /etc/nginx/sites-available/rgp-demo /etc/nginx/sites-enabled/rgp-demo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
echo "    Nginx configured and reloaded"

# ── 7. Gunicorn systemd service ───────────────────────────────────────────────
echo ""
echo "[ 7/8 ] Installing Gunicorn systemd service..."
sudo cp "$PROJECT/deploy/systemd/rgp-gunicorn.service" /etc/systemd/system/rgp-gunicorn.service
sudo usermod -aG www-data ubuntu 2>/dev/null || true
sudo systemctl daemon-reload
sudo systemctl enable rgp-gunicorn
sudo systemctl restart rgp-gunicorn
sleep 2
echo "    Gunicorn status: $(sudo systemctl is-active rgp-gunicorn)"

# ── 8. Smoke test ─────────────────────────────────────────────────────────────
echo ""
echo "[ 8/8 ] Smoke tests..."
sleep 1
API=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/api/pages/home/ || echo "000")
FRONT_HTML=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1/ || echo "000")
echo "    Gunicorn /api/pages/home/  → HTTP $API"
echo "    Nginx    /                 → HTTP $FRONT_HTML"

echo ""
echo "======================================================"
echo " Deploy complete."
echo ""
echo " Frontend  : http://52.64.245.210/"
echo " Wagtail   : http://52.64.245.210/cms/"
echo " Django    : http://52.64.245.210/admin/"
echo ""
echo " NEXT: create a superuser to log into the CMS:"
echo "   cd $BACKEND && source .venv/bin/activate"
echo "   python manage.py createsuperuser"
echo "======================================================"
