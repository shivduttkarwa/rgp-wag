"""
StreamField block definitions for the HomePage.
One block per frontend section — keeps the editor panel clean and purposeful.
"""
from wagtail.blocks import (
    BooleanBlock,
    CharBlock,
    ChoiceBlock,
    ListBlock,
    StreamBlock,
    StructBlock,
    TextBlock,
)
from wagtail.images.blocks import ImageChooserBlock
from wagtail.snippets.blocks import SnippetChooserBlock


# ─── Reusable primitives ─────────────────────────────────────────────────────

class CtaBlock(StructBlock):
    label = CharBlock(required=False)
    href  = CharBlock(required=False, help_text="Relative path (e.g. /properties) or full URL")

    class Meta:
        icon  = "link"
        label = "Call to action"


class InternalHeroButtonBlock(StructBlock):
    label = CharBlock(required=True)
    href = CharBlock(
        required=False,
        help_text="Relative path (e.g. /contact), tel:/mailto:, or full URL",
    )
    style = ChoiceBlock(
        choices=[
            ("gold", "Gold"),
            ("blue", "Blue"),
            ("outline", "Outline"),
        ],
        default="gold",
        required=False,
    )
    open_in_new_tab = BooleanBlock(required=False, default=False)

    class Meta:
        icon = "link"
        label = "Hero Button"


class InternalHeroStatBlock(StructBlock):
    value = CharBlock(required=True, help_text="e.g. 5, 100%, 350+")
    label = CharBlock(required=True, help_text="e.g. Avg. Rating")

    class Meta:
        icon = "pick"
        label = "Hero Stat"


class InternalPageHeroBlock(StructBlock):
    title_line_1 = CharBlock(default="")
    title_line_2 = CharBlock(default="")
    subtitle = TextBlock(default="")
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick hero background image from media library.",
    )
    background_image_url = CharBlock(
        required=False,
        default="",
        help_text="Fallback image path relative to public/ or full URL.",
    )
    show_video = BooleanBlock(
        required=False,
        default=False,
        help_text="Enable to use the optional hero background video.",
    )
    background_video_url = CharBlock(
        required=False,
        default="",
        help_text="Video path relative to public/ or full URL (used when video is enabled).",
    )
    mode = ChoiceBlock(
        choices=[
            ("none", "No panel"),
            ("buttons", "Buttons panel"),
            ("stats", "Stats slab"),
        ],
        default="buttons",
        required=False,
        help_text="Choose whether the hero shows buttons, stats, or no panel.",
    )
    buttons = ListBlock(
        InternalHeroButtonBlock(),
        required=False,
        help_text="Used when mode is Buttons panel.",
    )
    stats = ListBlock(
        InternalHeroStatBlock(),
        required=False,
        help_text="Used when mode is Stats slab.",
    )

    class Meta:
        icon = "image"
        label = "Internal Page Hero"


class SearchTabBlock(StructBlock):
    label = CharBlock(help_text="Tab label, e.g. Buy")
    icon  = ChoiceBlock(
        choices=[
            ("buy",   "Buy (house icon)"),
            ("rent",  "Rent (key icon)"),
            ("sold",  "Sold (badge icon)"),
            ("agent", "Agent (person search icon)"),
        ],
        help_text="Icon shown above the label",
    )
    href = CharBlock(help_text="e.g. /properties?cat=for-sale")

    class Meta:
        icon  = "link"
        label = "Search Tab"


# ─── Section blocks ──────────────────────────────────────────────────────────

class HeroBlock(StructBlock):
    title_line_1 = CharBlock(
        default="Your [gold]Dream[/gold] Home",
        help_text="Use [gold]…[/gold] or [amber]…[/amber] for accent colour",
    )
    title_line_2 = CharBlock(default="[amber]Perfectly[/amber] Delivered")
    subtitle     = TextBlock(
        default="350+ premium properties delivered — luxury villas, penthouses & exclusive estates crafted for those who demand the extraordinary.",
    )
    search_tabs  = ListBlock(
        SearchTabBlock(),
        help_text="Quick-access tabs shown below the hero text (Buy / Rent / Sold / Agent)",
    )

    # ── Background image ──────────────────────────────────────────────────────
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick an image from the media library. Takes priority over the URL field below.",
    )
    background_image_url = CharBlock(
        required=False,
        default="images/hero-rpg-brisbane.jpg",
        help_text="Fallback: path relative to public/ folder or full URL (used only if no image is chosen above).",
    )

    # ── Background video ──────────────────────────────────────────────────────
    background_video_url = CharBlock(
        required=False,
        default="vids/hero-rgp.mp4",
        help_text=(
            "Direct video file path (e.g. vids/hero-rgp.mp4) "
            "OR a Vimeo page URL (e.g. https://vimeo.com/123456789). "
            "Vimeo videos play as a muted background loop automatically."
        ),
    )
    show_video = BooleanBlock(required=False, default=True)

    class Meta:
        icon  = "image"
        label = "Hero Section"


class IntroBlock(StructBlock):
    label            = CharBlock(default="About the Founder")
    headline_line1   = CharBlock(default="Building Wealth")
    headline_line2   = CharBlock(default="Through Property,")
    founder_name     = CharBlock(default="— Rahul Singh")
    body             = TextBlock(default="Real Gold Properties is a vision turned reality — a private equity approach to multi-family real estate. Founded by Rahul Singh, we focus on disciplined acquisitions that deliver consistent returns.")
    primary_cta      = CtaBlock()
    secondary_cta    = CtaBlock()
    image            = ImageChooserBlock(
        required=False,
        help_text="Pick founder image from media library. Takes priority over URL fallback.",
    )
    image_url        = CharBlock(default="images/rahul-singh.jpg",
                                  help_text="Fallback path relative to public/ folder or full URL")

    class Meta:
        icon  = "user"
        label = "Intro / Founder Section"


class PropertyListingSectionBlock(StructBlock):
    eyebrow  = CharBlock(default="Our Listings")
    heading  = CharBlock(default="Available Properties")
    subtitle = TextBlock(required=False, default="Explore our current listings across South-East Queensland.")
    cards    = ListBlock(
        SnippetChooserBlock("properties.Property"),
        required=False,
        help_text="Select listing cards shown in this section. Filters use each card's listing category.",
    )

    class Meta:
        icon  = "home"
        label = "Property Listing Section"


class EoiCtaSectionBlock(StructBlock):
    badge_text = CharBlock(default="Expression of Interest")
    title = CharBlock(default="Ready to make an offer on a property you love?")
    text = TextBlock(default="Complete our full Expression of Interest form with the exact buyer, offer, condition, and solicitor details needed for a clean review.")
    button_label = CharBlock(default="Open the Form")
    button_href = CharBlock(default="/expressions-of-interest", help_text="Relative path (e.g. /expressions-of-interest) or full URL")
    background_image = ImageChooserBlock(
        required=False,
        help_text="Desktop background image. Takes priority over URL fallback.",
    )
    background_image_url = CharBlock(
        required=False,
        default="images/eoi-cta.jpg",
        help_text="Fallback desktop image path relative to public/ or full URL.",
    )
    mobile_background_image = ImageChooserBlock(
        required=False,
        help_text="Mobile background image. Takes priority over URL fallback.",
    )
    mobile_background_image_url = CharBlock(
        required=False,
        default="images/eoi-cta-mob.jpg",
        help_text="Fallback mobile image path relative to public/ or full URL.",
    )
    min_height = CharBlock(required=False, default="100vh")
    mobile_min_height = CharBlock(required=False, default="70vh")

    class Meta:
        icon = "placeholder"
        label = "EOI CTA Block"


class ServiceCardBlock(StructBlock):
    theme       = ChoiceBlock(choices=[("buy", "Buy"), ("sell", "Sell"), ("rent", "Rent")], default="buy")
    headline    = CharBlock(default="Advisory")
    title       = CharBlock(default="Buyer Support")
    subtitle    = CharBlock(default="And Guidance")
    description = TextBlock()
    cta_label   = CharBlock(default="Speak With Us")

    class Meta:
        icon  = "pick"
        label = "Service Card"


class ServiceSectionBlock(StructBlock):
    header_eyebrow   = CharBlock(default="How Can We Help You?")
    header_title     = CharBlock(default="What Are You")
    header_title_em  = CharBlock(default="Looking For?")
    header_subtitle  = TextBlock(default="Whether you're buying, selling, or renting — we're here to make your real estate journey seamless and rewarding.")
    services         = ListBlock(ServiceCardBlock())

    class Meta:
        icon  = "list-ul"
        label = "Service Selection Block"


class CtaSectionBlock(StructBlock):
    eyebrow    = CharBlock(default="Need Guidance?")
    title      = CharBlock(default="Not Sure Where to")
    title_em   = CharBlock(default="Start?")
    text       = TextBlock(default="Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.")
    primary    = CtaBlock()
    secondary  = CtaBlock()
    use_video  = BooleanBlock(
        required=False,
        default=True,
        help_text="Enable video background mode. When off, image background is used.",
    )
    background_image = ImageChooserBlock(
        required=False,
        help_text="Image mode background. Also used as fallback if video is unavailable.",
    )
    background_image_url = CharBlock(
        required=False,
        default="images/hero1.jpg",
        help_text="Fallback image path relative to public/ or full URL.",
    )
    background_video_url = CharBlock(
        required=False,
        default="vids/cta-vid.mp4",
        help_text="Video path relative to public/ or full URL. Used when video mode is enabled.",
    )
    video_poster_image = ImageChooserBlock(
        required=False,
        help_text="Poster image shown before video loads. Used only when video mode is enabled.",
    )
    video_poster_image_url = CharBlock(
        required=False,
        default="images/hero1.jpg",
        help_text="Fallback poster path relative to public/ or full URL.",
    )
    min_height = CharBlock(required=False, default="100vh")

    class Meta:
        icon  = "placeholder"
        label = "CTA Block"


class PropertyCtaCommitmentBlock(StructBlock):
    title = CharBlock(default="Data-backed guidance")

    class Meta:
        icon = "doc-full"
        label = "Property CTA Commitment"


class PropertyCtaBlock(StructBlock):
    eyebrow = CharBlock(default="Need Help Choosing?")
    title = CharBlock(default="Let's Find Your")
    title_em = CharBlock(default="Perfect Home")
    text = TextBlock(
        default=(
            "Tell us what you're looking for and we'll shortlist the best "
            "options, arrange inspections, and guide you through every step."
        ),
    )
    primary = CtaBlock()
    secondary = CtaBlock(required=False)
    commitments = ListBlock(
        PropertyCtaCommitmentBlock(),
        required=False,
        help_text="Optional right-column commitments.",
    )
    use_video = BooleanBlock(
        required=False,
        default=True,
        help_text="Enable video background mode. When off, image background is used.",
    )
    background_image = ImageChooserBlock(
        required=False,
        help_text="Image mode background. Also used as fallback if video is unavailable.",
    )
    background_image_url = CharBlock(
        required=False,
        default="images/int.jpg",
        help_text="Fallback image path relative to public/ or full URL.",
    )
    background_video_url = CharBlock(
        required=False,
        default="vids/cta-2-vid.mp4",
        help_text="Video path relative to public/ or full URL. Used when video mode is enabled.",
    )
    video_poster_image = ImageChooserBlock(
        required=False,
        help_text="Poster image shown before video loads. Used only when video mode is enabled.",
    )
    video_poster_image_url = CharBlock(
        required=False,
        default="images/int.jpg",
        help_text="Fallback poster path relative to public/ or full URL.",
    )
    min_height = CharBlock(required=False, default="100vh")

    class Meta:
        icon = "placeholder"
        label = "Property CTA Block"


class VideoTestimonialItemBlock(StructBlock):
    kicker    = CharBlock(help_text="e.g. SUNNYBANK · SOLD")
    name      = CharBlock(help_text="Client name shown on the card")
    video_url = CharBlock(help_text="Path relative to public/ or full URL")
    poster_image = ImageChooserBlock(
        required=False,
        help_text="Pick poster image from media library. Takes priority over URL fallback.",
    )
    poster_url = CharBlock(help_text="Thumbnail image URL")
    tint      = ChoiceBlock(choices=[("gold", "Gold"), ("amber", "Amber"), ("crimson", "Crimson")], default="gold")

    class Meta:
        icon  = "media"
        label = "Video Testimonial"


class VideoTestimonialsSectionBlock(StructBlock):
    section_label = CharBlock(default="Testimonials")
    heading       = CharBlock(default="What Our")
    heading_em    = CharBlock(default="Clients Say")
    items         = ListBlock(
        VideoTestimonialItemBlock(),
        required=False,
        help_text=(
            "Optional manual fallback only. "
            "If active records exist in CMS sidebar -> Testimonial -> Video Testimonial, "
            "those are used automatically on the homepage API."
        ),
    )

    class Meta:
        icon  = "media"
        label = "Video Testimonials Section"


class ShowcasePropertyItemBlock(StructBlock):
    title         = CharBlock()
    location      = CharBlock()
    price         = CharBlock()
    status        = CharBlock(default="For Sale")
    image         = ImageChooserBlock(
        required=False,
        help_text="Pick property image from media library. Takes priority over URL fallback.",
    )
    image_url     = CharBlock(help_text="Path relative to public/ folder or full URL")
    beds          = CharBlock(required=False)
    baths         = CharBlock(required=False)
    area          = CharBlock(required=False, help_text="e.g. 2,400")
    property_slug = CharBlock(required=False, help_text="Links to /properties/<slug>")

    class Meta:
        icon  = "home"
        label = "Showcase Property"


class PortfolioSectionBlock(StructBlock):
    eyebrow   = CharBlock(default="REAL GOLD PROPERTIES")
    heading   = CharBlock(default="Featured")
    heading_em = CharBlock(default="Properties")
    subtitle  = TextBlock(default="Handpicked residences across Australia's most coveted neighbourhoods — every listing curated for quality, location, and lasting value.")
    projects  = ListBlock(ShowcasePropertyItemBlock())

    class Meta:
        icon  = "folder-open-inverse"
        label = "Portfolio Showcase Section"


class ContactInfoBlock(StructBlock):
    title = CharBlock(default="Let's Talk Appraisal.")
    tagline = TextBlock(
        default=(
            "Whether you're buying, selling, or investing — our advisors are ready "
            "to guide you through every step."
        ),
    )
    contact_number = CharBlock(default="0450 009 291")
    email = CharBlock(default="admin@realgoldproperties.com.au")
    address = CharBlock(default="Forest Lake, Brisbane QLD 4078")
    working_hours = CharBlock(default="All days · 09:00 – 18:00")
    quote_text = TextBlock(
        default=(
            '"Real estate is not just a transaction — it is the beginning of a life '
            'lived better."'
        ),
    )
    quote_author = CharBlock(default="— Our Promise")

    class Meta:
        icon = "user"
        label = "Contact Info"


class FeaturedTestimonialsBlock(StructBlock):
    """
    Reusable block — editors control the section heading; all active
    FeaturedTestimonial snippet records render automatically in the SplitSlider.
    """

    eyebrow = CharBlock(
        required=False,
        default="Testimonials",
        help_text="Small label above the heading (e.g. 'Client Stories')",
    )
    heading = CharBlock(
        default="What Our Clients Say",
        help_text="Main section heading",
    )
    subtitle = TextBlock(
        required=False,
        default="",
        help_text="Optional sub-heading shown below the main heading",
    )

    class Meta:
        icon = "pick"
        label = "Featured Testimonials Slider"


class TestimonialTextGridBlock(StructBlock):
    """Section heading for the text testimonials bento grid (VoiceMosaic)."""

    eyebrow = CharBlock(required=False, default="Client Voices")
    heading = CharBlock(default="What Our Clients Say")
    subtitle = TextBlock(
        required=False,
        default="Real experiences from real clients — every word earned, never scripted.",
    )

    class Meta:
        icon = "openquote"
        label = "Text Testimonials Grid"


class TestimonialTickerBlock(StructBlock):
    """Infinite auto-scroll ticker strip. Items come automatically from Text Testimonial snippets."""

    class Meta:
        icon = "arrows-up-down"
        label = "Testimonial Ticker"


class TestimonialFinalCtaBlock(StructBlock):
    heading = CharBlock(default="Book a Free Appraisal")
    body = TextBlock(
        default="Get a clear price range, honest advice, and a plan that positions your property for a confident sale.",
    )
    primary_label = CharBlock(default="Book Your Appraisal")
    primary_href = CharBlock(required=False, default="/contact")
    secondary_label = CharBlock(default="Talk to Rahul")
    secondary_href = CharBlock(required=False, default="/contact")

    class Meta:
        icon = "placeholder"
        label = "Final CTA"


class TestimonialsPageStreamBlock(StreamBlock):
    """Main body stream for the Testimonials page — add, remove and reorder any section."""

    hero = InternalPageHeroBlock()
    featured_testimonials = FeaturedTestimonialsBlock()
    text_testimonials_grid = TestimonialTextGridBlock()
    ticker = TestimonialTickerBlock()
    final_cta = TestimonialFinalCtaBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "featured_testimonials": {"min_num": 0, "max_num": 1},
            "text_testimonials_grid": {"min_num": 0, "max_num": 1},
            "ticker": {"min_num": 0, "max_num": 1},
            "final_cta": {"min_num": 0, "max_num": 1},
        }


# kept for migration compatibility — no longer used in models
class TestimonialsPageContentStreamBlock(StreamBlock):
    featured_testimonials = FeaturedTestimonialsBlock()

    class Meta:
        block_counts = {
            "featured_testimonials": {"min_num": 0, "max_num": 1},
        }


# ─── About page blocks ───────────────────────────────────────────────────────

class AboutIntroBlock(StructBlock):
    statement = TextBlock(
        default="Rahul Singh is the appraisal-first agent behind Real Gold Properties — bringing local clarity, data-backed pricing, and calm negotiation to every homeowner.",
    )

    class Meta:
        icon = "doc-full"
        label = "Intro Statement"


class AboutSplitBlock(StructBlock):
    heading = CharBlock(default="Why Sellers Choose Rahul")
    p1 = TextBlock(
        default="He translates market noise into a clear, confident price position — with a strategy that attracts buyers and protects your upside.",
    )
    p2 = TextBlock(
        default="You get straight answers, a staged plan, and weekly feedback so the appraisal never sits still.",
    )
    bullets = ListBlock(
        CharBlock(),
        help_text="Key selling points shown as a bullet list.",
    )
    video_url = CharBlock(
        required=False,
        default="vids/rgp-video.mp4",
        help_text="Path relative to public/ or full URL.",
    )
    cta_label = CharBlock(default="Book Your Appraisal")
    cta_href = CharBlock(required=False, default="/contact")

    class Meta:
        icon = "media"
        label = "Why Sellers Choose (Split Section)"


class AboutOverlayBlock(StructBlock):
    heading = CharBlock(default="The Appraisal Strategy")
    text = TextBlock(
        default="Rahul's appraisals are more than a number. Each one is built to attract the right buyers and set a confident path to sale.",
    )
    image = ImageChooserBlock(
        required=False,
        help_text="Overlay background image. Takes priority over the URL field.",
    )
    image_url = CharBlock(
        required=False,
        default="images/int.jpg",
        help_text="Fallback image path relative to public/ or full URL.",
    )
    steps = ListBlock(
        CharBlock(),
        help_text="Numbered process steps shown in the overlay card.",
    )

    class Meta:
        icon = "image"
        label = "Appraisal Strategy Overlay"


class AboutAvailabilityBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="APPRAISAL")
    heading = CharBlock(default="Ready For Your Appraisal?")
    text = TextBlock(
        default="Book a free, no-pressure appraisal with Rahul Singh. You'll get a clear price range, honest advice, and a next-step plan.",
    )
    image = ImageChooserBlock(
        required=False,
        help_text="Section photo. Takes priority over the URL field.",
    )
    image_url = CharBlock(
        required=False,
        default="images/rahul-singh.jpg",
        help_text="Fallback image path relative to public/ or full URL.",
    )
    cta_label = CharBlock(default="Book Your Appraisal")
    cta_href = CharBlock(required=False, default="/contact")

    class Meta:
        icon = "pick"
        label = "Availability / Appraisal CTA"


class AboutPageStreamBlock(StreamBlock):
    hero = InternalPageHeroBlock()
    intro = AboutIntroBlock()
    split = AboutSplitBlock()
    overlay = AboutOverlayBlock()
    avail = AboutAvailabilityBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "intro": {"min_num": 0, "max_num": 1},
            "split": {"min_num": 0, "max_num": 1},
            "overlay": {"min_num": 0, "max_num": 1},
            "avail": {"min_num": 0, "max_num": 1},
        }


# ─── Team page blocks ────────────────────────────────────────────────────────

class TeamSectionBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="Our People")
    title_line_1 = CharBlock(default="The Minds")
    title_line_2 = CharBlock(default="[gold]Behind[/gold] Every Deal")
    subtitle = TextBlock(
        default="A curated ensemble of creative minds and industry veterans — each bringing unmatched expertise to every client engagement.",
    )

    class Meta:
        icon = "group"
        label = "Team Section Heading"


class TeamPageStreamBlock(StreamBlock):
    hero = InternalPageHeroBlock()
    team_section = TeamSectionBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "team_section": {"min_num": 0, "max_num": 1},
        }


class ContactPageContentStreamBlock(StreamBlock):
    contact_info = ContactInfoBlock()

    class Meta:
        block_counts = {
            "contact_info": {"min_num": 0, "max_num": 1},
        }


class ContactPageHeroStreamBlock(StreamBlock):
    internal_page_hero = InternalPageHeroBlock()

    class Meta:
        block_counts = {
            "internal_page_hero": {"min_num": 0, "max_num": 1},
        }


class PropertiesPageContentStreamBlock(StreamBlock):
    property_cta = PropertyCtaBlock()

    class Meta:
        block_counts = {
            "property_cta": {"min_num": 0, "max_num": 1},
        }


# ─── Home page stream ────────────────────────────────────────────────────────

class HomePageStreamBlock(StreamBlock):
    hero               = HeroBlock()
    intro              = IntroBlock()
    property_listing   = PropertyListingSectionBlock()
    eoi_cta            = EoiCtaSectionBlock()
    services           = ServiceSectionBlock()
    cta                = CtaSectionBlock()
    video_testimonials = VideoTestimonialsSectionBlock()
    portfolio          = PortfolioSectionBlock()

    class Meta:
        block_counts = {
            "hero":               {"min_num": 0, "max_num": 1},
            "intro":              {"min_num": 0, "max_num": 1},
            "property_listing":   {"min_num": 0, "max_num": 1},
            "eoi_cta":            {"min_num": 0, "max_num": 1},
            "services":           {"min_num": 0, "max_num": 1},
            "cta":                {"min_num": 0, "max_num": 1},
            "video_testimonials": {"min_num": 0, "max_num": 1},
            "portfolio":          {"min_num": 0, "max_num": 1},
        }
