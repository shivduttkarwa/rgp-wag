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
    URLBlock,
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


class ServiceCardBlock(StructBlock):
    theme       = ChoiceBlock(choices=[("buy", "Buy"), ("sell", "Sell"), ("rent", "Rent")], default="buy")
    headline    = CharBlock(default="Advisory")
    title       = CharBlock(default="Buyer Support")
    subtitle    = CharBlock(default="And Guidance")
    description = TextBlock()
    features    = ListBlock(CharBlock(), help_text="One feature per row")
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

    cta_eyebrow         = CharBlock(default="Need Guidance?")
    cta_title           = CharBlock(default="Not Sure Where to")
    cta_title_em        = CharBlock(default="Start?")
    cta_text            = TextBlock(default="Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.")
    cta_primary         = CtaBlock()
    cta_secondary       = CtaBlock()

    class Meta:
        icon  = "list-ul"
        label = "Services Section"


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
    items         = ListBlock(VideoTestimonialItemBlock())

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


# ─── Home page stream ────────────────────────────────────────────────────────

class HomePageStreamBlock(StreamBlock):
    hero               = HeroBlock()
    intro              = IntroBlock()
    property_listing   = PropertyListingSectionBlock()
    services           = ServiceSectionBlock()
    video_testimonials = VideoTestimonialsSectionBlock()
    portfolio          = PortfolioSectionBlock()

    class Meta:
        block_counts = {
            "hero":               {"min_num": 0, "max_num": 1},
            "intro":              {"min_num": 0, "max_num": 1},
            "property_listing":   {"min_num": 0, "max_num": 1},
            "services":           {"min_num": 0, "max_num": 1},
            "video_testimonials": {"min_num": 0, "max_num": 1},
            "portfolio":          {"min_num": 0, "max_num": 1},
        }
