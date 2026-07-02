# EC2 Deploy Guide

## Server details

| Item | Value |
|---|---|
| IP | `52.64.245.210` |
| Domain | `realgoldproperties.com.au` |
| User | `ubuntu` |
| Project path | `/home/ubuntu/rgp-wag` |
| SSH key | `D:\Shiv\EC2\rgp-prod-ec2-key.pem` |

## Standard deploy (after pushing to `master`)

SSH in and run:

```bash
ssh -i "D:\Shiv\EC2\rgp-prod-ec2-key.pem" ubuntu@52.64.245.210
cd /home/ubuntu/rgp-wag
git pull
bash deploy/redeploy.sh --full
```

`--full` rebuilds the React frontend. Omit it for backend-only changes (migrations, Python deps).

## One-liner from local machine

```bash
ssh -i "D:\Shiv\EC2\rgp-prod-ec2-key.pem" ubuntu@52.64.245.210 "cd /home/ubuntu/rgp-wag && git pull && bash deploy/redeploy.sh --full"
```

## What `redeploy.sh --full` does

1. Runs `pip install`, `makemigrations`, `migrate`, `collectstatic`
2. Restarts Gunicorn (`rgp-gunicorn.service`)
3. Runs `npm install` + `npm run build` (React → `front/dist/`)

Nginx serves the built frontend statically — no Nginx restart needed unless its config changes.

## First-time setup on a new EC2

```bash
bash /home/ubuntu/rgp-wag/deploy/deploy-ec2.sh
```

Then create a CMS superuser:

```bash
cd /home/ubuntu/rgp-wag/backend
source .venv/bin/activate
python manage.py createsuperuser
```

## Useful service commands

```bash
sudo systemctl status rgp-gunicorn    # check Gunicorn
sudo systemctl restart rgp-gunicorn   # restart Gunicorn
sudo nginx -t && sudo systemctl reload nginx  # validate + reload Nginx
sudo journalctl -u rgp-gunicorn -n 50 # view Gunicorn logs
```

## URLs

- Site: https://realgoldproperties.com.au
- Wagtail CMS: https://realgoldproperties.com.au/cms/
- Django admin: https://realgoldproperties.com.au/admin/
- API: https://realgoldproperties.com.au/api/
