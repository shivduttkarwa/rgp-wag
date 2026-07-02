# RGP-WAG — Agent Handoff Guide

## Stack
- **Backend:** Django 5.2 + Wagtail 7.0 (headless/API-only) — `backend/`
- **Frontend:** React 19 + Vite + TypeScript — `front/`
- **DB:** PostgreSQL — `postgres://rgp_user:rgp_pass_2024@localhost:5432/rgp_wag`
- **Server:** AWS EC2 `52.64.245.210` (ap-southeast-2, t2.micro), user `ubuntu`
- **Virtualenv:** `backend/.venv/`
- **Serving model:** Nginx serves `front/dist` as the SPA root and proxies `/api/`, `/cms/`, and `/admin/` to Gunicorn

---

## Deploy

```bash
bash /home/ubuntu/rgp-wag/deploy/redeploy.sh          # backend refresh
bash /home/ubuntu/rgp-wag/deploy/redeploy.sh --full   # backend + rebuild frontend
```

`deploy/redeploy.sh` assumes the EC2 checkout is already up to date. It does **not** `git pull` or discard changes for you. It installs backend deps, runs `makemigrations`, `migrate`, and `collectstatic`, restarts Gunicorn, and with `--full` rebuilds `front/dist`.

For a fresh server, use:

```bash
bash /home/ubuntu/rgp-wag/deploy/deploy-ec2.sh
```

That script bootstraps packages, the venv, Django, Nginx, Gunicorn, and the first frontend build.

---

## Golden Rules

1. **Never edit files directly on EC2.** Make changes locally, push them, then update the EC2 checkout.
2. **Frontend source changes require a rebuild.** If the live site looks stale, the source may be updated but `front/dist` is not. Run `redeploy.sh --full`.
3. **Schema changes must stay in sync across layers.** When a StreamField or API shape changes, update the backend serializer/API and the matching TypeScript type and API defaults together.
4. **Migrations are generated on EC2 during deploy.** If `makemigrations` creates new files, commit them back after the deploy run.
5. **Conflicting migrations** (two `0032`s etc): `python manage.py makemigrations --merge home` and commit the merge file.

---

## Data Flow

Each CMS-managed page follows the same path:

`blocks.py` block -> `models.py` serializer -> `api.py` view -> `front/src/lib/api/*.ts` fetch/defaults -> `front/src/hooks/use*.ts` hook -> `front/src/pages/*.tsx`

For properties specifically, there is one extra source:

`sync_properties` -> `backend/cache/properties.json` -> `backend/apps/properties/vaultre.py` -> `backend/apps/properties/api.py` / `backend/apps/home/models.py`

---

## VaultRE Integration

Properties are synced to `backend/cache/properties.json`. Public requests read that cache and do not call VaultRE directly.

### Key files
| File | Purpose |
|---|---|
| `backend/apps/properties/vaultre.py` | VaultRE client, sync fetch, file cache reader, response normaliser |
| `backend/apps/properties/api.py` | DRF list/detail endpoints for property cards and property details |
| `backend/apps/properties/management/commands/sync_properties.py` | Hourly sync command for EC2 cron |
| `backend/apps/properties/wagtail_hooks.py` | CMS admin sync action and property listing tooling |

### How it works
1. EC2 cron or the CMS "Sync Properties" action runs `python manage.py sync_properties`
2. Django fetches the VaultRE endpoints, writes `backend/cache/properties.json`, and updates the in-process cache
3. The public API reads from the cache on normal traffic
4. New listings appear after the next sync, not live on page load

### VaultRE notes
- The sync uses 5 base endpoints:
  ```python
  ("residential/sale",  "for-sale", "listingOrConditional")
  ("residential/lease", "for-rent", "listingOrConditional")
  ("commercial/sale",   "for-sale", "listingOrConditional")
  ("commercial/lease",  "for-rent", "listingOrConditional")
  ("land/sale",         "for-sale", "listingOrConditional")
  ```
- Pagination can increase the call count per sync.
- If the cache is missing, public requests return empty data rather than falling back to live VaultRE calls.

### Credentials
Use the backend `.env` and the EC2 `.env`:

```bash
VAULTRE_API_KEY=...
VAULTRE_ACCESS_TOKEN=...    # token value only, Bearer prefix is added in code
```

### Filtering
`GET /api/properties/?category=for-sale` filters by category.

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/apps/home/blocks.py` | Wagtail StreamField block definitions |
| `backend/apps/home/models.py` | Page models and API serializers |
| `backend/apps/home/api.py` | CMS page JSON endpoints |
| `backend/apps/properties/vaultre.py` | VaultRE cache + normalisation |
| `backend/apps/properties/api.py` | Property list/detail API views |
| `backend/apps/properties/wagtail_hooks.py` | CMS sync action for VaultRE listings |
| `backend/apps/properties/management/commands/sync_properties.py` | Hourly sync command |
| `backend/config/settings/base.py` | Shared Django settings |
| `backend/config/settings/production.py` | EC2 / production settings |
| `front/src/types/*.ts` | API response types |
| `front/src/lib/api/*.ts` | Fetch helpers and default payloads |
| `front/src/hooks/use*.ts` | Page data hooks |
| `front/src/pages/*.tsx` | Route views |
| `front/src/components/reusable/PropDetails.tsx` | Property detail layout |
| `front/src/pages/PropertyPage.tsx` | Property detail page |
| `deploy/redeploy.sh` | Routine EC2 redeploy |
| `deploy/deploy-ec2.sh` | First-time EC2 bootstrap |
| `deploy/systemd/rgp-gunicorn.service` | Gunicorn service definition |

---

## Wagtail Content Tokens

Hero title fields use plain text with `[gold]word[/gold]` syntax for gold accent colour.
Rendered by `front/src/lib/heroTokens.tsx` -> `renderHeroAccentTokens()`.
No amber variant — gold only.

---

## Local Dev Setup

```bash
# Backend (PowerShell, venv already at backend/.venv)
cd backend
.\.venv\Scripts\Activate.ps1
python manage.py runserver        # http://localhost:8000/cms/

# Frontend
cd front && npm run dev           # http://localhost:5173
```

SSH to EC2:

```bash
ssh -i ~/.ssh/rgp-demo.pem ubuntu@52.64.245.210
```

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `error: Your local changes would be overwritten` | `git checkout -- <file>` then `git pull` |
| `Property X is missing in type` | Update the TS type file, the API default object, and the matching backend serializer if the response shape changed |
| Live site differs from local build | Rebuild the frontend with `deploy/redeploy.sh --full` so `front/dist` is refreshed |
| `/api/properties/` returns `[]` | Check `backend/cache/properties.json`, VaultRE credentials, and whether the sync job ran |
| No migrations to apply + model drift warning | Run `makemigrations home` on EC2 and commit the result |
| Two `0032` migrations conflict | `makemigrations --merge home`, commit the merge file |
| `git pull` rejected (non-fast-forward) | `git pull --rebase` then `git push` |

