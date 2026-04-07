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
            "title_line_1": "Your [gold]Dream[/gold] Home",
            "title_line_2": "[amber]Perfectly[/amber] Delivered",
            "subtitle": "350+ premium properties delivered — luxury villas, penthouses & exclusive estates crafted for those who demand the extraordinary.",
            "search_tabs": [
                {"label": "Buy",   "icon": "buy",   "href": "/properties?cat=for-sale"},
                {"label": "Rent",  "icon": "rent",  "href": "/properties?cat=for-rent"},
                {"label": "Sold",  "icon": "sold",  "href": "/properties?cat=sold"},
                {"label": "Agent", "icon": "agent", "href": "/team"},
            ],
            "background_image_url": "images/hero-rpg-brisbane.jpg",
            "background_video_url": "vids/hero-rgp.mp4",
            "show_video": True,
        },
    },
    {
        "type": "intro",
        "value": {
            "label": "About the Founder",
            "headline_line1": "Building Wealth",
            "headline_line2": "Through Property,",
            "founder_name": "— Rahul Singh",
            "body": "Real Gold Properties is a vision turned reality — a private equity approach to multi-family real estate. Founded by Rahul Singh, we focus on disciplined acquisitions that deliver consistent returns.",
            "primary_cta": {"label": "Book a Free Appraisal", "href": "/contact"},
            "secondary_cta": {"label": "Meet Rahul", "href": "/about"},
            "image_url": "images/rahul-singh.jpg",
        },
    },
    {
        "type": "property_listing",
        "value": {
            "eyebrow": "Our Listings",
            "heading": "Available Properties",
            "subtitle": "Explore our current listings across South-East Queensland.",
        },
    },
    {
        "type": "services",
        "value": {
            "header_eyebrow": "How Can We Help You?",
            "header_title": "What Are You",
            "header_title_em": "Looking For?",
            "header_subtitle": "Whether you're buying, selling, or renting — we're here to make your real estate journey seamless and rewarding.",
            "services": [
                {
                    "theme": "buy",
                    "headline": "Advisory",
                    "title": "Buyer Support",
                    "subtitle": "And Guidance",
                    "description": "Clear advice and local insight to help you buy with confidence — pricing, comparables, and negotiation support tailored to your goals.",
                    "features": ["Buyer support and advisory", "Residential property sales", "House & land packages"],
                    "cta_label": "Speak With Us",
                },
                {
                    "theme": "sell",
                    "headline": "Insights",
                    "title": "Property Appraisals",
                    "subtitle": "& Market Analysis",
                    "description": "Professional appraisals, transparent pricing strategy, and data-led guidance to help you make the right move at the right time.",
                    "features": ["Property appraisals and market analysis", "Honest communication", "Results driven outcomes"],
                    "cta_label": "Request an Appraisal",
                },
                {
                    "theme": "rent",
                    "headline": "Management",
                    "title": "Rentals &",
                    "subtitle": "Property Management",
                    "description": "Reliable tenancy, proactive maintenance, and smooth day-to-day management for landlords and tenants alike.",
                    "features": ["Quality tenant selection", "Reliable rent collection", "Routine inspections & maintenance"],
                    "cta_label": "Get In Touch",
                },
            ],
            "cta_eyebrow": "Need Guidance?",
            "cta_title": "Not Sure Where to",
            "cta_title_em": "Start?",
            "cta_text": "Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.",
            "cta_primary": {"label": "Talk to an Expert", "href": "/contact"},
            "cta_secondary": {"label": "0450 009 291", "href": "tel:+61450009291"},
        },
    },
    {
        "type": "video_testimonials",
        "value": {
            "section_label": "Testimonials",
            "heading": "What Our",
            "heading_em": "Clients Say",
            "items": [
                {
                    "kicker": "SUNNYBANK · SOLD",
                    "name": "Sarah M.",
                    "video_url": "vids/rgp-video.mp4",
                    "poster_url": "https://files.staging.peachworlds.com/website/dbf16c23-6134-4df6-a509-bd2a6b79ab37/chatgpt-image-3-apr-2025-16-33-58.webp",
                    "tint": "gold",
                },
                {
                    "kicker": "UNDERWOOD · PURCHASED",
                    "name": "James & Lisa",
                    "video_url": "vids/rgp-video.mp4",
                    "poster_url": "https://files.staging.peachworlds.com/website/d80b404a-7e8e-40ee-a08c-cbab3f8a7ad3/chatgpt-image-3-apr-2025-16-23-38.webp",
                    "tint": "amber",
                },
                {
                    "kicker": "EIGHT MILE PLAINS · APPRAISAL",
                    "name": "David K.",
                    "video_url": "vids/rgp-video.mp4",
                    "poster_url": "https://files.staging.peachworlds.com/website/504aad69-04e9-4c61-8e60-4bf340ec746f/chatgpt-image-3-apr-2025-16-23-32.webp",
                    "tint": "crimson",
                },
            ],
        },
    },
    {
        "type": "portfolio",
        "value": {
            "eyebrow": "REAL GOLD PROPERTIES",
            "heading": "Featured",
            "heading_em": "Properties",
            "subtitle": "Handpicked residences across Australia's most coveted neighbourhoods — every listing curated for quality, location, and lasting value.",
            "projects": [
                {"title": "Hawcliffe Manor",       "location": "Toorak, VIC",        "price": "$4,250,000", "status": "For Sale",    "image_url": "images/ps1 (1).jpg", "beds": "5", "baths": "4", "area": "3,800", "property_slug": ""},
                {"title": "Northshore Penthouse",  "location": "North Sydney, NSW",   "price": "$3,100,000", "status": "For Sale",    "image_url": "images/ps1 (2).jpg", "beds": "3", "baths": "2", "area": "2,100", "property_slug": ""},
                {"title": "The Garden Terrace",    "location": "Brighton, VIC",       "price": "$2,750,000", "status": "New Listing", "image_url": "images/ps1 (3).jpg", "beds": "4", "baths": "3", "area": "2,400", "property_slug": ""},
                {"title": "Evoke Residences",      "location": "South Yarra, VIC",    "price": "$1,850,000", "status": "For Sale",    "image_url": "images/ps1 (4).jpg", "beds": "2", "baths": "2", "area": "1,200", "property_slug": ""},
                {"title": "Heritage Estate",       "location": "Vaucluse, NSW",       "price": "$6,800,000", "status": "Exclusive",   "image_url": "images/ps1 (5).jpg", "beds": "6", "baths": "5", "area": "4,500", "property_slug": ""},
            ],
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
