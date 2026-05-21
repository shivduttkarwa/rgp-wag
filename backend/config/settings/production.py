from .base import *  # noqa: F401, F403
from decouple import config

def env_flag(name: str, default: str = "False") -> bool:
    return str(config(name, default=default)).strip().lower() in {
        "1",
        "true",
        "yes",
        "on",
    }


DEBUG = env_flag("DEBUG", default="False")

ALLOWED_HOSTS = list(dict.fromkeys(ALLOWED_HOSTS + [".onrender.com"]))  # noqa: F405

# Enforce HTTPS
SECURE_SSL_REDIRECT = env_flag("SECURE_SSL_REDIRECT", default="True")
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = config("EMAIL_HOST", default="")
EMAIL_PORT = config("EMAIL_PORT", default=587, cast=int)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL", default="noreply@realgoldproperties.com.au")
