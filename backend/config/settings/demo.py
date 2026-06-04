"""
EC2 HTTP demo settings.

Inherits everything from production.py and overrides only the settings that
production.py hardcodes as HTTP-incompatible:
  - SESSION_COOKIE_SECURE / CSRF_COOKIE_SECURE → must be False over plain HTTP
    or the browser will not send cookies and admin login will silently fail.
  - SECURE_HSTS_* → must be 0/False; a non-zero HSTS header sent over HTTP
    will lock the browser to HTTPS-only for 1 year on that origin.

Switch DJANGO_SETTINGS_MODULE back to config.settings.production once SSL
certificates are installed and HTTPS is working.
"""
from .production import *  # noqa: F401, F403
from decouple import config as _config


def _flag(name: str, default: str) -> bool:
    return str(_config(name, default=default)).strip().lower() in {"1", "true", "yes", "on"}


# Allow HTTP-safe cookie flags to be controlled via .env
SESSION_COOKIE_SECURE = _flag("SESSION_COOKIE_SECURE", default="False")
CSRF_COOKIE_SECURE = _flag("CSRF_COOKIE_SECURE", default="False")

# HSTS must be zero for HTTP; a non-zero value sent over HTTP is a browser trap
SECURE_HSTS_SECONDS = 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_HSTS_PRELOAD = False
