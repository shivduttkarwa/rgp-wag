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
    list_display = ("first_name", "last_name", "email", "phone", "submitted_at", "is_read")
    list_filter = ("is_read", "submitted_at")
    search_fields = ("first_name", "last_name", "email", "phone", "message")


class FormsViewSetGroup(SnippetViewSetGroup):
    menu_label = "Form Submissions"
    menu_name = "form_submissions"
    menu_icon = "mail"
    menu_order = 245
    items = (ContactSubmissionViewSet, EoiSubmissionViewSet)


register_snippet(FormsViewSetGroup)
