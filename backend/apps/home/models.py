from typing import Any

from django.db import DatabaseError, models
from wagtail.admin.panels import FieldPanel, PublishingPanel
from wagtail.fields import StreamField
from wagtail.images import get_image_model_string
from wagtail.models import Page

from .blocks import ContactPageContentStreamBlock, ContactPageHeroStreamBlock, HomePageStreamBlock


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
    subpage_types = ["home.ContactPage", "home.TeamPage"]
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
    hero_content = StreamField(
        ContactPageHeroStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Reusable internal page hero block (buttons or stats mode).",
    )

    contact_content = StreamField(
        ContactPageContentStreamBlock(),
        verbose_name="Contact Info",
        blank=True,
        use_json_field=True,
        help_text="Fixed contact information fields shown on the left side.",
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
        FieldPanel("hero_content"),
        FieldPanel("contact_content", heading="Contact Info"),
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
        hero_payload = _extract_internal_page_hero_block(self.hero_content)
        if not hero_payload:
            hero_payload = _legacy_contact_hero_payload(self)
        budget_min = self.form_budget_min
        budget_max = max(self.form_budget_max, budget_min + 1)
        budget_step = max(self.form_budget_step, 1)
        budget_default = min(max(self.form_budget_default, budget_min), budget_max)

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": hero_payload,
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


class TeamPage(Page):
    """
    CMS-managed team page for the headless frontend.
    Uses reusable internal hero block and Team Member sidebar app records.
    """

    hero_content = StreamField(
        ContactPageHeroStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Reusable internal page hero block (buttons or stats mode).",
    )
    team_section_eyebrow = models.CharField(max_length=120, default="Our People")
    team_section_title_line_1 = models.CharField(max_length=255, default="The Minds")
    team_section_title_line_2 = models.CharField(max_length=255, default="[gold]Behind[/gold] Every Deal")
    team_section_subtitle = models.TextField(
        default=(
            "A curated ensemble of creative minds and industry veterans — each "
            "bringing unmatched expertise to every client engagement."
        )
    )

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []
    max_count = 1

    content_panels = Page.content_panels + [
        FieldPanel("hero_content"),
        FieldPanel("team_section_eyebrow"),
        FieldPanel("team_section_title_line_1"),
        FieldPanel("team_section_title_line_2"),
        FieldPanel("team_section_subtitle"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    class Meta:
        verbose_name = "Team Page"

    def get_api_representation(self) -> dict[str, Any]:
        hero_payload = _extract_internal_page_hero_block(self.hero_content)
        if not hero_payload:
            hero_payload = _default_team_hero_payload()

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": hero_payload,
            "team_section": {
                "eyebrow": self.team_section_eyebrow,
                "title_line_1": self.team_section_title_line_1,
                "title_line_2": self.team_section_title_line_2,
                "subtitle": self.team_section_subtitle,
            },
            "members": _get_active_team_member_items(),
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


def _default_team_hero_payload() -> dict[str, Any]:
    return {
        "title_line_1": "Meet Our",
        "title_line_2": "Expert [gold]Team[/gold]",
        "subtitle": (
            "A curated ensemble of creative minds and industry veterans shaping "
            "the future of luxury real estate."
        ),
        "background_image": None,
        "background_image_url": "images/about-hero.jpg",
        "show_video": False,
        "background_video_url": "",
        "mode": "buttons",
        "buttons": [
            {
                "label": "Book a Consultation",
                "href": "/contact",
                "style": "gold",
                "open_in_new_tab": False,
            }
        ],
        "stats": [],
    }


def _get_active_team_member_items() -> list[dict[str, Any]]:
    try:
        from apps.team.models import TeamMember
    except Exception:
        return []

    try:
        queryset = (
            TeamMember.objects.filter(is_active=True)
            .select_related("portrait_image")
            .order_by("order", "id")
        )
        return [member.to_api_item() for member in queryset]
    except DatabaseError:
        return []


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


def _legacy_contact_hero_payload(page: ContactPage) -> dict[str, Any]:
    buttons: list[dict[str, Any]] = []
    if page.hero_primary_cta_label.strip():
        buttons.append(
            {
                "label": page.hero_primary_cta_label,
                "href": page.hero_primary_cta_href,
                "style": "gold",
                "open_in_new_tab": False,
            }
        )
    if page.hero_secondary_cta_label.strip():
        buttons.append(
            {
                "label": page.hero_secondary_cta_label,
                "href": page.hero_secondary_cta_href,
                "style": "blue",
                "open_in_new_tab": False,
            }
        )

    return {
        "title_line_1": page.hero_title_line_1,
        "title_line_2": page.hero_title_line_2,
        "subtitle": page.hero_subtitle,
        "background_image": _serialise_block_value(page.hero_background_image),
        "background_image_url": page.hero_background_image_url,
        "show_video": False,
        "background_video_url": "",
        "mode": "buttons" if buttons else "none",
        "buttons": buttons,
        "stats": [],
    }


def _extract_internal_page_hero_block(hero_content) -> dict[str, Any] | None:
    for block in hero_content:
        if block.block_type == "internal_page_hero":
            hero = _serialise_block_value(block.value)
            mode = hero.get("mode") if isinstance(hero, dict) else "none"
            if mode not in {"none", "buttons", "stats"}:
                mode = "none"
            if isinstance(hero, dict):
                hero["mode"] = mode
                hero["buttons"] = hero.get("buttons") or []
                hero["stats"] = hero.get("stats") or []
            return hero if isinstance(hero, dict) else None
    return None


def _extract_contact_info_block(contact_content) -> dict[str, Any]:
    for block in contact_content:
        if block.block_type == "contact_info":
            raw = _serialise_block_value(block.value)
            if not isinstance(raw, dict):
                break

            # Backward compatibility: map legacy flexible rows into fixed fields.
            legacy_items = raw.get("items") or []
            legacy_map: dict[str, str] = {}
            if isinstance(legacy_items, list):
                for item in legacy_items:
                    if not isinstance(item, dict):
                        continue
                    label = str(item.get("label", "")).strip().lower()
                    value = str(item.get("value", "")).strip()
                    if not label or not value:
                        continue
                    legacy_map[label] = value

            return {
                "title": raw.get("title") or f"{raw.get('headline', '')} {raw.get('headline_em', '')}".strip() or "Let's Talk Appraisal.",
                "tagline": raw.get("tagline")
                or (
                    "Whether you're buying, selling, or investing — our advisors are ready "
                    "to guide you through every step."
                ),
                "contact_number": raw.get("contact_number")
                or legacy_map.get("contact number")
                or legacy_map.get("phone")
                or "0450 009 291",
                "email": raw.get("email")
                or legacy_map.get("email")
                or "admin@realgoldproperties.com.au",
                "address": raw.get("address")
                or legacy_map.get("address")
                or legacy_map.get("visit")
                or "Forest Lake, Brisbane QLD 4078",
                "working_hours": raw.get("working_hours")
                or " · ".join(
                    part
                    for part in [
                        str(raw.get("office_days", "")).strip(),
                        str(raw.get("office_time", "")).strip(),
                    ]
                    if part
                )
                or "All days · 09:00 – 18:00",
                "quote_text": raw.get("quote_text")
                or (
                    '"Real estate is not just a transaction — it is the beginning of a life '
                    'lived better."'
                ),
                "quote_author": raw.get("quote_author") or "— Our Promise",
            }
    return {
        "title": "Let's Talk Appraisal.",
        "tagline": (
            "Whether you're buying, selling, or investing — our advisors are ready "
            "to guide you through every step."
        ),
        "contact_number": "0450 009 291",
        "email": "admin@realgoldproperties.com.au",
        "address": "Forest Lake, Brisbane QLD 4078",
        "working_hours": "All days · 09:00 – 18:00",
        "quote_text": (
            '"Real estate is not just a transaction — it is the beginning of a life '
            'lived better."'
        ),
        "quote_author": "— Our Promise",
    }
