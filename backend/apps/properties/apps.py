import os

from django.apps import AppConfig


class PropertiesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.properties"
    label = "properties"

    def ready(self) -> None:
        # RUN_MAIN='true' in the actual dev-server child process; unset in
        # production (gunicorn). Defaulting to 'true' means the thread always
        # starts in production, while the reloader watcher process is skipped.
        if os.environ.get("RUN_MAIN", "true") == "true":
            from apps.properties.vaultre import start_background_refresh
            start_background_refresh()
