# Deployment Demo Guide

This project is split into:

- Frontend: `front` (`Vite + React + TypeScript`)
- Backend: `backend` (`Django + Wagtail`)

## Frontend: Cloudflare Pages

### 1. Create the Cloudflare Pages project

- Push this repository to GitHub.
- In Cloudflare, go to `Workers & Pages` -> `Create` -> `Pages` -> `Connect to Git`.
- Select this repository.

### 2. Cloudflare Pages build settings

- Root directory: `front`
- Build command: `npm run build`
- Build output directory: `dist`

### 3. Frontend environment variables

Set these in Cloudflare Pages:

- `VITE_API_URL=https://your-render-backend.onrender.com`
- `VITE_PUBLIC_BASE=/`

`VITE_PUBLIC_BASE` can stay `/` for a normal root-domain Pages deploy.

### 4. SPA routing support

This project already includes:

- `front/public/_redirects`

With:

```txt
/* /index.html 200
```

That allows React Router routes to work on Cloudflare Pages.

### 5. Demo frontend URL

- Website: `https://your-site.pages.dev`

## Backend: Render

### 1. Create the Render web service

- In Render, create a new `Web Service`.
- Connect the same GitHub repository.

### 2. Render service settings

- Root directory: `backend`
- Environment: `Python`

### 3. Backend build command

```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
```

### 4. Backend start command

```bash
gunicorn config.wsgi:application
```

### 5. Backend environment variables

Set these in Render:

```env
DJANGO_SETTINGS_MODULE=config.settings.production
SECRET_KEY=your-long-random-secret
DEBUG=False
DATABASE_URL=your-render-postgres-or-other-database-url
ALLOWED_HOSTS=.onrender.com,your-backend.onrender.com
CSRF_TRUSTED_ORIGINS=https://your-backend.onrender.com,https://your-site.pages.dev
CORS_ALLOWED_ORIGINS=https://your-site.pages.dev
WAGTAILADMIN_BASE_URL=https://your-backend.onrender.com
SECURE_SSL_REDIRECT=True
```

### 6. Demo backend URLs

Actual paths in this project:

- Backend base: `https://your-backend.onrender.com`
- Wagtail CMS: `https://your-backend.onrender.com/cms/`
- Django admin: `https://your-backend.onrender.com/admin/`
- Home API: `https://your-backend.onrender.com/api/pages/home/`

## Example client demo links

- Website: `https://your-site.pages.dev`
- CMS: `https://your-backend.onrender.com/cms/`

## Files prepared for deployment

### Frontend

- `front/vite.config.ts`
- `front/.env.example`
- `front/public/_redirects`
- API helpers now support `VITE_API_URL`

### Backend

- `backend/requirements.txt`
- `backend/.env.example`
- `backend/config/settings/base.py`
- `backend/config/settings/production.py`
- `backend/manage.py`
- `backend/config/wsgi.py`
- `backend/config/asgi.py`
- `render.yaml`

## Important warnings

- Render free plan may sleep when inactive, so the first backend request can be slow.
- Media uploads stored on local disk may not persist reliably on free hosting unless you add external storage such as S3, Cloudflare R2, or another persistent media provider.
- If Cloudflare Pages and Render use different domains, CORS and CSRF environment variables must include the final frontend domain exactly.
