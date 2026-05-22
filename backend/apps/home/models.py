from typing import Any

from django.db import DatabaseError, models
from wagtail.admin.panels import FieldPanel, PublishingPanel
from wagtail.fields import StreamField
from wagtail.images import get_image_model_string
from wagtail.models import Page

from .blocks import ContactPageContentStreamBlock, HomePageStreamBlock


class HomePage(Page):
    """
    The main home page. Editors build the page section by section using
    StreamField blocks — add, remove, or reorder any section from the CMS.
    """

    body = StreamField(
        HomePageStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add sections to build the home page. Drag to reorder.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    # Only allow one home page under the root
    parent_page_types = ["wagtailcore.Page"]
    subpage_types = ["home.ContactPage"]
    max_count = 1

    class Meta:
        verbose_name = "Home Page"

    def get_api_representation(self) -> dict:
        """Returns a clean dict representation for the headless API."""
        sections = {}
        for block in self.body:
            sections[block.block_type] = _serialise_block_value(block.value)

        _normalise_services_and_cta_sections(sections)
        _inject_cms_video_testimonials(sections)

        return {
            "id":         self.pk,
            "title":      self.title,
            "slug":       self.slug,
            "sections":   sections,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
        }


class ContactPage(Page):
    """
    CMS-managed contact page for the headless frontend.
    Left-side contact content is controlled by a reusable StreamField block.
    """

    hero_title_line_1 = models.CharField(max_length=255, default="Get In [gold]Touch[/gold]")
    hero_title_line_2 = models.CharField(max_length=255, default="[amber]We're[/amber] Here")
    hero_subtitle = models.TextField(
        default="Our team is ready to guide you — from first enquiry to final key.",
    )
    hero_background_image = models.ForeignKey(
        get_image_model_string(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    hero_background_image_url = models.CharField(max_length=500, default="images/contact-hero.jpg", blank=True)
    hero_primary_cta_label = models.CharField(max_length=100, default="Call Us")
    hero_primary_cta_href = models.CharField(max_length=255, default="tel:+61450009291")
    hero_secondary_cta_label = models.CharField(max_length=100, default="Email Us")
    hero_secondary_cta_href = models.CharField(max_length=255, default="mailto:admin@realgoldproperties.com.au")

    contact_content = StreamField(
        ContactPageContentStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Left-side contact information block.",
    )

    form_eyebrow = models.CharField(max_length=120, default="Begin your enquiry")
    form_heading_line_1 = models.CharField(max_length=255, default="Tell us what you're")
    form_heading_line_2 = models.CharField(max_length=255, default="looking for.")
    form_subtitle = models.TextField(
        default="Fill in the details and a specialist will respond within one business day.",
    )
    form_intent_options = models.CharField(
        max_length=500,
        blank=True,
        default="Buy,Sell,Rent,Invest,Off-Plan,Valuation",
        help_text="Comma-separated intent chips shown above the form.",
    )
    form_property_type_options = models.CharField(
        max_length=600,
        blank=True,
        default="Apartment,Villa / Townhouse,Penthouse,Commercial,Plot / Land",
        help_text="Comma-separated property types shown in the dropdown.",
    )
    form_budget_min = models.PositiveIntegerField(default=500000)
    form_budget_max = models.PositiveIntegerField(default=20000000)
    form_budget_step = models.PositiveIntegerField(default=500000)
    form_budget_default = models.PositiveIntegerField(default=5000000)
    form_submit_note = models.CharField(max_length=180, default="We respond within one business day.")

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []
    max_count = 1

    content_panels = Page.content_panels + [
        FieldPanel("hero_title_line_1"),
        FieldPanel("hero_title_line_2"),
        FieldPanel("hero_subtitle"),
        FieldPanel("hero_background_image"),
        FieldPanel("hero_background_image_url"),
        FieldPanel("hero_primary_cta_label"),
        FieldPanel("hero_primary_cta_href"),
        FieldPanel("hero_secondary_cta_label"),
        FieldPanel("hero_secondary_cta_href"),
        FieldPanel("contact_content"),
        FieldPanel("form_eyebrow"),
        FieldPanel("form_heading_line_1"),
        FieldPanel("form_heading_line_2"),
        FieldPanel("form_subtitle"),
        FieldPanel("form_intent_options"),
        FieldPanel("form_property_type_options"),
        FieldPanel("form_budget_min"),
        FieldPanel("form_budget_max"),
        FieldPanel("form_budget_step"),
        FieldPanel("form_budget_default"),
        FieldPanel("form_submit_note"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    class Meta:
        verbose_name = "Contact Page"

    def get_api_representation(self) -> dict[str, Any]:
        contact_info = _extract_contact_info_block(self.contact_content)
        budget_min = self.form_budget_min
        budget_max = max(self.form_budget_max, budget_min + 1)
        budget_step = max(self.form_budget_step, 1)
        budget_default = min(max(self.form_budget_default, budget_min), budget_max)

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": {
                "title_line_1": self.hero_title_line_1,
                "title_line_2": self.hero_title_line_2,
                "subtitle": self.hero_subtitle,
                "background_image": _serialise_block_value(self.hero_background_image),
                "background_image_url": self.hero_background_image_url,
                "primary_cta_label": self.hero_primary_cta_label,
                "primary_cta_href": self.hero_primary_cta_href,
                "secondary_cta_label": self.hero_secondary_cta_label,
                "secondary_cta_href": self.hero_secondary_cta_href,
            },
            "contact_info": contact_info,
            "form": {
                "eyebrow": self.form_eyebrow,
                "heading_line_1": self.form_heading_line_1,
                "heading_line_2": self.form_heading_line_2,
                "subtitle": self.form_subtitle,
                "intent_options": _parse_csv_options(self.form_intent_options),
                "property_type_options": _parse_csv_options(self.form_property_type_options),
                "budget_min": budget_min,
                "budget_max": budget_max,
                "budget_step": budget_step,
                "budget_default": budget_default,
                "submit_note": self.form_submit_note,
            },
        }


def _normalise_services_and_cta_sections(sections: dict[str, Any]) -> None:
    """
    Split legacy embedded CTA fields out of the `services` section into a
    dedicated `cta` section payload for frontend compatibility.
    """
    services_section = sections.get("services")
    if not isinstance(services_section, dict):
        return

    legacy_cta = {
        "eyebrow": services_section.pop("cta_eyebrow", None),
        "title": services_section.pop("cta_title", None),
        "title_em": services_section.pop("cta_title_em", None),
        "text": services_section.pop("cta_text", None),
        "primary": services_section.pop("cta_primary", None),
        "secondary": services_section.pop("cta_secondary", None),
    }

    existing_cta = sections.get("cta")
    if isinstance(existing_cta, dict):
        return

    has_legacy_cta = any(
        value not in (None, "", {}, [])
        for value in legacy_cta.values()
    )
    if not has_legacy_cta:
        return

    sections["cta"] = {
        "eyebrow": legacy_cta["eyebrow"] or "Need Guidance?",
        "title": legacy_cta["title"] or "Not Sure Where to",
        "title_em": legacy_cta["title_em"] or "Start?",
        "text": legacy_cta["text"] or "Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.",
        "primary": legacy_cta["primary"] or {"label": "", "href": ""},
        "secondary": legacy_cta["secondary"] or {"label": "", "href": ""},
        "use_video": True,
        "background_image": None,
        "background_image_url": "images/hero1.jpg",
        "background_video_url": "vids/cta-vid.mp4",
        "video_poster_image": None,
        "video_poster_image_url": "images/hero1.jpg",
        "min_height": "100vh",
    }


def _inject_cms_video_testimonials(sections: dict[str, Any]) -> None:
    """
    Replace HomePage video testimonial items with active snippet entries, if any.
    Falls back to manually-entered StreamField items when no snippet entries exist.
    """
    video_section = sections.get("video_testimonials")
    if not isinstance(video_section, dict):
        return

    cms_items = _get_active_video_testimonial_items()
    if cms_items:
        video_section["items"] = cms_items


def _get_active_video_testimonial_items() -> list[dict[str, Any]]:
    try:
        from apps.testimonials.models import VideoTestimonial
    except Exception:
        return []

    try:
        queryset = (
            VideoTestimonial.objects.filter(is_active=True)
            .select_related("poster_image")
            .order_by("order", "id")
        )
        return [item.to_home_item() for item in queryset]
    except DatabaseError:
        # Gracefully fallback to manually entered StreamField testimonials.
        return []


def _serialise_block_value(value):
    """
    Recursively convert a StreamField block value to plain Python types
    so it can be JSON-serialised by DRF.
    """
    from wagtail.blocks import StructValue
    from wagtail.images.models import AbstractImage
    from apps.properties.models import Property

    if isinstance(value, AbstractImage):
        return {
            "url":    value.file.url if value.file else None,
            "width":  value.width,
            "height": value.height,
            "alt":    value.title,
        }

    if isinstance(value, Property):
        card_image_url = value.card_image.file.url if value.card_image and getattr(value.card_image, "file", None) else ""
        return {
            "id": value.pk,
            "slug": value.slug,
            "category": value.listing_category,
            "title": value.title,
            "location": f"{value.city}, {value.state}",
            "price": float(value.price or 0),
            "soldPrice": float(value.sold_price) if value.sold_price is not None else None,
            "image": card_image_url,
            "beds": value.bedrooms,
            "baths": value.bathrooms,
            "sqft": value.area_sqft,
            "garage": value.garages,
            "features": [feature.title for feature in value.features.all()],
            "badge": value.badge or "",
            "isNew": value.is_new,
            "views": value.views,
            "soldDate": value.sold_date_label or "",
            "daysOnMarket": value.days_on_market,
            "deposit": float(value.deposit) if value.deposit is not None else None,
            "minLease": value.min_lease or "",
        }

    if isinstance(value, StructValue):
        return {key: _serialise_block_value(val) for key, val in value.items()}

    if isinstance(value, list):
        return [_serialise_block_value(item) for item in value]

    if isinstance(value, (str, int, float, bool)) or value is None:
        return value

    # Fallback: try iterating (handles StreamValue etc.)
    try:
        return [_serialise_block_value(item) for item in value]
    except TypeError:
        return str(value)


def _parse_csv_options(raw: str) -> list[str]:
    return [item.strip() for item in (raw or "").split(",") if item.strip()]


def _extract_contact_info_block(contact_content) -> dict[str, Any]:
    for block in contact_content:
        if block.block_type == "contact_info":
            return _serialise_block_value(block.value)
    return {
        "headline": "Let's Talk",
        "headline_em": "Appraisal.",
        "tagline": (
            "Whether you're buying, selling, or investing — our advisors are ready "
            "to guide you through every step."
        ),
        "items": [
            {"label": "Phone", "value": "0450 009 291", "href": "tel:+61450009291"},
            {
                "label": "Email",
                "value": "admin@realgoldproperties.com.au",
                "href": "mailto:admin@realgoldproperties.com.au",
            },
            {"label": "Visit", "value": "Forest Lake, Brisbane QLD 4078", "href": ""},
        ],
        "office_label": "Office Hours",
        "office_days": "All days",
        "office_time": "09:00 – 18:00",
        "quote_text": (
            '"Real estate is not just a transaction — it is the beginning of a life '
            'lived better."'
        ),
        "quote_author": "— Our Promise",
    }
