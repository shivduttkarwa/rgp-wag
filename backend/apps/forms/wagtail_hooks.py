from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup

from .models import ContactSubmission, ExpressionOfInterestSubmission


class ContactSubmissionViewSet(SnippetViewSet):
    model = ContactSubmission
    icon = "mail"
    menu_label = "Contact Submissions"
    menu_name = "contact_submissions"
    add_to_admin_menu = False
    list_display = ("name", "email", "phone", "subject", "submitted_at", "is_read")
    list_filter = ("is_read", "submitted_at")
    search_fields = ("name", "email", "phone", "subject", "message")


class EoiSubmissionViewSet(SnippetViewSet):
    model = ExpressionOfInterestSubmission
    icon = "doc-full-inverse"
    menu_label = "EOI Submissions"
    menu_name = "eoi_submissions"
    add_to_admin_menu = False
    list_display = (
        "first_name",
        "last_name",
        "email",
        "phone_buyer_1",
        "offer_price",
        "initial_deposit",
        "submitted_at",
        "is_read",
    )
    list_filter = ("is_read", "submitted_at")
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "phone",
        "buyer_1_full_legal_name",
        "property_address",
        "solicitor_details",
    )

    # This enables the built-in Export button directly on the EOI listing page.
    list_export = (
        "submitted_at",
        "is_read",
        "first_name",
        "last_name",
        "email",
        "phone",
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
    )
    export_headings = {
        "submitted_at": "Submitted At",
        "is_read": "Read Status",
        "first_name": "First Name",
        "last_name": "Last Name",
        "email": "Primary Email",
        "phone": "Primary Phone",
        "property_address": "Property Address",
        "buyer_1_full_legal_name": "Buyer 1 Full Legal Name",
        "address_buyer_1": "Buyer 1 Address",
        "phone_buyer_1": "Buyer 1 Phone",
        "email_buyer_1": "Buyer 1 Email",
        "buyer_2_full_legal_name": "Buyer 2 Full Legal Name",
        "address_buyer_2_if_different_to_buyer_1": "Buyer 2 Address",
        "phone_buyer_2": "Buyer 2 Phone",
        "email_buyer_2": "Buyer 2 Email",
        "offer_price": "Offer Price",
        "initial_deposit": "Initial Deposit",
        "balance_deposit": "Balance Deposit",
        "will_your_offer_be_subject_to_finance": "Subject to Finance",
        "finance_if_yes_how_many_days": "Finance Days",
        "will_your_offer_be_subject_to_building_pest": "Subject to Building & Pest",
        "building_pest_if_yes_how_many_days": "Building & Pest Days",
        "do_you_have_any_other_conditions_for_purchase": "Other Conditions",
        "if_yes_please_state_brief_details": "Other Conditions Details",
        "solicitor_details": "Solicitor Details",
        "are_you_happy_for_us_to_store_your_information_in_our_database": "Database Consent",
    }
    export_filename = "eoi-submissions"


class FormsViewSetGroup(SnippetViewSetGroup):
    menu_label = "Form Submissions"
    menu_name = "form_submissions"
    menu_icon = "mail"
    menu_order = 245
    items = (ContactSubmissionViewSet, EoiSubmissionViewSet)


register_snippet(FormsViewSetGroup)
