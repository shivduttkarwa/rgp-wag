from rest_framework import serializers
from .models import ContactSubmission, ExpressionOfInterestSubmission


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["name", "email", "phone", "subject", "message"]


class ExpressionOfInterestSerializer(serializers.ModelSerializer):
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

    class Meta:
        model = ExpressionOfInterestSubmission
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "property_type",
            "budget",
            "timeline",
            "message",
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
        ]

    @staticmethod
    def _parse_legacy_message_blob(message: str) -> dict[str, str]:
        parsed: dict[str, str] = {}
        if not message:
            return parsed

        for line in message.splitlines():
            if ":" not in line:
                continue
            raw_key, raw_value = line.split(":", 1)
            key = raw_key.strip()
            value = raw_value.strip()
            if not key or not value:
                continue
            mapped = ExpressionOfInterestSerializer.LEGACY_MESSAGE_FIELD_MAP.get(key)
            if mapped:
                parsed[mapped] = value
        return parsed

    def validate(self, attrs):
        legacy_values = self._parse_legacy_message_blob(str(attrs.get("message", "") or ""))
        for field_name, value in legacy_values.items():
            if not attrs.get(field_name):
                attrs[field_name] = value

        # Keep summary fields in sync with structured fields.
        if not attrs.get("property_type") and attrs.get("property_address"):
            attrs["property_type"] = attrs["property_address"]
        if not attrs.get("budget") and attrs.get("offer_price") is not None:
            attrs["budget"] = str(attrs["offer_price"])
        if not attrs.get("timeline") and attrs.get("finance_if_yes_how_many_days"):
            attrs["timeline"] = attrs["finance_if_yes_how_many_days"]
        if not attrs.get("phone") and attrs.get("phone_buyer_1"):
            attrs["phone"] = attrs["phone_buyer_1"]
        if not attrs.get("email") and attrs.get("email_buyer_1"):
            attrs["email"] = attrs["email_buyer_1"]

        buyer_1_name = (attrs.get("buyer_1_full_legal_name") or "").strip()
        if buyer_1_name and (
            not attrs.get("first_name") or str(attrs.get("first_name")).lower() == "unknown"
        ):
            parts = buyer_1_name.split()
            attrs["first_name"] = parts[0]
            attrs["last_name"] = " ".join(parts[1:]) if len(parts) > 1 else attrs.get("last_name", "")

        return attrs
