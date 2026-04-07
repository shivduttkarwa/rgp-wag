from .base import *  # noqa: F401, F403
from decouple import config

DEBUG = True

INSTALLED_APPS += ["django_extensions"]  # noqa: F405

# Relax CORS in dev — allow all origins
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = []

INTERNAL_IPS = ["127.0.0.1"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
