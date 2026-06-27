from datetime import datetime, timezone

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.properties.vaultre import post_enquiry
from .serializers import ContactFormSerializer, ExpressionOfInterestSerializer, PropertyEnquirySerializer
from .spam import is_honeypot_filled, verify_recaptcha_v2


_CAPTCHA_ERROR = {"detail": "reCAPTCHA verification failed. Please try again."}
_SILENT_OK = {"detail": "Message received. We'll be in touch soon."}


def _spam_check(request) -> "Response | None":
    """Return a Response to short-circuit if the request looks like spam, else None."""
    if is_honeypot_filled(request.data):
        return Response(_SILENT_OK, status=status.HTTP_201_CREATED)
    if not verify_recaptcha_v2(request.data.get("recaptcha_token", "")):
        return Response(_CAPTCHA_ERROR, status=status.HTTP_400_BAD_REQUEST)
    return None


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _enquiry_payload_for_property(instance) -> dict:
    return {
        "enquiryDate": _now_iso(),
        "subject": f"Property Enquiry — {instance.property_title or instance.property_id}",
        "body": instance.message or "",
        "originalId": str(instance.id),
        "propertyReference": instance.property_id or "",
        "source": "OFFICEWEBSITE",
        "email": instance.email,
        "fullName": instance.name,
        "mobile": instance.phone or "",
    }


def _enquiry_payload_for_contact(instance) -> dict:
    return {
        "enquiryDate": _now_iso(),
        "subject": instance.subject or "Website Contact",
        "body": instance.message or "",
        "originalId": str(instance.id),
        "source": "OFFICEWEBSITE",
        "email": instance.email,
        "fullName": instance.name,
        "mobile": instance.phone or "",
    }


def _enquiry_payload_for_eoi(instance) -> dict:
    def _money(val) -> str:
        return f"${val:,.2f}" if val is not None else "—"

    def _line(label: str, val: str) -> str:
        return f"{label}: {val}" if val else ""

    sections = [
        "EXPRESSION OF INTEREST",
        "=" * 40,
        _line("Property", instance.property_address),
        "",
        "BUYER 1",
        _line("Name", instance.buyer_1_full_legal_name),
        _line("Address", instance.address_buyer_1),
        _line("Phone", instance.phone_buyer_1),
        _line("Email", instance.email_buyer_1),
        "",
        "BUYER 2",
        _line("Name", instance.buyer_2_full_legal_name),
        _line("Address", instance.address_buyer_2_if_different_to_buyer_1),
        _line("Phone", instance.phone_buyer_2),
        _line("Email", instance.email_buyer_2),
        "",
        "OFFER",
        _line("Offer Price", _money(instance.offer_price)),
        _line("Initial Deposit", _money(instance.initial_deposit)),
        _line("Balance Deposit", _money(instance.balance_deposit)),
        _line("Subject to Finance", instance.will_your_offer_be_subject_to_finance),
        _line("Finance Days", instance.finance_if_yes_how_many_days),
        _line("Subject to Building & Pest", instance.will_your_offer_be_subject_to_building_pest),
        _line("Building & Pest Days", instance.building_pest_if_yes_how_many_days),
        _line("Other Conditions", instance.do_you_have_any_other_conditions_for_purchase),
        _line("Condition Details", instance.if_yes_please_state_brief_details),
        "",
        "SOLICITOR",
        instance.solicitor_details or "—",
        "",
        _line("Happy to store info in database", instance.are_you_happy_for_us_to_store_your_information_in_our_database),
    ]

    body = "\n".join(line for line in sections if line is not None)

    return {
        "enquiryDate": _now_iso(),
        "subject": f"Expression of Interest — {instance.property_address or instance.property_type or 'Property'}",
        "body": body,
        "originalId": str(instance.id),
        "source": "OFFICEWEBSITE",
        "email": instance.email or instance.email_buyer_1 or "",
        "fullName": f"{instance.first_name} {instance.last_name}".strip(),
        "mobile": instance.phone or instance.phone_buyer_1 or "",
    }


class ContactFormAPIView(APIView):
    """POST /api/forms/contact/"""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request) -> Response:
        if (early := _spam_check(request)):
            return early
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            post_enquiry(_enquiry_payload_for_contact(instance))
            return Response({"detail": "Message received. We'll be in touch soon."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpressionOfInterestAPIView(APIView):
    """POST /api/forms/eoi/"""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request) -> Response:
        if (early := _spam_check(request)):
            return early
        serializer = ExpressionOfInterestSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            post_enquiry(_enquiry_payload_for_eoi(instance))
            return Response({"detail": "Expression of interest received. We'll be in touch soon."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyEnquiryAPIView(APIView):
    """POST /api/forms/property-enquiry/"""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request: Request) -> Response:
        if (early := _spam_check(request)):
            return early
        serializer = PropertyEnquirySerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            post_enquiry(_enquiry_payload_for_property(instance))
            return Response({"detail": "Enquiry received. We'll be in touch soon."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
