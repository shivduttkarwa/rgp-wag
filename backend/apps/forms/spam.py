import logging

import requests
from django.conf import settings

logger = logging.getLogger("apps.forms.spam")

_SITEVERIFY_URL = "https://www.googleapis.com/recaptcha/api/siteverify"


def is_honeypot_filled(data: dict) -> bool:
    return bool((data.get("website") or "").strip())


def verify_recaptcha_v2(token: str) -> bool:
    """Verify a reCAPTCHA v2 token against Google.

    Returns True when valid. Fails open (returns True) if the secret key is
    not configured or if Google is unreachable, so a network blip never
    blocks a real user. Returns False only on a clear verification failure.
    """
    secret = getattr(settings, "RECAPTCHA_SECRET_KEY", "")
    if not secret:
        return True
    if not token:
        return False
    try:
        resp = requests.post(
            _SITEVERIFY_URL,
            data={"secret": secret, "response": token},
            timeout=5,
        )
        result = resp.json()
        success = result.get("success", False)
        if not success:
            logger.warning("[reCAPTCHA] Verification failed — codes: %s", result.get("error-codes"))
        return success
    except Exception as exc:
        logger.warning("[reCAPTCHA] Verification error (failing open): %s", exc)
        return True
