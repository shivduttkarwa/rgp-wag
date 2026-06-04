# EC2 Deployment Guide — Real Gold Properties (HTTP Demo)

Target server: Ubuntu 24.04 LTS on AWS EC2 (free tier, ap-southeast-2)
Public IP: `54.252.235.169`
EC2 hostname: `ec2-54-252-235-169.ap-southeast-2.compute.amazonaws.com`

## URL map after deployment

| URL | What it serves |
|-----|----------------|
| `http://54.252.235.169/` | React SPA (Vite build) |
| `http://54.252.235.169/cms/` | **Wagtail CMS admin** (content editing) |
| `http://54.252.235.169/admin/` | Django admin (users, raw models) |
| `http://54.252.235.169/api/` | All REST API routes |
| `http://54.252.235.169/api/v2/` | Wagtail built-in API |
| `http://54.252.235.169/static/` | Django collected static files (Nginx) |
| `http://54.252.235.169/media/` | Uploaded media files (Nginx) |

> **Note:** The Wagtail CMS admin is at `/cms/`, not `/admin/`.
> Django's own admin (for user management) is at `/admin/`.
> Both are proxied by Nginx to Gunicorn.

---

## Security group prerequisites (AWS Console)

Before starting, confirm your EC2 security group inbound rules:

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Your IP only |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 (for later) |

Port 8000 must NOT be open publicly. Gunicorn binds to `127.0.0.1:8000` only.

---

## Step 1 — SSH into the server

```bash
ssh -i your-key.pem ubuntu@54.252.235.169
```

---

## Step 2 — System packages

```bash
sudo apt update && sudo apt upgrade -y

# Python 3.12, venv, pip
sudo apt install -y python3.12 python3.12-venv python3.12-dev python3-pip

# Node 20 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx
sudo apt install -y nginx

# Build tools (needed for some Python packages)
sudo apt install -y build-essential libpq-dev
```

Verify versions:
```bash
python3 --version   # should be 3.12.x
node --version      # should be 20.x.x
nginx -v
```

---

## Step 3 — Upload or clone the project

**Option A — git clone (if repo is on GitHub):**
```bash
cd /home/ubuntu
git clone https://github.com/your-org/rgp-wag.git
cd rgp-wag
```

**Option B — scp from local machine (run this on your Windows machine):**
```powershell
scp -i your-key.pem -r "D:\Kailash\rgp-wag" ubuntu@54.252.235.169:/home/ubuntu/rgp-wag
```

---

## Step 4 — Backend: virtual environment & dependencies

```bash
cd /home/ubuntu/rgp-wag/backend

# Create venv
python3.12 -m venv .venv

# Activate
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

---

## Step 5 — Backend: environment file

```bash
cp .env.example .env
nano .env
```

Fill in the required values:

```
SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_urlsafe(50))">
DEBUG=False
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=54.252.235.169,ec2-54-252-235-169.ap-southeast-2.compute.amazonaws.com,localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=http://54.252.235.169,http://ec2-54-252-235-169.ap-southeast-2.compute.amazonaws.com
CORS_ALLOWED_ORIGINS=http://54.252.235.169,http://ec2-54-252-235-169.ap-southeast-2.compute.amazonaws.com
WAGTAILADMIN_BASE_URL=http://54.252.235.169
MEDIA_URL=/media/
MEDIA_ROOT=/home/ubuntu/rgp-wag/backend/media
DJANGO_SETTINGS_MODULE=config.settings.demo
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

Generate a secret key quickly:
```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

---

## Step 6 — Backend: database, static files, superuser

```bash
cd /home/ubuntu/rgp-wag/backend
source .venv/bin/activate

# Create media directory (must exist before Gunicorn starts)
mkdir -p media

# Run migrations
python manage.py migrate

# Collect static files into backend/staticfiles/
python manage.py collectstatic --noinput

# Create Wagtail/Django superuser
python manage.py createsuperuser
```

---

## Step 7 — Frontend: build

```bash
cd /home/ubuntu/rgp-wag/front

# Copy production env (VITE_API_BASE_URL must be empty for same-origin)
cp .env.production.example .env

# Install dependencies
npm install

# Build
npm run build
# Output lands in: /home/ubuntu/rgp-wag/front/dist/
```

---

## Step 8 — Nginx

```bash
# Copy site config
sudo cp /home/ubuntu/rgp-wag/deploy/nginx/rgp-demo /etc/nginx/sites-available/rgp-demo

# Enable it
sudo ln -s /etc/nginx/sites-available/rgp-demo /etc/nginx/sites-enabled/rgp-demo

# Disable default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Apply
sudo systemctl reload nginx
```

---

## Step 9 — Gunicorn systemd service

```bash
# Copy service file
sudo cp /home/ubuntu/rgp-wag/deploy/systemd/rgp-gunicorn.service /etc/systemd/system/rgp-gunicorn.service

# Add ubuntu user to www-data group (needed for socket permissions)
sudo usermod -aG www-data ubuntu

# Reload systemd, enable and start
sudo systemctl daemon-reload
sudo systemctl enable rgp-gunicorn
sudo systemctl start rgp-gunicorn

# Check status
sudo systemctl status rgp-gunicorn
```

View live logs:
```bash
sudo journalctl -u rgp-gunicorn -f
```

---

## Step 10 — Verify

```bash
# Gunicorn is running on internal port only
curl -s http://127.0.0.1:8000/api/pages/home/ | head -c 200

# React SPA loads
curl -s http://54.252.235.169/ | grep -c "<!doctype"

# Wagtail API responds
curl -s http://54.252.235.169/api/v2/pages/?format=json | head -c 200
```

Open in browser:
- Frontend: `http://54.252.235.169/`
- Wagtail CMS admin: `http://54.252.235.169/cms/`
- Django admin: `http://54.252.235.169/admin/`

---

## Step 11 — Wagtail site configuration

After logging into the Wagtail CMS admin (`/cms/`):

1. Go to **Settings → Sites**
2. Set the site hostname to `54.252.235.169` and port to `80`
3. Save

This ensures Wagtail page links and the API return correct absolute URLs.

---

## Redeployment (code update)

```bash
cd /home/ubuntu/rgp-wag

# Pull latest code
git pull

# Backend
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart rgp-gunicorn

# Frontend
cd ../front
npm install
npm run build

sudo systemctl reload nginx
```

---

## Troubleshooting

| Symptom | Check |
|---------|-------|
| 502 Bad Gateway | `sudo systemctl status rgp-gunicorn` — is it running? |
| Admin login silently fails | Confirm `SESSION_COOKIE_SECURE=False` and `CSRF_COOKIE_SECURE=False` in `.env` |
| API calls return 403 | Check `CSRF_TRUSTED_ORIGINS` and `CORS_ALLOWED_ORIGINS` include `http://54.252.235.169` |
| React routes return 404 | Check Nginx `try_files $uri $uri/ /index.html` is in place |
| Static files 404 | Run `collectstatic` and check path in Nginx `alias` |
| Media uploads lost on restart | Check `MEDIA_ROOT=/home/ubuntu/rgp-wag/backend/media` in `.env` (not `/tmp/`) |
| Gunicorn env vars missing | Check `EnvironmentFile=` path in systemd service matches actual `.env` location |

---

## Optional: adding SSL with Let's Encrypt (later)

Once you have a domain pointed at this IP:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Then update `.env`:
```
DJANGO_SETTINGS_MODULE=config.settings.production
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
CSRF_TRUSTED_ORIGINS=https://yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
WAGTAILADMIN_BASE_URL=https://yourdomain.com
```

And rebuild the React frontend with the domain in the env if needed.

---

## Optional: S3 for media storage (later)

For a persistent demo on EC2, local media (`/home/ubuntu/rgp-wag/backend/media/`) is
sufficient. If you later want uploads to survive instance replacement or scale:

1. Install `django-storages` and `boto3`:
   ```bash
   pip install django-storages[boto3]
   ```

2. Create an S3 bucket and IAM user with `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on that bucket.

3. Add to `.env`:
   ```
   USE_S3=True
   AWS_STORAGE_BUCKET_NAME=your-bucket-name
   AWS_S3_REGION_NAME=ap-southeast-2
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   ```

4. Update `backend/config/settings/production.py` to wire up `django-storages` when `USE_S3=True`.

Do NOT activate this for the HTTP demo — local media is fine and keeps the setup simple.
