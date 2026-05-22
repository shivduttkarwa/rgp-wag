from django.db import migrations


LEGACY_KEYS = {
    "property_address",
    "buyer_1_full_legal_name",
    "address_buyer_1",
    "phone_buyer_1",
    "email_buyer_1",
    "buyer_2_full_legal_name",
    "address_buyer_2_if_different_to_buyer_1",
    "phone_buyer_2",
    "email_buyer_2",
    "offer_price",
    "initial_deposit",
    "balance_deposit",
    "will_your_offer_be_subject_to_finance",
    "finance_if_yes_how_many_days",
    "will_your_offer_be_subject_to_building_pest",
    "building_pest_if_yes_how_many_days",
    "do_you_have_any_other_conditions_for_purchase",
    "if_yes_please_state_brief_details",
    "solicitor_details",
    "are_you_happy_for_us_to_store_your_information_in_our_database",
}


def should_clear_blob(message: str) -> bool:
    for line in (message or "").splitlines():
        if ":" not in line:
            continue
        key = line.split(":", 1)[0].strip()
        if key in LEGACY_KEYS:
            return True
    return False


def clear_legacy_message_blob(apps, schema_editor):
    Submission = apps.get_model("rgp_forms", "ExpressionOfInterestSubmission")
    for item in Submission.objects.exclude(message=""):
        if should_clear_blob(item.message or ""):
            item.message = ""
            item.save(update_fields=["message"])


class Migration(migrations.Migration):

    dependencies = [
        ("rgp_forms", "0003_backfill_eoi_structured_fields"),
    ]

    operations = [
        migrations.RunPython(clear_legacy_message_blob, migrations.RunPython.noop),
    ]
