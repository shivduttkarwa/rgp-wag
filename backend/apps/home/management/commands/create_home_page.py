"""
Management command to create the initial HomePage in Wagtail's page tree.

Usage:
    uv run python manage.py create_home_page
"""
import json
from django.core.management.base import BaseCommand
from wagtail.models import Page, Site


DEFAULT_BODY = [
    {
        "type": "hero",
        "value": {
            "title_line_1": "Find Your [gold]Next[/gold] Property",
            "title_line_2": "With Confident Guidance",
            "subtitle": "Explore selected properties with local advice, clear market context, and support from enquiry through settlement.",
            "search_tabs": [
                {"label": "Buy",   "icon": "buy",   "href": "/properties?cat=for-sale"},
                {"label": "Rent",  "icon": "rent",  "href": "/properties?cat=for-rent"},
                {"label": "Sold",  "icon": "sold",  "href": "/properties?cat=sold"},
                {"label": "Agent", "icon": "agent", "href": "/team"},
            ],
            "background_video_url": "",
            "show_video": True,
        },
    },
    {
        "type": "intro",
        "value": {
            "label": "Founder Perspective",
            "headline_line1": "Property Choices",
            "headline_line2": "Made Clearer",
            "founder_name": "— Real Gold Properties",
            "body": "Real Gold Properties brings practical market insight, measured advice, and a client-first approach to every property decision.",
            "primary_cta": {"label": "Arrange an Appraisal", "href": "/contact"},
            "secondary_cta": {"label": "Learn More", "href": "/about"},
            "image_url": "",
        },
    },
    {
        "type": "property_listing",
        "value": {
            "eyebrow": "Current Opportunities",
            "heading": "Featured Properties",
            "subtitle": "Browse selected listings and recent results from the local market.",
        },
    },
    {
        "type": "services",
        "value": {
            "header_eyebrow": "How We Can Support You",
            "header_title": "Choose The",
            "header_title_em": "Right Next Step",
            "header_subtitle": "Buying, selling, and leasing decisions become simpler with clear advice and local market perspective.",
            "services": [
                {
                    "theme": "buy",
                    "headline": "Consulting",
                    "title": "Buyer Guidance",
                    "subtitle": "And Strategy",
                    "description": "Clear market context, property comparison, and negotiation support shaped around your goals.",
                    "features": ["Buyer guidance", "Market comparison", "Offer support"],
                    "cta_label": "Contact the Team",
                },
                {
                    "theme": "sell",
                    "headline": "Appraisal",
                    "title": "Selling Advice",
                    "subtitle": "And Positioning",
                    "description": "Pricing evidence, campaign preparation, and feedback loops that support confident sale decisions.",
                    "features": ["Property appraisal", "Pricing strategy", "Campaign planning"],
                    "cta_label": "Request an Appraisal",
                },
                {
                    "theme": "rent",
                    "headline": "Leasing",
                    "title": "Rental Support",
                    "subtitle": "And Care",
                    "description": "Tenant selection, communication, and practical property care to keep leasing organised.",
                    "features": ["Tenant selection", "Rental guidance", "Ongoing support"],
                    "cta_label": "Get In Touch",
                },
            ],
            "cta_eyebrow": "Need Direction?",
            "cta_title": "Unsure What Comes",
            "cta_title_em": "Next?",
            "cta_text": "Tell us your goals and we will help map a practical path through your next property decision.",
            "cta_primary": {"label": "Book a Conversation", "href": "/contact"},
            "cta_secondary": {"label": "0450 009 291", "href": "tel:+61450009291"},
        },
    },
    {
        "type": "video_testimonials",
        "value": {
            "section_label": "Client Stories",
            "heading": "Hear From",
            "heading_em": "Our Clients",
            "items": [],
        },
    },
    {
        "type": "portfolio",
        "value": {
            "eyebrow": "PROPERTY PORTFOLIO",
            "heading": "Selected",
            "heading_em": "Homes",
            "subtitle": "A focused collection of properties chosen for location, presentation, and long-term appeal.",
            "projects": [],
        },
    },
]


class Command(BaseCommand):
    help = "Create the initial HomePage in Wagtail with default content for all sections."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Delete and recreate if already exists.")

    def handle(self, *args, **options):
        from apps.home.models import HomePage

        # ── Guard: already exists ────────────────────────────────────────────
        existing = HomePage.objects.first()
        if existing:
            if not options["force"]:
                self.stdout.write(self.style.WARNING(
                    f"HomePage already exists (pk={existing.pk}). "
                    "Use --force to recreate."
                ))
                return
            existing.delete()
            self.stdout.write("Deleted existing HomePage.")

        # ── Find Wagtail's internal root (depth=1) ──────────────────────────
        wagtail_root = Page.objects.filter(depth=1).first()
        if wagtail_root is None:
            self.stderr.write("No root page found. Run migrate first.")
            return

        # ── Remove the default "Welcome" page and any other depth-2 pages ────
        # so our HomePage can sit cleanly at depth=2 with slug="home".
        old_pages = Page.objects.filter(depth=2).exclude(pk__in=HomePage.objects.values("pk"))
        for p in old_pages:
            self.stdout.write(f"Deleting old page: '{p.title}' (slug={p.slug}, pk={p.pk})")
            p.delete()

        # Rebuild treebeard numchild counters after deletion, then re-fetch root
        Page.fix_tree()
        wagtail_root = Page.objects.filter(depth=1).first()

        # ── Create HomePage as a direct child of the Wagtail root ───────────
        home = HomePage(
            title="Home",
            slug="home",
            body=json.dumps(DEFAULT_BODY),
        )
        wagtail_root.add_child(instance=home)

        # Publish immediately
        revision = home.save_revision()
        revision.publish()

        # ── Update (or create) site root to point at HomePage ───────────────
        site = Site.objects.filter(is_default_site=True).first()
        if site:
            site.root_page = home
            site.save()
        else:
            Site.objects.create(
                hostname="localhost",
                port=8000,
                root_page=home,
                is_default_site=True,
                site_name="Real Gold Properties",
            )
        self.stdout.write(f"Updated default site root -> HomePage (pk={home.pk})")

        self.stdout.write(self.style.SUCCESS(
            f"HomePage created and published (pk={home.pk}). "
            "Visit /cms/ to edit it."
        ))
