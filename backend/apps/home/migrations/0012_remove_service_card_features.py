from __future__ import annotations

from django.db import migrations


def remove_service_card_features(apps, schema_editor):
    HomePage = apps.get_model("home", "HomePage")

    for page in HomePage.objects.all():
        body = getattr(page, "body", None)
        raw_data = list(getattr(body, "raw_data", []) or [])
        if not raw_data:
            continue

        changed = False

        for block in raw_data:
            if not isinstance(block, dict) or block.get("type") != "services":
                continue

            services_section = block.get("value")
            if not isinstance(services_section, dict):
                continue

            service_cards = services_section.get("services")
            if not isinstance(service_cards, list):
                continue

            for service_card in service_cards:
                if not isinstance(service_card, dict):
                    continue
                service_value = service_card.get("value")
                if not isinstance(service_value, dict):
                    continue
                if "features" in service_value:
                    service_value.pop("features", None)
                    changed = True

        if changed:
            page.body = raw_data
            page.save(update_fields=["body"])


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0011_alter_homepage_body"),
    ]

    operations = [
        migrations.RunPython(remove_service_card_features, migrations.RunPython.noop),
    ]
