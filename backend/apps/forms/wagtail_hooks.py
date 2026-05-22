import csv
from datetime import datetime

from django.contrib.admin.views.decorators import staff_member_required
from django.http import HttpResponse
from django.urls import path, reverse
from wagtail import hooks
from wagtail.admin.menu import MenuItem
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


class FormsViewSetGroup(SnippetViewSetGroup):
    menu_label = "Form Submissions"
    menu_name = "form_submissions"
    menu_icon = "mail"
    menu_order = 245
    items = (ContactSubmissionViewSet, EoiSubmissionViewSet)


register_snippet(FormsViewSetGroup)


@staff_member_required
def export_eoi_excel_view(request):
    queryset = ExpressionOfInterestSubmission.objects.order_by("-submitted_at")

    headers = [
        "Submitted At",
        "Status",
        "First Name",
        "Last Name",
        "Primary Email",
        "Primary Phone",
        "Property Address",
        "Buyer 1 Full Legal Name",
        "Buyer 1 Address",
        "Buyer 1 Phone",
        "Buyer 1 Email",
        "Buyer 2 Full Legal Name",
        "Buyer 2 Address",
        "Buyer 2 Phone",
        "Buyer 2 Email",
        "Offer Price",
        "Initial Deposit",
        "Balance Deposit",
        "Subject to Finance",
        "Finance Days",
        "Subject to Building & Pest",
        "Building & Pest Days",
        "Other Conditions",
        "Other Conditions Details",
        "Solicitor Details",
        "Database Consent",
    ]
    filename = f"eoi-submissions-{datetime.now().strftime('%Y%m%d-%H%M%S')}.csv"
    response = HttpResponse(
        content_type="text/csv; charset=utf-8",
    )
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    writer = csv.writer(response)
    writer.writerow(headers)

    for item in queryset:
        writer.writerow(
            [
                item.submitted_at.strftime("%Y-%m-%d %H:%M:%S"),
                "Read" if item.is_read else "Unread",
                item.first_name,
                item.last_name,
                item.email,
                item.phone,
                item.property_address,
                item.buyer_1_full_legal_name,
                item.address_buyer_1,
                item.phone_buyer_1,
                item.email_buyer_1,
                item.buyer_2_full_legal_name,
                item.address_buyer_2_if_different_to_buyer_1,
                item.phone_buyer_2,
                item.email_buyer_2,
                item.offer_price or "",
                item.initial_deposit or "",
                item.balance_deposit or "",
                item.will_your_offer_be_subject_to_finance,
                item.finance_if_yes_how_many_days,
                item.will_your_offer_be_subject_to_building_pest,
                item.building_pest_if_yes_how_many_days,
                item.do_you_have_any_other_conditions_for_purchase,
                item.if_yes_please_state_brief_details,
                item.solicitor_details,
                item.are_you_happy_for_us_to_store_your_information_in_our_database,
            ]
        )
    return response


@hooks.register("register_admin_urls")
def register_forms_admin_urls():
    return [
        path("forms/eoi-export/", export_eoi_excel_view, name="forms_eoi_export"),
    ]


@hooks.register("register_admin_menu_item")
def register_forms_export_menu_item():
    return MenuItem(
        "Export EOI (Excel CSV)",
        reverse("forms_eoi_export"),
        icon_name="download",
        order=246,
    )
