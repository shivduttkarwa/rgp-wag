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
    title_line_1 = CharBlock(default="Get In [gold]Touch[/gold]")
    title_line_2 = CharBlock(default="[amber]We're[/amber] Here")
    subtitle = TextBlock(
        default="Our team is ready to guide you — from first enquiry to final key.",
    )
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick hero background image from media library.",
    )
    background_image_url = CharBlock(
        required=False,
        default="images/contact-hero.jpg",
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
