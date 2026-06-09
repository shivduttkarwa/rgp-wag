from typing import Any

from django.db import DatabaseError, models
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel, PublishingPanel
from wagtail.fields import StreamField
from wagtail.images import get_image_model_string
from wagtail.models import Page

from .blocks import (
    AboutPageStreamBlock,
    ContactPageHeroStreamBlock,
    ContactPageStreamBlock,
    HomePageStreamBlock,
    PropertiesPageStreamBlock,
    TeamPageStreamBlock,
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
    Editors build every section using StreamField blocks.
    """

    body = StreamField(
        ContactPageStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add, remove and reorder sections. Each block is a section on the contact page.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    class Meta:
        verbose_name = "Contact Page"

    def get_api_representation(self) -> dict[str, Any]:
        sections: dict[str, Any] = {}
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

            elif btype == "contact_info":
                sections["contact_info"] = _contact_info_from_cfg(cfg)

            elif btype == "contact_form":
                budget_min = int(cfg.get("budget_min") or 500000)
                budget_max = int(cfg.get("budget_max") or 20000000)
                budget_max = max(budget_max, budget_min + 1)
                budget_step = max(int(cfg.get("budget_step") or 500000), 1)
                budget_default = int(cfg.get("budget_default") or 5000000)
                budget_default = min(max(budget_default, budget_min), budget_max)
                sections["contact_form"] = {
                    "eyebrow": cfg.get("eyebrow") or "Begin your enquiry",
                    "heading_line_1": cfg.get("heading_line_1") or "Tell us what you're",
                    "heading_line_2": cfg.get("heading_line_2") or "looking for.",
                    "subtitle": cfg.get("subtitle") or "",
                    "intent_options": _parse_csv_options(cfg.get("intent_options") or ""),
                    "property_type_options": _parse_csv_options(cfg.get("property_type_options") or ""),
                    "budget_min": budget_min,
                    "budget_max": budget_max,
                    "budget_step": budget_step,
                    "budget_default": budget_default,
                    "submit_note": cfg.get("submit_note") or "",
                }

            elif btype == "cta":
                sections["cta"] = cfg

            elif btype == "eoi_cta":
                sections["eoi_cta"] = cfg

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "sections": sections,
        }


class TeamPage(Page):
    """
    CMS-managed team page for the headless frontend.
    Uses reusable internal hero block and Team Member sidebar app records.
    """

    body = StreamField(
        TeamPageStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add, remove and reorder sections. Team members always come from the Team Member snippets.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    class Meta:
        verbose_name = "Team Page"

    def get_api_representation(self) -> dict[str, Any]:
        sections: dict[str, Any] = {}
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

            elif btype == "team_section":
                sections["team_section"] = {
                    "eyebrow": cfg.get("eyebrow") or "Our People",
                    "title_line_1": cfg.get("title_line_1") or "The Minds",
                    "title_line_2": cfg.get("title_line_2") or "[gold]Behind[/gold] Every Deal",
                    "subtitle": cfg.get("subtitle") or "",
                    "members": _get_active_team_member_items(),
                }

            elif btype == "cta":
                sections["cta"] = cfg

            elif btype == "eoi_cta":
                sections["eoi_cta"] = cfg

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "sections": sections,
        }


class PropertiesPage(Page):
    """
    CMS-managed properties page for the headless frontend.
    Editors build every section using StreamField blocks; listings come from
    the Property snippets app.
    """

    body = StreamField(
        PropertiesPageStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add, remove and reorder sections. Listings always come from the Property snippets.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    promote_panels = Page.promote_panels + [
        PublishingPanel(),
    ]

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    class Meta:
        verbose_name = "Properties Page"

    def get_api_representation(self) -> dict[str, Any]:
        sections: dict[str, Any] = {}
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

            elif btype == "property_listing":
                sections["property_listing"] = {
                    "eyebrow": cfg.get("eyebrow") or "Browse Listings",
                    "heading": cfg.get("heading") or "Discover Your Next Property",
                    "subtitle": cfg.get("subtitle") or "",
                }

            elif btype == "property_marquee":
                sections["property_marquee"] = {
                    "eyebrow": cfg.get("eyebrow") or "Featured Portfolio",
                    "title": cfg.get("title") or "Explore",
                    "title_em": cfg.get("title_em") or "Premium Homes",
                    "subtitle": cfg.get("subtitle") or "",
                    "cta_label": cfg.get("cta_label") or "View All Properties",
                }

            elif btype == "property_cta":
                cfg.setdefault("primary", {"label": "", "href": ""})
                cfg.setdefault("secondary", {"label": "", "href": ""})
                cfg.setdefault("commitments", [])
                cfg.setdefault("use_video", True)
                cfg.setdefault("background_image", None)
                cfg.setdefault("background_image_url", "images/int.jpg")
                cfg.setdefault("background_video_url", "vids/cta-2-vid.mp4")
                cfg.setdefault("video_poster_image", None)
                cfg.setdefault(
                    "video_poster_image_url",
                    cfg.get("background_image_url") or "images/int.jpg",
                )
                cfg.setdefault("min_height", "100vh")
                sections["property_cta"] = cfg

            elif btype == "cta":
                sections["cta"] = cfg

            elif btype == "eoi_cta":
                sections["eoi_cta"] = cfg

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "sections": sections,
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


def _contact_info_from_cfg(cfg: dict) -> dict[str, Any]:
    return {
        "title": cfg.get("title") or "Let's Talk Appraisal.",
        "tagline": cfg.get("tagline") or (
            "Whether you're buying, selling, or investing — our advisors are ready "
            "to guide you through every step."
        ),
        "contact_number": cfg.get("contact_number") or "0450 009 291",
        "email": cfg.get("email") or "admin@realgoldproperties.com.au",
        "address": cfg.get("address") or "Forest Lake, Brisbane QLD 4078",
        "working_hours": cfg.get("working_hours") or "All days · 09:00 – 18:00",
        "quote_text": cfg.get("quote_text") or (
            '"Real estate is not just a transaction — it is the beginning of a life '
            'lived better."'
        ),
        "quote_author": cfg.get("quote_author") or "— Our Promise",
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


# ─── About Page ──────────────────────────────────────────────────────────────

class AboutPage(Page):
    body = StreamField(
        AboutPageStreamBlock(),
        blank=True,
        use_json_field=True,
        help_text="Add, remove and reorder sections. Each block is a section on the about page.",
    )

    content_panels = Page.content_panels + [
        FieldPanel("body"),
    ]

    promote_panels = Page.promote_panels + [PublishingPanel()]

    parent_page_types = ["home.HomePage"]
    subpage_types: list[str] = []

    class Meta:
        verbose_name = "About Page"

    def get_api_representation(self) -> dict[str, Any]:
        sections: dict[str, Any] = {}
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

            elif btype == "intro":
                sections["intro"] = {"statement": cfg.get("statement") or ""}

            elif btype == "split":
                sections["split"] = {
                    "heading": cfg.get("heading") or "",
                    "p1": cfg.get("p1") or "",
                    "p2": cfg.get("p2") or "",
                    "bullets": cfg.get("bullets") or [],
                    "video_url": cfg.get("video_url") or "",
                    "cta_label": cfg.get("cta_label") or "",
                    "cta_href": cfg.get("cta_href") or "/contact",
                }

            elif btype == "overlay":
                image = cfg.get("image")
                image_url = (
                    image.get("url")
                    if isinstance(image, dict) and image.get("url")
                    else cfg.get("image_url") or ""
                )
                sections["overlay"] = {
                    "heading": cfg.get("heading") or "",
                    "text": cfg.get("text") or "",
                    "image_url": image_url,
                    "steps": cfg.get("steps") or [],
                }

            elif btype == "avail":
                image = cfg.get("image")
                image_url = (
                    image.get("url")
                    if isinstance(image, dict) and image.get("url")
                    else cfg.get("image_url") or ""
                )
                sections["avail"] = {
                    "eyebrow": cfg.get("eyebrow") or "",
                    "heading": cfg.get("heading") or "",
                    "text": cfg.get("text") or "",
                    "image_url": image_url,
                    "cta_label": cfg.get("cta_label") or "",
                    "cta_href": cfg.get("cta_href") or "/contact",
                }

            elif btype == "cta":
                sections["cta"] = cfg

            elif btype == "eoi_cta":
                sections["eoi_cta"] = cfg

        return {
            "id": self.pk,
            "title": self.title,
            "slug": self.slug,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
            "sections": sections,
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

            elif btype == "cta":
                sections["cta"] = cfg

            elif btype == "eoi_cta":
                sections["eoi_cta"] = cfg

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
