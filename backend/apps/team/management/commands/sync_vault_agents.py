"""
Management command: sync_vault_agents

Pulls contactStaff from all VaultRE property listings and upserts them
into the TeamMember table using the agent's VaultRE id embedded in the slug
(vault-<id>) as the stable lookup key.

Usage:
    python manage.py sync_vault_agents
    python manage.py sync_vault_agents --dry-run
"""

import logging
from django.core.management.base import BaseCommand
from django.utils.text import slugify

logger = logging.getLogger(__name__)


def _collect_agents() -> list[dict]:
    """Return unique VaultRE contactStaff across all property listings."""
    import requests
    from django.conf import settings

    headers = {
        "X-Api-Key": settings.VAULTRE_API_KEY,
        "Authorization": f"Bearer {settings.VAULTRE_ACCESS_TOKEN}",
        "Accept": "application/json",
    }

    BASE = "https://ap-southeast-2.api.vaultre.com.au/api/v1.3"
    PATHS = [
        "residential/sale",
        "residential/lease",
        "land/sale",
    ]

    seen: set = set()
    agents: list[dict] = []

    for path in PATHS:
        try:
            r = requests.get(
                f"{BASE}/properties/{path}",
                headers=headers,
                params={"published": "true"},
                timeout=15,
            )
            r.raise_for_status()
            items = r.json().get("items", [])
        except Exception as exc:
            logger.warning("VaultRE /%s failed: %s", path, exc)
            continue

        for prop in items:
            for a in prop.get("contactStaff", []):
                aid = a.get("id")
                if not aid or aid in seen:
                    continue
                if not a.get("showOnWeb"):
                    continue
                # Skip company/office entries — their firstName contains spaces
                first = (a.get("firstName") or "").strip()
                if not first or " " in first:
                    continue
                seen.add(aid)
                photo = a.get("photo") or {}
                phones = a.get("phoneNumbers") or []
                agents.append({
                    "vault_id": aid,
                    "name": f'{a.get("firstName", "")} {a.get("lastName", "")}'.strip(),
                    "position": (a.get("position") or "").strip(),
                    "email": (a.get("email") or "").strip(),
                    "phone": phones[0].get("number", "") if phones else "",
                    "photo_url": photo.get("thumb_360", ""),
                })

    return agents


class Command(BaseCommand):
    help = "Sync VaultRE contactStaff agents into TeamMember records."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would change without writing to the DB.",
        )

    def handle(self, *args, **options):
        from apps.team.models import TeamMember

        dry = options["dry_run"]
        agents = _collect_agents()

        if not agents:
            self.stderr.write("No agents found from VaultRE.")
            return

        self.stdout.write(f"Found {len(agents)} agent(s) from VaultRE.")

        for idx, a in enumerate(agents):
            slug = f"vault-{a['vault_id']}"
            defaults = {
                "name": a["name"],
                "role": a["position"] or "Property Specialist",
                "email": a["email"],
                "phone": a["phone"],
                "portrait_image_url": a["photo_url"],
                "order": idx,
                "is_active": True,
            }

            if dry:
                existing = TeamMember.objects.filter(slug=slug).first()
                action = "UPDATE" if existing else "CREATE"
                self.stdout.write(f"  [{action}] {slug} -> {a['name']} ({defaults['role']})")
                continue

            obj, created = TeamMember.objects.update_or_create(
                slug=slug,
                defaults=defaults,
            )
            action = "Created" if created else "Updated"
            self.stdout.write(f"  {action}: {obj.name} (slug={slug})")

        if not dry:
            self.stdout.write(self.style.SUCCESS("Done."))
