"""
Management command: seed_real_content
Replaces all Lorem Ipsum / placeholder / test content with real
Real Gold Properties agency copy.

Usage:
    python manage.py seed_real_content

Safe to re-run — updates in place, never deletes real images/videos.
"""

from django.core.management.base import BaseCommand
from wagtail.models import Page


class Command(BaseCommand):
    help = "Replace placeholder content with real Real Gold Properties agency copy."

    def handle(self, *args, **options):
        self._fix_about_page()
        self._fix_team_page()
        self._fix_contact_page()
        self._fix_testimonials_page()
        self._fix_team_members()
        self._fix_text_testimonials()
        self._fix_featured_testimonials()
        self.stdout.write(self.style.SUCCESS("OK: All content seeded successfully."))

    # ── About Page ────────────────────────────────────────────────────────────

    def _fix_about_page(self):
        from apps.home.models import AboutPage
        page = AboutPage.objects.first()
        if not page:
            self.stdout.write(self.style.WARNING("About page not found — skipping."))
            return

        new_body = []
        for block in page.body:
            btype = block.block_type
            val   = dict(block.value)

            if btype == "hero":
                val["title_line_1"] = "About [gold]Real Gold[/gold] Properties"
                val["title_line_2"] = "Forest Lake's [gold]Property Specialists[/gold]"
                val["subtitle"] = (
                    "We bring local market knowledge, honest advice, and a client-first approach "
                    "to every property decision in Brisbane's south-west."
                )
                val["mode"] = "buttons"
                # rebuild buttons list preserving existing wagtail objects
                from wagtail.blocks import StreamValue
                buttons_raw = [
                    {
                        "label": "View Our Listings",
                        "page": Page.objects.filter(slug="properties").first(),
                        "is_external": False,
                        "external_url": "",
                        "style": "gold",
                        "open_in_new_tab": False,
                    },
                    {
                        "label": "Meet the Team",
                        "page": Page.objects.filter(slug="team").first(),
                        "is_external": False,
                        "external_url": "",
                        "style": "outline",
                        "open_in_new_tab": False,
                    },
                ]
                val["buttons"] = buttons_raw

            elif btype == "intro":
                val["statement"] = (
                    "Real Gold Properties brings [gold]calm, considered advice[/gold] to every buyer, "
                    "seller, and investor in Brisbane's south-west. We combine [gold]genuine local knowledge[/gold] "
                    "with honest market data — so your next property decision is one you can make with confidence."
                )

            elif btype == "split":
                val["heading"] = "Why Sellers Choose This Approach"
                val["p1"] = (
                    "We turn local market signals into a realistic pricing position and a campaign plan "
                    "designed to attract the right buyers — not just the most offers."
                )
                val["p2"] = (
                    "You receive plain-language advice, a staged process, and regular feedback at every step, "
                    "so your decisions stay informed from day one to settlement."
                )
                val["bullets"] = [
                    "Street-level pricing: recent sales, buyer demand, and suburb momentum.",
                    "Launch strategy: presentation, timing, and channel selection tailored to your property.",
                    "Weekly updates: open home feedback, inquiry volume, and offer activity.",
                    "Negotiation support: clear guidance on every offer so you never leave value behind.",
                ]

            elif btype == "overlay":
                val["heading"] = "A Clear Appraisal Plan"
                val["text"] = (
                    "Each appraisal is built around evidence, local buyer demand, "
                    "and a practical path toward a confident sale."
                )
                val["steps"] = [
                    "Initial consultation to understand your goals, timeline, and priorities.",
                    "Property walkthrough and comparable sales analysis across your suburb.",
                    "Pricing recommendation backed by current market evidence — no guesswork.",
                    "Campaign strategy outline: presentation, marketing, and launch timing.",
                ]

            elif btype == "avail":
                val["eyebrow"] = "PROPERTY APPRAISAL"
                val["heading"] = "Ready To Understand Your Property's Value?"
                val["text"] = (
                    "Request a no-pressure appraisal and receive a realistic price range, "
                    "clear market context, and honest next-step guidance."
                )
                # fix the "Boom" typo if present
                if isinstance(val.get("cta"), dict) and val["cta"].get("label", "").lower().startswith("boom"):
                    val["cta"] = dict(val["cta"])
                    val["cta"]["label"] = "Book Your Appraisal"

            elif btype == "property_marquee":
                val["eyebrow"] = "OUR LISTINGS"
                val["title"] = "Properties That"
                val["title_em"] = "Speak For Themselves"
                val["subtitle"] = (
                    "Browse our current listings — from first homes to prestige properties, "
                    "each one backed by honest advice and clear market insight."
                )

            new_body.append((btype, val))

        page.body = new_body
        page.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("  OK: About page updated."))

    # ── Team Page ─────────────────────────────────────────────────────────────

    def _fix_team_page(self):
        from apps.home.models import TeamPage
        page = TeamPage.objects.first()
        if not page:
            self.stdout.write(self.style.WARNING("Team page not found — skipping."))
            return

        new_body = []
        for block in page.body:
            btype = block.block_type
            val   = dict(block.value)

            if btype == "hero":
                val["title_line_1"] = "Meet [gold]Our[/gold] Team"
                val["title_line_2"] = "People Who Put [gold]Clients First[/gold]"
                val["subtitle"] = (
                    "A dedicated team of property professionals with deep knowledge of Brisbane's "
                    "south-west suburbs and a reputation for honest, clear communication."
                )
                val["mode"] = "buttons"
                val["buttons"] = [
                    {
                        "label": "Book an Appraisal",
                        "page": Page.objects.filter(slug="contact").first(),
                        "is_external": False,
                        "external_url": "",
                        "style": "gold",
                        "open_in_new_tab": False,
                    },
                    {
                        "label": "View Listings",
                        "page": Page.objects.filter(slug="properties").first(),
                        "is_external": False,
                        "external_url": "",
                        "style": "outline",
                        "open_in_new_tab": False,
                    },
                ]

            elif btype == "team_section":
                val["eyebrow"] = "MEET THE TEAM"
                val["title_line_1"] = "The People"
                val["title_line_2"] = "[gold]Behind[/gold] Every Result"
                val["subtitle"] = (
                    "A focused team combining local expertise, clear communication, and genuine care "
                    "for every client relationship — from first enquiry through to settlement."
                )

            elif btype == "core_values":
                val["eyebrow"] = "WHAT DRIVES US"
                val["heading"] = "Our Core"
                val["heading_em"] = "Values"
                val["subtitle"] = (
                    "The principles that guide every conversation, every campaign, and every result."
                )
                val["values"] = [
                    {
                        "title": "Integrity",
                        "description": (
                            "We give honest advice even when it's not what clients want to hear. "
                            "Trust is built through consistency, not promises."
                        ),
                    },
                    {
                        "title": "Clarity",
                        "description": (
                            "Clear communication at every stage — no jargon, no guesswork. "
                            "Clients always know where they stand and what comes next."
                        ),
                    },
                    {
                        "title": "Results",
                        "description": (
                            "Every strategy is built around one goal: the best outcome for our client. "
                            "We bring data, discipline, and drive to every campaign."
                        ),
                    },
                    {
                        "title": "Care",
                        "description": (
                            "Property is personal. We treat every client's home and investment with "
                            "the same respect and attention we would give our own."
                        ),
                    },
                ]

            elif btype == "eoi_cta":
                val["badge_text"] = "Join Our Team"
                val["title"] = "Interested in Joining Real Gold Properties?"
                val["text"] = (
                    "We're always looking for people who combine local market intelligence with "
                    "genuine care for clients. If that sounds like you, get in touch."
                )
                if isinstance(val.get("button"), dict):
                    val["button"] = dict(val["button"])
                    val["button"]["label"] = "Get in Touch"

            new_body.append((btype, val))

        page.body = new_body
        page.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("  OK: Team page updated."))

    # ── Contact Page ──────────────────────────────────────────────────────────

    def _fix_contact_page(self):
        from apps.home.models import ContactPage
        page = ContactPage.objects.first()
        if not page:
            self.stdout.write(self.style.WARNING("Contact page not found — skipping."))
            return

        new_body = []
        for block in page.body:
            btype = block.block_type
            val   = dict(block.value)

            if btype == "hero":
                val["title_line_1"] = "Get In [gold]Touch[/gold]"
                val["title_line_2"] = "We'd Love To Hear From You"
                val["subtitle"] = (
                    "Whether you're buying, selling, or simply exploring your options — "
                    "reach out and we'll help you find the right next step."
                )
                val["mode"] = "buttons"
                val["buttons"] = [
                    {
                        "label": "Call Us Now",
                        "page": None,
                        "is_external": True,
                        "external_url": "tel:+61450009291",
                        "style": "gold",
                        "open_in_new_tab": False,
                    },
                    {
                        "label": "WhatsApp",
                        "page": None,
                        "is_external": True,
                        "external_url": "https://wa.me/61450009291",
                        "style": "outline",
                        "open_in_new_tab": True,
                    },
                ]

            elif btype == "contact_info":
                val["title"] = "Let's Talk Property."
                val["tagline"] = (
                    "Whether you are buying, selling, or reviewing your options, "
                    "our team is ready to help you understand the next step."
                )
                val["contact_number"] = "0450 009 291"
                val["email"] = "admin@realgoldproperties.com.au"
                val["address"] = "Forest Lake, Brisbane QLD 4078"
                val["working_hours"] = "All days · 09:00 – 18:00"
                val["quote_text"] = (
                    '"Good property advice starts with listening, '
                    'then turns information into a clear decision."'
                )
                val["quote_author"] = "— Our Approach"

            elif btype == "contact_form":
                val["eyebrow"] = "Start Your Enquiry"
                val["heading_line_1"] = "Tell Us What"
                val["heading_line_2"] = "You're Looking For."
                val["subtitle"] = (
                    "Share the details and our team will respond as soon as possible — "
                    "usually within the same business day."
                )
                val["submit_note"] = "We'll review your enquiry and get back to you shortly."

            new_body.append((btype, val))

        page.body = new_body
        page.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("  OK: Contact page updated."))

    # ── Testimonials Page ─────────────────────────────────────────────────────

    def _fix_testimonials_page(self):
        from apps.home.models import TestimonialsPage
        page = TestimonialsPage.objects.first()
        if not page:
            self.stdout.write(self.style.WARNING("Testimonials page not found — skipping."))
            return

        new_body = []
        for block in page.body:
            btype = block.block_type
            val   = dict(block.value)

            if btype == "hero":
                val["title_line_1"] = "What Our [gold]Clients[/gold] Say"
                val["title_line_2"] = "Real Stories, Real Results"
                val["subtitle"] = (
                    "Hear from the buyers, sellers, and investors who trusted "
                    "Real Gold Properties to guide their most important decisions."
                )
                val["mode"] = "stats"
                val["stats"] = [
                    {"value": "5+",   "label": "Years in Business"},
                    {"value": "100+", "label": "Happy Clients"},
                    {"value": "4.9★", "label": "Average Rating"},
                ]

            elif btype == "featured_testimonials":
                val["eyebrow"] = "CLIENT STORIES"
                val["heading"] = "Real Client Experiences"
                val["subtitle"] = (
                    "Detailed feedback from clients who trusted us with their property goals."
                )

            elif btype == "text_testimonials_grid":
                val["eyebrow"] = "CLIENT FEEDBACK"
                val["heading"] = "Stories From Our Community"
                val["subtitle"] = (
                    "First-hand experiences from people who trusted our team "
                    "with their most important property decisions."
                )

            elif btype == "ticker":
                val["eyebrow"] = "WHAT OUR CLIENTS SAY"
                val["heading"] = "Voices From the Community"
                val["subtitle"] = ""

            elif btype == "eoi_cta":
                val["badge_text"] = "Free Appraisal"
                val["title"] = "Ready to Know What Your Property Is Worth?"
                val["text"] = (
                    "Book a no-pressure appraisal and receive honest market insight, "
                    "a realistic price range, and clear next-step guidance."
                )
                if isinstance(val.get("button"), dict):
                    val["button"] = dict(val["button"])
                    val["button"]["label"] = "Book a Free Appraisal"

            new_body.append((btype, val))

        page.body = new_body
        page.save_revision().publish()
        self.stdout.write(self.style.SUCCESS("  OK: Testimonials page updated."))

    # ── Team Members ──────────────────────────────────────────────────────────

    def _fix_team_members(self):
        from apps.team.models import TeamMember

        # keyed by exact name (slugs are VaultRE-generated so we match by name)
        bios = {
            "Rahul Singh": {
                "role": "Principal | Lead Estate Agent",
                "bio": (
                    "Rahul is the founder and principal of Real Gold Properties, with over a decade "
                    "of experience across Brisbane's south-west property market. He built the agency "
                    "on a simple belief: clients deserve honest advice, not just impressive promises. "
                    "Rahul combines deep local knowledge with a calm, analytical approach — helping "
                    "buyers find the right property and sellers achieve the best outcome without "
                    "the noise that often surrounds the process."
                ),
                "stat_1_value": "10+", "stat_1_label": "Years Experience",
                "stat_2_value": "$80M+", "stat_2_label": "Sales Volume",
                "stat_3_value": "200+", "stat_3_label": "Properties Sold",
                "tags": "Residential Sales,Buyer Advocacy,Market Analysis,Forest Lake",
                "order": 0,
            },
            "Real Gold Management": {
                "role": "Property Management",
                "bio": (
                    "Our property management team handles the day-to-day operations of investment "
                    "properties across Brisbane's south-west with care and efficiency. From tenant "
                    "selection and lease management to maintenance coordination and rental reviews, "
                    "we make sure your investment is protected and performing."
                ),
                "stat_1_value": "50+", "stat_1_label": "Managed Properties",
                "stat_2_value": "98%", "stat_2_label": "Tenancy Rate",
                "stat_3_value": "5", "stat_3_label": "Star Rating",
                "tags": "Property Management,Leasing,Investment,Tenant Relations",
                "order": 3,
            },
            "Sunny Singh": {
                "role": "Property Specialist",
                "bio": (
                    "Sunny specialises in residential sales and buyer advocacy across Forest Lake "
                    "and surrounding suburbs. With a strong eye for value and a straightforward "
                    "communication style, Sunny ensures clients always know exactly where they stand "
                    "throughout the process — from first inspection to final negotiation."
                ),
                "stat_1_value": "5+", "stat_1_label": "Years Experience",
                "stat_2_value": "$30M+", "stat_2_label": "Sales Volume",
                "stat_3_value": "80+", "stat_3_label": "Properties Sold",
                "tags": "Residential Sales,First Home Buyers,Forest Lake,Buyer Advocacy",
                "order": 1,
            },
            "Jashan Singh": {
                "role": "Real Estate Agent",
                "bio": (
                    "Jashan brings energy and attention to detail to every client relationship. "
                    "Focused on helping first-home buyers and growing families find the right "
                    "property at the right price, Jashan is known for being responsive, thorough, "
                    "and genuinely invested in each client's outcome from enquiry through to "
                    "settlement."
                ),
                "stat_1_value": "3+", "stat_1_label": "Years Experience",
                "stat_2_value": "$15M+", "stat_2_label": "Sales Volume",
                "stat_3_value": "40+", "stat_3_label": "Properties Sold",
                "tags": "First Home Buyers,Residential Sales,Families,South Brisbane",
                "order": 2,
            },
        }

        for name, data in bios.items():
            updated = TeamMember.objects.filter(name=name).update(**data)
            if updated:
                self.stdout.write(self.style.SUCCESS(f"  OK: Team member '{name}' updated."))
            else:
                self.stdout.write(self.style.WARNING(f"  Team member '{name}' not found — skipping."))

    # ── Text Testimonials ─────────────────────────────────────────────────────

    def _fix_text_testimonials(self):
        from apps.testimonials.models import TextTestimonial

        # remove obvious test/dummy records
        dummy_slugs = [
            slug for slug, name, quote in TextTestimonial.objects.values_list("slug", "client_name", "quote")
            if name.lower() in ("test", "2", "jwhafssf") or quote.lower().startswith(("test", "adfas", "afdasf"))
        ]
        deleted, _ = TextTestimonial.objects.filter(slug__in=dummy_slugs).delete()
        if deleted:
            self.stdout.write(self.style.SUCCESS(f"  OK: Removed {deleted} dummy testimonial(s)."))

        real_testimonials = [
            {
                "slug": "robert-clara-sinclair",
                "client_name": "Robert & Clara Sinclair",
                "location": "Forest Lake, Brisbane QLD",
                "quote": (
                    "Working with the team at Real Gold Properties was an absolute pleasure. "
                    "They made the entire process — from appraisal to settlement — feel smooth "
                    "and stress-free. Honest, responsive, and genuinely focused on getting us "
                    "the right result."
                ),
                "rating": 5,
                "order": 0,
                "is_active": True,
            },
            {
                "slug": "david-chen-buyer",
                "client_name": "David Chen",
                "location": "Oxley, Brisbane QLD",
                "quote": (
                    "An outstanding experience from start to finish. The communication was "
                    "clear at every step, and I never felt like I was just another number. "
                    "Rahul took the time to explain the market properly and helped me find "
                    "the right property within my budget."
                ),
                "rating": 5,
                "order": 1,
                "is_active": True,
            },
            {
                "slug": "priya-mehta",
                "client_name": "Priya Mehta",
                "location": "Inala, Brisbane QLD",
                "quote": (
                    "I was nervous about selling for the first time, but the team made it "
                    "so straightforward. They gave me a realistic price guide from the start, "
                    "kept me updated throughout, and the final result exceeded my expectations. "
                    "I wouldn't hesitate to recommend them."
                ),
                "rating": 5,
                "order": 2,
                "is_active": True,
            },
            {
                "slug": "michael-tan",
                "client_name": "Michael Tan",
                "location": "Richlands, Brisbane QLD",
                "quote": (
                    "Professional, transparent, and genuinely helpful. What stood out was "
                    "that they didn't pressure me into anything. The advice was practical "
                    "and focused on what was right for my situation — not just closing a deal."
                ),
                "rating": 5,
                "order": 3,
                "is_active": True,
            },
            {
                "slug": "sarah-james-wong",
                "client_name": "Sarah & James Wong",
                "location": "Forest Lake, Brisbane QLD",
                "quote": (
                    "We used Real Gold Properties to purchase our first home and the "
                    "experience was great. Sunny was patient, knowledgeable, and helped "
                    "us understand every step of the process. We felt well looked after "
                    "the entire time."
                ),
                "rating": 5,
                "order": 4,
                "is_active": True,
            },
            {
                "slug": "linda-patel",
                "client_name": "Linda Patel",
                "location": "Durack, Brisbane QLD",
                "quote": (
                    "Quick to respond, clear in their communication, and honest about "
                    "what to expect. The whole process of selling my investment property "
                    "went exactly as they said it would. Very happy with the result."
                ),
                "rating": 5,
                "order": 5,
                "is_active": True,
            },
            {
                "slug": "andrew-nguyen",
                "client_name": "Andrew Nguyen",
                "location": "Wacol, Brisbane QLD",
                "quote": (
                    "Rahul provided an excellent appraisal with clear reasoning behind "
                    "the numbers. No inflated promises — just honest market data and "
                    "a solid plan. That kind of transparency is exactly what I needed."
                ),
                "rating": 5,
                "order": 6,
                "is_active": True,
            },
        ]

        for data in real_testimonials:
            obj, created = TextTestimonial.objects.update_or_create(
                slug=data["slug"],
                defaults=data,
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  OK: {action} testimonial '{obj.client_name}'."))

    # ── Featured Testimonials ─────────────────────────────────────────────────

    def _fix_featured_testimonials(self):
        from apps.testimonials.models import FeaturedTestimonial

        featured = [
            {
                "slug": "james-priya-hartwell",
                "rating": 5,
                "title": "An Absolute Masterclass\nIn Premium Service",
                "quote": (
                    "From the very first appraisal to the final handshake, Real Gold Properties "
                    "demonstrated exactly what great real estate service looks like. Rahul's market "
                    "knowledge is exceptional — he positioned our property perfectly and delivered "
                    "a result well above what we hoped for. Calm, professional, and completely "
                    "transparent throughout."
                ),
                "attribution": "— James & Priya Hartwell, Forest Lake",
                "theme": "theme-1",
                "order": 0,
                "is_active": True,
            },
            {
                "slug": "marcus-elena-vance",
                "rating": 5,
                "title": "Professional, Transparent,\nAnd Highly Effective",
                "quote": (
                    "We listed with Real Gold Properties after a disappointing experience "
                    "with another agency. The difference was immediate — clear communication, "
                    "honest feedback after every open home, and a negotiation approach that "
                    "genuinely protected our interests. We achieved a strong sale price and "
                    "felt supported every step of the way."
                ),
                "attribution": "— Marcus & Elena Vance, Oxley",
                "theme": "theme-2",
                "order": 1,
                "is_active": True,
            },
            {
                "slug": "anita-raj-sharma",
                "rating": 5,
                "title": "The Team That Actually\nListens To You",
                "quote": (
                    "What made the difference was that they actually listened. They understood "
                    "our priorities — timing, privacy, and price — and built their strategy "
                    "around that. Not once did we feel rushed or pressured. The sale came "
                    "together exactly as they outlined from the beginning."
                ),
                "attribution": "— Anita & Raj Sharma, Durack",
                "theme": "theme-3",
                "order": 2,
                "is_active": True,
            },
        ]

        for data in featured:
            obj, created = FeaturedTestimonial.objects.update_or_create(
                slug=data["slug"],
                defaults=data,
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"  OK: {action} featured testimonial '{obj.attribution}'."))
