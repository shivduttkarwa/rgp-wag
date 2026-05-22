from __future__ import annotations

from uuid import uuid4

from django.db import migrations


def split_services_cta_block(apps, schema_editor):
    HomePage = apps.get_model("home", "HomePage")

    for page in HomePage.objects.all():
        body = getattr(page, "body", None)
        raw_data = list(getattr(body, "raw_data", []) or [])
        if not raw_data:
            continue

        has_cta_block = any(
            isinstance(block, dict) and block.get("type") == "cta"
            for block in raw_data
        )
        changed = False

        for index, block in enumerate(raw_data):
            if not isinstance(block, dict) or block.get("type") != "services":
                continue

            services_value = block.get("value")
            if not isinstance(services_value, dict):
                continue

            legacy_cta = {
                "eyebrow": services_value.pop("cta_eyebrow", None),
                "title": services_value.pop("cta_title", None),
                "title_em": services_value.pop("cta_title_em", None),
                "text": services_value.pop("cta_text", None),
                "primary": services_value.pop("cta_primary", None),
                "secondary": services_value.pop("cta_secondary", None),
            }
            changed = changed or any(
                value not in (None, "", {}, [])
                for value in legacy_cta.values()
            )

            if has_cta_block:
                continue

            if not any(value not in (None, "", {}, []) for value in legacy_cta.values()):
                continue

            raw_data.insert(
                index + 1,
                {
                    "type": "cta",
                    "id": str(uuid4()),
                    "value": {
                        "eyebrow": legacy_cta["eyebrow"] or "Need Guidance?",
                        "title": legacy_cta["title"] or "Not Sure Where to",
                        "title_em": legacy_cta["title_em"] or "Start?",
                        "text": legacy_cta["text"]
                        or "Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.",
                        "primary": legacy_cta["primary"] or {"label": "", "href": ""},
                        "secondary": legacy_cta["secondary"] or {"label": "", "href": ""},
                    },
                },
            )
            has_cta_block = True
            changed = True

        if changed:
            page.body = raw_data
            page.save(update_fields=["body"])


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0009_alter_homepage_body"),
    ]

    operations = [
        migrations.RunPython(split_services_cta_block, migrations.RunPython.noop),
    ]
