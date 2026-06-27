# Pre-Handover Audit Report — RGP-WAG

**Date:** 2026-06-27  
**Status:** Pending fixes — do not hand over until Critical items resolved

---

## 1. Dead Code / Unused Files

Files confirmed to have zero imports anywhere in the codebase. Safe to delete.

| # | File(s) | Reason | Action |
|---|---------|--------|--------|
| 1 | `front/src/test.tsx` | Leftover test file from a different project. Imports components that don't exist (`OverLayMenu`, `SiteSettings`, `HomeLogo`). | Delete |
| 2 | `front/src/components/reusable/uses.tsx` | Scratch/example component with hardcoded fake property data and a `console.log`. Never imported. | Delete |
| 3 | `front/src/components/DummyHero.tsx` + `DummyHero.css` | "Coming Soon" placeholder. Never imported anywhere. | Delete |
| 4 | `front/src/hooks/use-mobile.ts` | `useIsMobile()` hook with zero imports across the entire codebase. Mobile handled via CSS media queries. | Delete |
| 5 | `front/src/pages/PageShell.css` | CSS file with no corresponding `.tsx` file and no imports. | Delete |
| 6 | `front/src/components/Popup.tsx` + `Popup.css` | Full popup component — never imported anywhere in the app. | Delete |
| 7 | `front/src/sections/Timeline.tsx` + `Timeline.css` | Section component never imported anywhere. | Delete |
| 8 | `front/src/components/BtnPrimary.tsx` + `BtnPrimary.css` | Only used inside `Popup.tsx` which is itself unused. | Delete with Popup |
| 9 | `front/src/components/BtnSecondary.tsx` + `BtnSecondary.css` | Only used inside `Timeline.tsx` which is itself unused. | Delete with Timeline |

---

## 2. Critical Bugs

Must fix before handover.

### BUG-1 — CSS filename case mismatch (will break on EC2 Linux)
- **File:** `front/src/sections/PropertyListingsection.css`
- **Issue:** Filename has lowercase `s` in `section`. The component is `PropertyListingSection.tsx` (capital `S`). Windows is case-insensitive so it works locally, but **Linux (EC2) is case-sensitive — this import will fail in production**.
- **Fix:** Rename file to `PropertyListingSection.css` and update the import inside the `.tsx`.

### BUG-2 — Wagtail media uploads lost on server restart
- **File:** `backend/config/settings/production.py:17`
- **Code:** `MEDIA_ROOT = Path(config("MEDIA_ROOT", default="/tmp/rgp-media")).resolve()`
- **Issue:** `/tmp` is ephemeral on EC2. Every server restart wipes all user-uploaded images (property photos, team photos, testimonial avatars managed via Wagtail CMS).
- **Fix:** Add `MEDIA_ROOT=/home/ubuntu/rgp-media` (or equivalent persistent path) to the EC2 `.env` file.

---

## 3. Security Checklist

| # | Item | Status | Action |
|---|------|--------|--------|
| 1 | `.env` files excluded from git | ✅ OK | — |
| 2 | `DEBUG=False` in production | ✅ OK | — |
| 3 | HTTPS, HSTS, secure cookies enforced | ✅ OK | — |
| 4 | No hardcoded secrets in committed code | ✅ OK | — |
| 5 | No raw SQL / all ORM | ✅ OK | — |
| 6 | No `dangerouslySetInnerHTML` in React | ✅ OK | — |
| 7 | EC2 `.env` file permissions | ⚠️ Verify | Run `chmod 600 backend/.env` on EC2 |
| 8 | `CORS_ALLOWED_ORIGINS` set in EC2 `.env` | ⚠️ Verify | Must include your frontend domain, not wildcard |
| 9 | `RECAPTCHA_SECRET_KEY` set in EC2 `.env` | ⚠️ Verify | Without it, reCAPTCHA fails open (no spam protection) |
| 10 | Django `/admin/` at default path | 🟡 Low risk | Consider moving to a non-standard URL to reduce bot attacks |

---

## 4. Performance

| # | File | Issue | Priority |
|---|------|-------|----------|
| 1 | `front/public/images/*.jpg` | Hero images are 400–680 KB JPEGs. `hero.jpg` is 680 KB. Modern target is <150 KB with WebP format. | Medium |
| 2 | `front/src/lib/gsapSwitchAnimations.js` | 1,800+ line plain JS file loaded on every page. Not tree-shakeable. Should eventually be split or migrated to TypeScript modules. | Low |

---

## 5. Code Quality

| # | File | Issue | Priority |
|---|------|-------|----------|
| 1 | `front/src/App.tsx` | No React Error Boundary. If any page component throws, the entire app goes blank with no message. Add an `<ErrorBoundary>` wrapper around routes. | Medium |
| 2 | `front/src/pages/*.tsx` | Most pages silently render empty when API fails (`status === "error"` has no UI). Users see a blank page with no explanation if the backend is down. | Medium |
| 3 | `front/src/components/reusable/PropertyMarqee.tsx:161-206` | 8× `as any` casts for pointer/touch event listeners. Not a runtime bug but bypasses TypeScript safety. | Low |
| 4 | `front/src/hooks/*.ts` | `console.warn` calls left in all API hooks. Acceptable for debugging but consider stripping in production Vite build. | Low |

---

## Recommended Fix Order

1. **BUG-1** — Rename `PropertyListingsection.css` → `PropertyListingSection.css` (breaks on EC2 right now)
2. **BUG-2** — Set `MEDIA_ROOT` in EC2 `.env` to a persistent path (Wagtail images lost on restart)
3. **Dead files** — Delete all 9 unused files/components listed in Section 1
4. **Security** — Verify EC2 `.env` has `RECAPTCHA_SECRET_KEY`, `CORS_ALLOWED_ORIGINS`, and `chmod 600`
5. **Images** — Compress hero images to WebP
6. **Error Boundary** — Add to `App.tsx`
7. **Error UI** — Add visible error state to pages when API fails
