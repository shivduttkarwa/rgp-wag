# Anti-Spam Setup — Honeypot + reCAPTCHA v2

Two layers protect all three forms (Contact, EOI, Property Enquiry).

---

## 1. Get Your Keys

Go to https://www.google.com/recaptcha/admin → Create → **v2 Checkbox**  
Add your domain (e.g. `realgoldproperties.com.au`) + `localhost` for local dev.

You'll receive:
- **Site Key** — public, goes in the frontend
- **Secret Key** — private, goes in the backend only

---

## 2. Add to .env Files

**`backend/.env`**
```
RECAPTCHA_SECRET_KEY=6Le...your_secret_key
```

**`front/.env`** (or `front/.env.local`)
```
VITE_RECAPTCHA_SITE_KEY=6Le...your_site_key
```

After adding the frontend key, rebuild:
```bash
cd front && npm run build
# or on EC2:
bash /home/ubuntu/rgp-wag/deploy/redeploy.sh --full
```

---

## 3. What Was Built (don't touch these)

| File | What it does |
|---|---|
| `front/src/components/reusable/ReCaptchaV2.tsx` | Reusable reCAPTCHA v2 widget component |
| `front/index.html` | Loads the reCAPTCHA script from Google |
| `front/src/lib/api/forms.ts` | `recaptcha_token` + `website` (honeypot) added to all 3 payloads |
| `front/src/pages/ContactPage.tsx` | Honeypot field + widget wired in |
| `front/src/pages/ExpressionOfInterestPage.tsx` | Honeypot field + widget wired in |
| `front/src/components/reusable/PropDetails.tsx` | Honeypot field + widget wired in (enquiry card) |
| `backend/apps/forms/spam.py` | `is_honeypot_filled()` + `verify_recaptcha_v2()` |
| `backend/apps/forms/api.py` | Spam check runs before each form save |
| `backend/config/settings/base.py` | `RECAPTCHA_SECRET_KEY` setting |

---

## 4. How It Works

**Honeypot** — a hidden `website` field is in every form. Real users never see or fill it. If a bot fills it, the backend silently returns 201 (bot thinks it worked, nothing is saved).

**reCAPTCHA** — the checkbox widget must be ticked before submit is enabled. The token is verified server-side against Google's API before the form is saved or forwarded to Vaultre.

**Fail-open** — if `RECAPTCHA_SECRET_KEY` is missing (local dev) or Google is unreachable, verification passes automatically so real users are never blocked by a network blip.

---

## 5. Test It

1. Submit a form normally → should work ✓  
2. Open DevTools → manually set `recaptcha_token: ""` in the network request payload → backend returns 400 ✓  
3. Manually set `website: "spam"` in payload → backend returns 201 silently, nothing saved in DB ✓
