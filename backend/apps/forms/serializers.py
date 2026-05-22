from rest_framework import serializers
from .models import ContactSubmission, ExpressionOfInterestSubmission


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["name", "email", "phone", "subject", "message"]


class ExpressionOfInterestSerializer(serializers.ModelSerializer):
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
