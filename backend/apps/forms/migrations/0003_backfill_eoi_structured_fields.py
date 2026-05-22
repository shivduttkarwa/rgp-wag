from django.db import migrations


LEGACY_MESSAGE_FIELD_MAP = {
    "property_address": "property_address",
    "buyer_1_full_legal_name": "buyer_1_full_legal_name",
    "address_buyer_1": "address_buyer_1",
    "phone_buyer_1": "phone_buyer_1",
    "email_buyer_1": "email_buyer_1",
    "buyer_2_full_legal_name": "buyer_2_full_legal_name",
    "address_buyer_2_if_different_to_buyer_1": "address_buyer_2_if_different_to_buyer_1",
    "phone_buyer_2": "phone_buyer_2",
    "email_buyer_2": "email_buyer_2",
    "offer_price": "offer_price",
    "initial_deposit": "initial_deposit",
    "balance_deposit": "balance_deposit",
    "will_your_offer_be_subject_to_finance": "will_your_offer_be_subject_to_finance",
    "finance_if_yes_how_many_days": "finance_if_yes_how_many_days",
    "will_your_offer_be_subject_to_building_pest": "will_your_offer_be_subject_to_building_pest",
    "building_pest_if_yes_how_many_days": "building_pest_if_yes_how_many_days",
    "do_you_have_any_other_conditions_for_purchase": "do_you_have_any_other_conditions_for_purchase",
    "if_yes_please_state_brief_details": "if_yes_please_state_brief_details",
    "solicitor_details": "solicitor_details",
    "are_you_happy_for_us_to_store_your_information_in_our_database": "are_you_happy_for_us_to_store_your_information_in_our_database",
}


def parse_legacy_message(message: str) -> dict[str, str]:
    parsed: dict[str, str] = {}
    for line in (message or "").splitlines():
        if ":" not in line:
            continue
        raw_key, raw_value = line.split(":", 1)
        key = raw_key.strip()
        value = raw_value.strip()
        if not key or not value:
            continue
        mapped = LEGACY_MESSAGE_FIELD_MAP.get(key)
        if mapped:
            parsed[mapped] = value
    return parsed


def backfill_structured_eoi_fields(apps, schema_editor):
    Submission = apps.get_model("rgp_forms", "ExpressionOfInterestSubmission")
    for item in Submission.objects.all():
        parsed = parse_legacy_message(item.message or "")
        if not parsed:
            continue

        changed = False
        for target, value in parsed.items():
            if not getattr(item, target):
                setattr(item, target, value)
                changed = True

        if not item.property_type and item.property_address:
            item.property_type = item.property_address
            changed = True
        if not item.budget and item.offer_price is not None:
            item.budget = str(item.offer_price)
            changed = True
        if not item.timeline and item.finance_if_yes_how_many_days:
            item.timeline = item.finance_if_yes_how_many_days
            changed = True
        if not item.phone and item.phone_buyer_1:
            item.phone = item.phone_buyer_1
            changed = True
        if not item.email and item.email_buyer_1:
            item.email = item.email_buyer_1
            changed = True

        if item.buyer_1_full_legal_name and (
            not item.first_name or item.first_name.lower() == "unknown"
        ):
            parts = item.buyer_1_full_legal_name.split()
            if parts:
                item.first_name = parts[0]
                item.last_name = " ".join(parts[1:]) if len(parts) > 1 else item.last_name
                changed = True

        if changed:
            item.save()


class Migration(migrations.Migration):

    dependencies = [
        ("rgp_forms", "0002_expressionofinterestsubmission_address_buyer_1_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill_structured_eoi_fields, migrations.RunPython.noop),
    ]
