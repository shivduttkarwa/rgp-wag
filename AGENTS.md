# RGP-WAG — Agent Handoff Guide

## Stack
- **Backend:** Django 5.2 + Wagtail 7.0 (headless/API-only) — `backend/`
- **Frontend:** React 19 + Vite + TypeScript — `front/`
- **DB:** PostgreSQL — `postgres://rgp_user:rgp_pass_2024@localhost:5432/rgp_wag`
- **Server:** AWS EC2 `54.252.235.169` (ap-southeast-2, t2.micro), user `ubuntu`
- **Virtualenv:** `backend/.venv/`

---

## Deploy (EC2 only)

```bash
bash /home/ubuntu/rgp-wag/deploy/redeploy.sh          # backend only
bash /home/ubuntu/rgp-wag/deploy/redeploy.sh --full   # backend + rebuild frontend
```

The script auto-discards EC2 local changes, pulls, runs makemigrations + migrate, rebuilds frontend.

---

## Golden Rules

1. **Never edit files directly on EC2.** All code changes → local VS Code → git push → EC2 pulls.
2. **migrations are generated on EC2 only** (after `blocks.py` changes). Commit them back after:
   ```bash
   git add backend/apps/home/migrations/
   git commit -m "auto: migration XXXX"
   git push
   ```
3. **After every `blocks.py` change, update 3 files locally:**
   - `backend/apps/home/blocks.py` — the block field
   - `front/src/types/*.ts` — TypeScript type
   - `front/src/lib/api/*.ts` — default object (must match the type exactly)
4. **Conflicting migrations** (two 0032s etc): `python manage.py makemigrations --merge home` → commit the merge file.

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/apps/home/blocks.py` | All Wagtail StreamField block definitions |
| `backend/apps/home/models.py` | Page models + `_serialise_block_value()` API serialiser |
| `backend/apps/home/api.py` | API views returning JSON to React |
| `front/src/types/homePage.ts` | TypeScript types for API responses |
| `front/src/lib/api/homePage.ts` | API fetch + default fallback objects |
| `front/src/hooks/useHomePage.ts` | React hook consuming the API |
| `front/src/pages/HomePage.tsx` | Home page — maps API data to sections |
| `deploy/redeploy.sh` | One-command deploy script |

---

## Wagtail Content Tokens

Hero title fields use plain text with `[gold]word[/gold]` syntax for gold accent colour.  
Rendered by `front/src/lib/heroTokens.tsx` → `renderHeroAccentTokens()`.  
No amber variant — gold only.

---

## API Pattern

Each page has: `blocks.py` block → `models.py` serialiser → `api.py` view → `front/src/lib/api/*.ts` fetch → `front/src/hooks/use*.ts` hook → `front/src/pages/*.tsx` page.

Adding a new field means touching all 5 layers + the TypeScript type.

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `error: Your local changes would be overwritten` | `git checkout -- <file>` then `git pull` |
| `Property X is missing in type` | Add `X` to the TS type file AND the default object in `lib/api/*.ts` |
| `No migrations to apply` + model drift warning | Run `makemigrations home` on EC2, commit result |
| Two `0032` migrations conflict | `makemigrations --merge home`, commit merge file |
| `git pull` rejected (non-fast-forward) | `git pull --rebase` then `git push` |
