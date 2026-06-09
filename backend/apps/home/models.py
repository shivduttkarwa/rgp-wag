from typing import Any

from django.db import DatabaseError, models
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel, PublishingPanel
from wagtail.fields import StreamField
from wagtail.images import get_image_model_string
from wagtail.models import Page

from .blocks import (
    ContactPageContentStreamBlock,
    ContactPageHeroStreamBlock,
    HomePageStreamBlock,
    PropertiesPageContentStreamBlock,
    TestimonialsPageStreamBlock,
)


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


class PropertiesPage(Page):
    """
    CMS-managed properties page for the headless frontend.
    Uses reusable internal hero and property CTA blocks, while listing cards
    are sourced directly from the Listings snippet app.
    """

    hero_content = StreamField(
        ContactPageHeroStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Reusable internal page hero block (buttons or stats mode).",
    )

    property_section_eyebrow = models.CharField(max_length=120, default="Browse Listings")
    property_section_heading = models.CharField(max_length=255, default="Discover Your Next Property")
    property_section_subtitle = models.TextField(
        default=(
            "Filter by sale, rent, or sold status and explore our complete listing"
            " portfolio in one place."
        )
    )

    marquee_eyebrow = models.CharField(max_length=120, default="Featured Portfolio")
    marquee_title = models.CharField(max_length=255, default="Explore")
    marquee_title_em = models.CharField(max_length=255, default="Premium Homes")
    marquee_subtitle = models.TextField(
        default=(
            "A curated selection of standout residences from across our portfolio"
            " — updated regularly."
        )
    )
    marquee_cta_label = models.CharField(max_length=120, default="View All Properties")

    content = StreamField(
        PropertiesPageContentStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add reusable content blocks for this page.",
    )

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    content_panels = Page.content_panels + [
        FieldPanel("hero_content"),
        FieldPanel("property_section_eyebrow"),
        FieldPanel("property_section_heading"),
        FieldPanel("property_section_subtitle"),
        FieldPanel("marquee_eyebrow"),
        FieldPanel("marquee_title"),
        FieldPanel("marquee_title_em"),
        FieldPanel("marquee_subtitle"),
        FieldPanel("marquee_cta_label"),
        FieldPanel("content"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    class Meta:
        verbose_name = "Properties Page"

    def get_api_representation(self) -> dict[str, Any]:
        hero_payload = _extract_internal_page_hero_block(self.hero_content)
        if not hero_payload:
            hero_payload = _default_properties_hero_payload()

        property_cta = _extract_property_cta_block(self.content)
        if not property_cta:
            property_cta = _default_property_cta_payload()

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": hero_payload,
            "property_section": {
                "eyebrow": self.property_section_eyebrow,
                "heading": self.property_section_heading,
                "subtitle": self.property_section_subtitle,
            },
            "marquee": {
                "eyebrow": self.marquee_eyebrow,
                "title": self.marquee_title,
                "title_em": self.marquee_title_em,
                "subtitle": self.marquee_subtitle,
                "cta_label": self.marquee_cta_label,
            },
            "property_cta": property_cta,
            "listings": _get_properties_page_listing_items(),
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


def _default_properties_hero_payload() -> dict[str, Any]:
    return {
        "title_line_1": "Our [gold]Premium[/gold]",
        "title_line_2": "[amber]Properties[/amber]",
        "subtitle": (
            "Browse our curated portfolio of for-sale, sold and rental "
            "properties across South-East Queensland."
        ),
        "background_image": None,
        "background_image_url": "images/prop-hero.jpg",
        "show_video": False,
        "background_video_url": "",
        "mode": "buttons",
        "buttons": [
            {
                "label": "Talk to an Expert",
                "href": "/contact",
                "style": "gold",
                "open_in_new_tab": False,
            }
        ],
        "stats": [],
    }


def _default_property_cta_payload() -> dict[str, Any]:
    return {
        "eyebrow": "Need Help Choosing?",
        "title": "Let's Find Your",
        "title_em": "Perfect Home",
        "text": (
            "Tell us what you're looking for and we'll shortlist the best options, "
            "arrange inspections, and guide you through every step."
        ),
        "primary": {"label": "Talk to an Expert", "href": "/contact"},
        "secondary": {"label": "0450 009 291", "href": "tel:+61450009291"},
        "commitments": [
            {"title": "Data-backed guidance"},
            {"title": "Inspection-ready planning"},
            {"title": "Negotiation that protects"},
        ],
        "use_video": True,
        "background_image": None,
        "background_image_url": "images/int.jpg",
        "background_video_url": "vids/cta-2-vid.mp4",
        "video_poster_image": None,
        "video_poster_image_url": "images/int.jpg",
        "min_height": "100vh",
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


def _get_properties_page_listing_items() -> list[dict[str, Any]]:
    try:
        from apps.properties.models import Property
        from apps.properties.serializers import PropertyListSerializer
    except Exception:
        return []

    try:
        queryset = (
            Property.objects.select_related("card_image", "agent")
            .prefetch_related("features")
            .all()
        )
        return list(PropertyListSerializer(queryset, many=True).data)
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


def _extract_property_cta_block(content) -> dict[str, Any] | None:
    for block in content:
        if block.block_type == "property_cta":
            cta = _serialise_block_value(block.value)
            if not isinstance(cta, dict):
                return None
            cta.setdefault("primary", {"label": "", "href": ""})
            cta.setdefault("secondary", {"label": "", "href": ""})
            cta.setdefault("commitments", [])
            cta.setdefault("use_video", True)
            cta.setdefault("background_image", None)
            cta.setdefault("background_image_url", "images/int.jpg")
            cta.setdefault("background_video_url", "vids/cta-2-vid.mp4")
            cta.setdefault("video_poster_image", None)
            cta.setdefault("video_poster_image_url", cta.get("background_image_url") or "images/int.jpg")
            cta.setdefault("min_height", "100vh")
            return cta
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


# ─── About Page ──────────────────────────────────────────────────────────────

class AboutPage(Page):
    hero_content = StreamField(
        ContactPageHeroStreamBlock(), blank=True, use_json_field=True,
        help_text="Internal page hero block.",
    )

    # Intro statement
    intro_statement = models.TextField(
        default="Rahul Singh is the appraisal-first agent behind Real Gold Properties — bringing local clarity, data-backed pricing, and calm negotiation to every homeowner.",
    )

    # Split section
    split_heading = models.CharField(max_length=255, default="Why Sellers Choose Rahul")
    split_p1 = models.TextField(default="He translates market noise into a clear, confident price position — with a strategy that attracts buyers and protects your upside.")
    split_p2 = models.TextField(default="You get straight answers, a staged plan, and weekly feedback so the appraisal never sits still.")
    split_bullet_1 = models.TextField(default="Street-level pricing: recent sales, buyer demand, and suburb momentum.")
    split_bullet_2 = models.TextField(default="Launch strategy: presentation, timing, and campaign plan that drives competition.")
    split_bullet_3 = models.TextField(default="Calm guidance: no pressure, just clarity and next steps.")
    split_video_url = models.CharField(max_length=500, default="vids/rgp-video.mp4", blank=True)
    split_cta_label = models.CharField(max_length=120, default="Book Your Appraisal")
    split_cta_href = models.CharField(max_length=255, default="/contact")

    # Overlay section
    overlay_heading = models.CharField(max_length=255, default="The Appraisal Strategy")
    overlay_text = models.TextField(default="Rahul's appraisals are more than a number. Each one is built to attract the right buyers and set a confident path to sale.")
    overlay_image = models.ForeignKey(get_image_model_string(), null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    overlay_image_url = models.CharField(max_length=500, default="images/int.jpg", blank=True)
    overlay_step_1 = models.CharField(max_length=255, default="01 On-site walk-through + market scan")
    overlay_step_2 = models.CharField(max_length=255, default="02 Pricing range + demand positioning")
    overlay_step_3 = models.CharField(max_length=255, default="03 Launch plan + feedback loop")

    # Availability section
    avail_eyebrow = models.CharField(max_length=120, default="APPRAISAL")
    avail_heading = models.CharField(max_length=255, default="Ready For Your Appraisal?")
    avail_text = models.TextField(default="Book a free, no-pressure appraisal with Rahul Singh. You'll get a clear price range, honest advice, and a next-step plan.")
    avail_image = models.ForeignKey(get_image_model_string(), null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    avail_image_url = models.CharField(max_length=500, default="images/rahul-singh.jpg", blank=True)
    avail_cta_label = models.CharField(max_length=120, default="Book Your Appraisal")
    avail_cta_href = models.CharField(max_length=255, default="/contact")

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    content_panels = Page.content_panels + [
        FieldPanel("hero_content"),
        MultiFieldPanel([FieldPanel("intro_statement")], heading="Intro Statement"),
        MultiFieldPanel([
            FieldPanel("split_heading"),
            FieldPanel("split_p1"),
            FieldPanel("split_p2"),
            FieldPanel("split_bullet_1"),
            FieldPanel("split_bullet_2"),
            FieldPanel("split_bullet_3"),
            FieldPanel("split_video_url"),
            FieldRowPanel([FieldPanel("split_cta_label"), FieldPanel("split_cta_href")]),
        ], heading="Why Sellers Choose Section"),
        MultiFieldPanel([
            FieldPanel("overlay_heading"),
            FieldPanel("overlay_text"),
            FieldPanel("overlay_image"),
            FieldPanel("overlay_image_url"),
            FieldPanel("overlay_step_1"),
            FieldPanel("overlay_step_2"),
            FieldPanel("overlay_step_3"),
        ], heading="Appraisal Strategy Overlay"),
        MultiFieldPanel([
            FieldPanel("avail_eyebrow"),
            FieldPanel("avail_heading"),
            FieldPanel("avail_text"),
            FieldPanel("avail_image"),
            FieldPanel("avail_image_url"),
            FieldRowPanel([FieldPanel("avail_cta_label"), FieldPanel("avail_cta_href")]),
        ], heading="Availability / Appraisal CTA"),
    ]

    promote_panels = Page.promote_panels + [PublishingPanel()]

    class Meta:
        verbose_name = "About Page"

    def get_api_representation(self) -> dict[str, Any]:
        hero = _extract_internal_page_hero_block(self.hero_content)
        if not hero:
            hero = {
                "title_line_1": "Meet [gold]Rahul[/gold] Singh",
                "title_line_2": "Appraisal-First [amber]Agent[/amber]",
                "subtitle": "Brisbane's calm, data-backed appraisal specialist. Clear pricing, honest advice, and a plan that helps your property stand out.",
                "background_image": None,
                "background_image_url": "images/hero4.jpg",
                "show_video": False,
                "background_video_url": "",
                "mode": "buttons",
                "buttons": [{"label": "Book a Free Appraisal", "href": "/contact", "style": "gold", "open_in_new_tab": False}],
                "stats": [],
            }
        overlay_image_url = self.overlay_image.file.url if self.overlay_image and getattr(self.overlay_image, "file", None) else self.overlay_image_url
        avail_image_url = self.avail_image.file.url if self.avail_image and getattr(self.avail_image, "file", None) else self.avail_image_url
        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": hero,
            "intro": {"statement": self.intro_statement},
            "split": {
                "heading": self.split_heading,
                "p1": self.split_p1,
                "p2": self.split_p2,
                "bullets": [self.split_bullet_1, self.split_bullet_2, self.split_bullet_3],
                "video_url": self.split_video_url,
                "cta_label": self.split_cta_label,
                "cta_href": self.split_cta_href,
            },
            "overlay": {
                "heading": self.overlay_heading,
                "text": self.overlay_text,
                "image_url": overlay_image_url,
                "steps": [self.overlay_step_1, self.overlay_step_2, self.overlay_step_3],
            },
            "avail": {
                "eyebrow": self.avail_eyebrow,
                "heading": self.avail_heading,
                "text": self.avail_text,
                "image_url": avail_image_url,
                "cta_label": self.avail_cta_label,
                "cta_href": self.avail_cta_href,
            },
        }


# ─── Services Page ────────────────────────────────────────────────────────────

class ServicesPage(Page):
    hero_content = StreamField(
        ContactPageHeroStreamBlock(), blank=True, use_json_field=True,
        help_text="Internal page hero block.",
    )

    intro_statement = models.TextField(
        default="A full-service partner for buying, selling, and renting — one team, three core services, zero guesswork.",
    )

    # Buy section
    buy_heading = models.CharField(max_length=255, default="Buy With Confidence From Day One")
    buy_p1 = models.TextField(default="We narrow the field quickly, secure the right property at the right price, and guide you through every step of the purchase process.")
    buy_p2 = models.TextField(default="From off-market access to finance coordination and settlement support — you're never navigating alone.")
    buy_image = models.ForeignKey(get_image_model_string(), null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    buy_image_url = models.CharField(max_length=500, default="images/ps1 (6).jpg", blank=True)
    buy_cta_label = models.CharField(max_length=120, default="Explore Our Homes")
    buy_cta_href = models.CharField(max_length=255, default="/properties")

    # CTA section
    cta_eyebrow = models.CharField(max_length=120, default="Ready to Move?")
    cta_title = models.CharField(max_length=255, default="Get a")
    cta_title_em = models.CharField(max_length=255, default="Tailored Plan")
    cta_text = models.TextField(default="Tell us your goal and timeline — we'll map out a strategy built around your situation.")
    cta_primary_label = models.CharField(max_length=120, default="Book a Consultation")
    cta_primary_href = models.CharField(max_length=255, default="/contact")
    cta_secondary_label = models.CharField(max_length=120, default="0450 009 291")
    cta_secondary_href = models.CharField(max_length=255, default="tel:+61450009291")
    cta_stat_1_value = models.CharField(max_length=50, default="5+")
    cta_stat_1_label = models.CharField(max_length=100, default="Years Experience")
    cta_stat_2_value = models.CharField(max_length=50, default="100+")
    cta_stat_2_label = models.CharField(max_length=100, default="Happy Clients")
    cta_stat_3_value = models.CharField(max_length=50, default="24/7")
    cta_stat_3_label = models.CharField(max_length=100, default="Support Available")

    # Sell section
    sell_heading = models.CharField(max_length=255, default="Sell With Clear Strategy")
    sell_text = models.TextField(default="Pricing, positioning, staging, and marketing — all aligned to attract the right buyers and deliver a result you're confident in.")
    sell_image = models.ForeignKey(get_image_model_string(), null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    sell_image_url = models.CharField(max_length=500, default="images/ps1 (5).jpg", blank=True)
    sell_cta_label = models.CharField(max_length=120, default="Request a Valuation")
    sell_cta_href = models.CharField(max_length=255, default="/contact")

    # Rent section
    rent_heading = models.CharField(max_length=255, default="Lease With Confidence")
    rent_text = models.TextField(default="Premium leasing, tenant screening, and ongoing property care — so your investment performs without the stress.")
    rent_image = models.ForeignKey(get_image_model_string(), null=True, blank=True, on_delete=models.SET_NULL, related_name="+")
    rent_image_url = models.CharField(max_length=500, default="images/ps1 (1).jpg", blank=True)
    rent_cta_label = models.CharField(max_length=120, default="View Available Rentals")
    rent_cta_href = models.CharField(max_length=255, default="/properties")

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    content_panels = Page.content_panels + [
        FieldPanel("hero_content"),
        MultiFieldPanel([FieldPanel("intro_statement")], heading="Intro Statement"),
        MultiFieldPanel([
            FieldPanel("buy_heading"), FieldPanel("buy_p1"), FieldPanel("buy_p2"),
            FieldPanel("buy_image"), FieldPanel("buy_image_url"),
            FieldRowPanel([FieldPanel("buy_cta_label"), FieldPanel("buy_cta_href")]),
        ], heading="Buy Section"),
        MultiFieldPanel([
            FieldPanel("cta_eyebrow"), FieldPanel("cta_title"), FieldPanel("cta_title_em"),
            FieldPanel("cta_text"),
            FieldRowPanel([FieldPanel("cta_primary_label"), FieldPanel("cta_primary_href")]),
            FieldRowPanel([FieldPanel("cta_secondary_label"), FieldPanel("cta_secondary_href")]),
            FieldRowPanel([FieldPanel("cta_stat_1_value"), FieldPanel("cta_stat_1_label")]),
            FieldRowPanel([FieldPanel("cta_stat_2_value"), FieldPanel("cta_stat_2_label")]),
            FieldRowPanel([FieldPanel("cta_stat_3_value"), FieldPanel("cta_stat_3_label")]),
        ], heading="Mid-Page CTA"),
        MultiFieldPanel([
            FieldPanel("sell_heading"), FieldPanel("sell_text"),
            FieldPanel("sell_image"), FieldPanel("sell_image_url"),
            FieldRowPanel([FieldPanel("sell_cta_label"), FieldPanel("sell_cta_href")]),
        ], heading="Sell Section"),
        MultiFieldPanel([
            FieldPanel("rent_heading"), FieldPanel("rent_text"),
            FieldPanel("rent_image"), FieldPanel("rent_image_url"),
            FieldRowPanel([FieldPanel("rent_cta_label"), FieldPanel("rent_cta_href")]),
        ], heading="Rent Section"),
    ]

    promote_panels = Page.promote_panels + [PublishingPanel()]

    class Meta:
        verbose_name = "Services Page"

    def get_api_representation(self) -> dict[str, Any]:
        hero = _extract_internal_page_hero_block(self.hero_content)
        if not hero:
            hero = {
                "title_line_1": "Services For [gold]Buyers[/gold]",
                "title_line_2": "Sellers & [amber]Renters[/amber]",
                "subtitle": "We handle the full journey — buying, selling, and leasing across South-East Queensland.",
                "background_image": None, "background_image_url": "images/hero1.jpg",
                "show_video": False, "background_video_url": "",
                "mode": "none", "buttons": [], "stats": [],
            }

        def _img(fk, url):
            return fk.file.url if fk and getattr(fk, "file", None) else url

        return {
            "id": self.pk, "title": self.title, "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": hero,
            "intro": {"statement": self.intro_statement},
            "buy": {
                "heading": self.buy_heading, "p1": self.buy_p1, "p2": self.buy_p2,
                "image_url": _img(self.buy_image, self.buy_image_url),
                "cta_label": self.buy_cta_label, "cta_href": self.buy_cta_href,
            },
            "cta": {
                "eyebrow": self.cta_eyebrow, "title": self.cta_title, "title_em": self.cta_title_em,
                "text": self.cta_text,
                "primary": {"label": self.cta_primary_label, "href": self.cta_primary_href},
                "secondary": {"label": self.cta_secondary_label, "href": self.cta_secondary_href},
                "stats": [
                    {"value": self.cta_stat_1_value, "label": self.cta_stat_1_label},
                    {"value": self.cta_stat_2_value, "label": self.cta_stat_2_label},
                    {"value": self.cta_stat_3_value, "label": self.cta_stat_3_label},
                ],
            },
            "sell": {
                "heading": self.sell_heading, "text": self.sell_text,
                "image_url": _img(self.sell_image, self.sell_image_url),
                "cta_label": self.sell_cta_label, "cta_href": self.sell_cta_href,
            },
            "rent": {
                "heading": self.rent_heading, "text": self.rent_text,
                "image_url": _img(self.rent_image, self.rent_image_url),
                "cta_label": self.rent_cta_label, "cta_href": self.rent_cta_href,
            },
        }


# ─── Testimonials Page ────────────────────────────────────────────────────────

class TestimonialsPage(Page):
    """
    Testimonials page. Editors build every section using StreamField blocks —
    add, remove, or reorder any section from the CMS, just like the home page.
    """

    body = StreamField(
        TestimonialsPageStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add, remove and reorder sections. Each block is a section on the testimonials page.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    promote_panels = Page.promote_panels + [PublishingPanel()]

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    class Meta:
        verbose_name = "Testimonials Page"

    def get_api_representation(self) -> dict[str, Any]:
        sections: dict[str, Any] = {}
        _text_items: list[dict[str, Any]] | None = None

        def text_items() -> list[dict[str, Any]]:
            nonlocal _text_items
            if _text_items is None:
                _text_items = _get_active_text_testimonial_items()
            return _text_items

        for block in self.body:
            btype = block.block_type
            raw = _serialise_block_value(block.value)
            cfg = raw if isinstance(raw, dict) else {}

            if btype == "hero":
                mode = cfg.get("mode")
                if mode not in {"none", "buttons", "stats"}:
                    mode = "none"
                cfg["mode"] = mode
                cfg.setdefault("buttons", [])
                cfg.setdefault("stats", [])
                sections["hero"] = cfg

            elif btype == "featured_testimonials":
                sections["featured_testimonials"] = {
                    "eyebrow": cfg.get("eyebrow") or "Testimonials",
                    "heading": cfg.get("heading") or "What Our Clients Say",
                    "subtitle": cfg.get("subtitle") or "",
                    "items": _get_active_featured_testimonial_items(),
                }

            elif btype == "text_testimonials_grid":
                sections["text_testimonials_grid"] = {
                    "eyebrow": cfg.get("eyebrow") or "Client Voices",
                    "heading": cfg.get("heading") or "What Our Clients Say",
                    "subtitle": cfg.get("subtitle") or "",
                    "items": text_items(),
                }

            elif btype == "ticker":
                sections["ticker"] = {"items": text_items()}

            elif btype == "final_cta":
                sections["final_cta"] = {
                    "heading": cfg.get("heading") or "Book a Free Appraisal",
                    "body": cfg.get("body") or "",
                    "primary": {
                        "label": cfg.get("primary_label") or "Book Your Appraisal",
                        "href": cfg.get("primary_href") or "/contact",
                    },
                    "secondary": {
                        "label": cfg.get("secondary_label") or "Talk to Rahul",
                        "href": cfg.get("secondary_href") or "/contact",
                    },
                    "items": text_items(),
                }

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "sections": sections,
        }


# ─── Expression of Interest Page ─────────────────────────────────────────────

class EoiPage(Page):
    hero_content = StreamField(
        ContactPageHeroStreamBlock(), blank=True, use_json_field=True,
        help_text="Internal page hero block.",
    )

    legal_text = models.TextField(
        default=(
            "I/We acknowledge that if this offer is accepted, I/We will be required to enter into "
            "and execute a contract of sale on these terms. I/We acknowledge that we may be one of "
            "several parties making offers to the seller for their consideration. Both purchaser and "
            "seller must sign a contract of sale before this offer becomes legally binding. An offer "
            "may be withdrawn at any time before signing a contract of sale."
        ),
    )

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    content_panels = Page.content_panels + [
        FieldPanel("hero_content"),
        FieldPanel("legal_text"),
    ]

    promote_panels = Page.promote_panels + [PublishingPanel()]

    class Meta:
        verbose_name = "Expression of Interest Page"

    def get_api_representation(self) -> dict[str, Any]:
        hero = _extract_internal_page_hero_block(self.hero_content)
        if not hero:
            hero = {
                "title_line_1": "Expression [gold]of[/gold]",
                "title_line_2": "Interest [amber]Form[/amber]",
                "subtitle": "Use this form to submit your offer, purchaser details, and conditions for a property you wish to purchase.",
                "background_image": None, "background_image_url": "images/hero1.jpg",
                "show_video": False, "background_video_url": "",
                "mode": "buttons",
                "buttons": [{"label": "Complete the Form", "href": "", "style": "gold", "open_in_new_tab": False}],
                "stats": [],
            }
        return {
            "id": self.pk, "title": self.title, "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "hero": hero,
            "legal_text": self.legal_text,
        }


def _get_active_text_testimonial_items() -> list[dict[str, Any]]:
    try:
        from apps.testimonials.models import TextTestimonial
    except Exception:
        return []
    try:
        qs = TextTestimonial.objects.filter(is_active=True).select_related("client_image").order_by("order", "id")
        return [t.to_api_item() for t in qs]
    except DatabaseError:
        return []


def _get_active_featured_testimonial_items() -> list[dict[str, Any]]:
    try:
        from apps.testimonials.models import FeaturedTestimonial
    except Exception:
        return []
    try:
        qs = (
            FeaturedTestimonial.objects.filter(is_active=True)
            .select_related("image")
            .order_by("order", "id")
        )
        return [t.to_api_item() for t in qs]
    except DatabaseError:
        return []
