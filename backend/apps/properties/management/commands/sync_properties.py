"""
Management command: sync_properties

Fetches all VaultRE listings and writes them to backend/cache/properties.json.
Run via EC2 crontab once per hour — 5 endpoints × 24 = 120 calls/day.

Usage:
    python manage.py sync_properties
"""

import logging
from django.core.management.base import BaseCommand
from apps.properties.vaultre import _fetch_all_listings, save_cache, sync_staff_from_listings, CACHE_FILE

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Sync VaultRE listings to cache/properties.json (run via cron, hourly)."

    def handle(self, *args, **options):
        self.stdout.write("Fetching listings from VaultRE …")
        try:
            data = _fetch_all_listings()
            save_cache(data)
            self.stdout.write(
                self.style.SUCCESS(f"Done — {len(data)} properties saved to {CACHE_FILE}")
            )
        except Exception as exc:
            logger.exception("sync_properties failed")
            self.stderr.write(self.style.ERROR(f"Failed: {exc}"))
            raise SystemExit(1)

        try:
            self.stdout.write("Syncing staff from listings …")
            sync_staff_from_listings(data)
            self.stdout.write(self.style.SUCCESS("Staff sync complete."))
        except Exception as exc:
            logger.exception("Staff sync failed (non-fatal)")
            self.stderr.write(self.style.WARNING(f"Staff sync failed (non-fatal): {exc}"))
