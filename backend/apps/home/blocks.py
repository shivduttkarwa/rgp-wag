"""
StreamField block definitions for the HomePage.
One block per frontend section — keeps the editor panel clean and purposeful.
"""
from wagtail.blocks import (
    BooleanBlock,
    CharBlock,
    ChoiceBlock,
    IntegerBlock,
    ListBlock,
    PageChooserBlock,
    StreamBlock,
    StructBlock,
    TextBlock,
)
from wagtail.documents.blocks import DocumentChooserBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtail.snippets.blocks import SnippetChooserBlock


# ─── Reusable primitives ─────────────────────────────────────────────────────

class CtaStatBlock(StructBlock):
    value = CharBlock(help_text="e.g. 350+, 98%, $1.2M")
    label = CharBlock(help_text="e.g. Properties Sold")

    class Meta:
        icon  = "pick"
        label = "Stat"


class CtaBlock(StructBlock):
    label = CharBlock(required=False)
    page = PageChooserBlock(
        required=False,
        help_text="Choose an internal page to link to.",
    )
    is_external = BooleanBlock(
        required=False,
        default=False,
        help_text="Check to link to an external URL instead of a page above.",
    )
    external_url = CharBlock(
        required=False,
        help_text="Full URL — only used when 'External URL' is checked above.",
    )

    class Meta:
        icon  = "link"
        label = "Call to action"


class InternalHeroButtonBlock(StructBlock):
    label = CharBlock(required=False)
    page = PageChooserBlock(
        required=False,
        help_text="Choose an internal page to link to.",
    )
    is_external = BooleanBlock(
        required=False,
        default=False,
        help_text="Check to link to an external URL instead of a page above.",
    )
    external_url = CharBlock(
        required=False,
        help_text="Full URL — only used when 'External URL' is checked above.",
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


class ButtonBlock(StructBlock):
    """
    Reusable button block. Editor can choose an internal page, add an optional
    section anchor (#id), OR toggle 'external' and paste any URL.
    External links always open in a new tab.
    """
    label = CharBlock(
        required=True,
        help_text="Button label, e.g. 'Learn More'",
    )
    page = PageChooserBlock(
        required=False,
        help_text="Select an internal page to link to.",
    )
    section_anchor = CharBlock(
        required=False,
        help_text=(
            "Optional section ID on the target page — e.g. 'team' links to /about#team. "
            "Leave blank to link to the top of the page. "
            "Can be used without a page selected to link to a section on the same page."
        ),
    )
    is_external = BooleanBlock(
        required=False,
        default=False,
        help_text="Check to use a custom URL instead of selecting a page above.",
    )
    external_url = CharBlock(
        required=False,
        help_text="Full URL (https://…) — always opens in a new tab. Only used when 'Is external' is checked.",
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

    class Meta:
        icon  = "link"
        label = "Button"


class InternalHeroStatBlock(StructBlock):
    value = CharBlock(required=False, help_text="e.g. 5, 100%, 350+")
    label = CharBlock(required=False, help_text="e.g. Avg. Rating")

    class Meta:
        icon = "pick"
        label = "Hero Stat"


class InternalPageHeroBlock(StructBlock):
    title_line_1 = CharBlock(
        required=False,
        default="Lorem [gold]Ipsum[/gold] Dolor",
        help_text="Use [gold]word[/gold] for gold accent colour.",
    )
    title_line_2 = CharBlock(required=False, default="Sit Amet Consectetur")
    subtitle = TextBlock(
        default="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem non justo facilisis luctus.",
    )
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick hero background image from media library.",
    )
    show_video = BooleanBlock(
        required=False,
        default=False,
        help_text="Enable to use the optional hero background video.",
    )
    background_video = DocumentChooserBlock(
        required=False,
        help_text="Upload or choose a video file (mp4 recommended). Takes priority over URL below.",
    )
    background_video_url = CharBlock(
        required=False,
        default="",
        help_text="Fallback video URL — only used if no document is chosen above.",
    )
    mode = ChoiceBlock(
        choices=[
            ("none", "No panel"),
            ("buttons", "Buttons panel"),
            ("stats", "Stats slab"),
        ],
        default="none",
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
        form_classname = "struct-block internal-page-hero-block"


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
    page = PageChooserBlock(
        required=False,
        help_text="Select an internal page to link to.",
    )
    section_anchor = CharBlock(
        required=False,
        help_text="Optional section ID on the target page — e.g. 'listings' links to /properties#listings.",
    )
    is_external = BooleanBlock(
        required=False,
        default=False,
        help_text="Check to use a custom URL instead of selecting a page above.",
    )
    external_url = CharBlock(
        required=False,
        help_text="Full URL — opens in a new tab. Only used when 'Is external' is checked.",
    )

    class Meta:
        icon  = "link"
        label = "Search Tab"


class SectionTitleBlock(StructBlock):
    """
    Reusable section header. Drop into any section that needs an eyebrow,
    title, and optional description. Use [gold]word[/gold] in the title for
    the gold accent colour (same syntax as hero titles).
    """
    eyebrow = CharBlock(
        required=False,
        help_text="Small label above the title, e.g. 'Our Services'",
    )
    title = CharBlock(
        required=True,
        help_text="Section heading. Use [gold]word[/gold] for gold accent colour.",
    )
    description = TextBlock(
        required=False,
        help_text="Optional supporting text shown below the title.",
    )

    class Meta:
        icon  = "title"
        label = "Section Title"


# ─── Section blocks ──────────────────────────────────────────────────────────

class HeroBlock(StructBlock):
    title_line_1 = CharBlock(
        required=False,
        default="Find Your [gold]Next[/gold] Property",
        help_text="Use [gold]word[/gold] for gold accent colour.",
    )
    title_line_2 = CharBlock(required=False, default="With Confident Guidance")
    subtitle     = TextBlock(
        required=False,
        default=(
            "Explore carefully selected properties with local advice, clear "
            "market context, and support from enquiry through settlement."
        ),
    )
    search_tabs  = ListBlock(
        SearchTabBlock(),
        help_text="Quick-access tabs shown below the hero text (Buy / Rent / Sold / Agent)",
    )

    # ── Background image ──────────────────────────────────────────────────────
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick a background image from the media library.",
    )

    # ── Background video ──────────────────────────────────────────────────────
    background_video = DocumentChooserBlock(
        required=False,
        help_text="Upload or choose a video file from the document library (mp4 recommended).",
    )
    background_video_url = CharBlock(
        required=False,
        default="",
        help_text="Vimeo page URL (e.g. https://vimeo.com/123456789) — used only if no document is chosen above.",
    )
    show_video = BooleanBlock(required=False, default=True)

    class Meta:
        icon  = "image"
        label = "Hero Section"


class IntroBlock(StructBlock):
    label            = CharBlock(required=False, default="Founder Perspective")
    headline_line1   = CharBlock(required=False, default="Property Choices")
    headline_line2   = CharBlock(required=False, default="Made Clearer")
    founder_name     = CharBlock(required=False, default="— Real Gold Properties")
    body             = TextBlock(
        required=False,
        default=(
            "Real Gold Properties brings practical market insight, measured "
            "advice, and a client-first approach to every property decision."
        ),
    )
    primary_cta      = CtaBlock(required=False)
    secondary_cta    = CtaBlock(required=False)
    image            = ImageChooserBlock(
        required=False,
        help_text="Pick founder image from media library. Takes priority over URL fallback.",
    )
    image_url        = CharBlock(
        required=False,
        help_text="Optional full URL only if no image is chosen above.",
    )

    class Meta:
        icon  = "user"
        label = "Intro / Founder Section"


class PropertyListingSectionBlock(StructBlock):
    section_title = SectionTitleBlock(required=False)
    cards         = ListBlock(
        SnippetChooserBlock("properties.Property"),
        required=False,
        help_text="Select listing cards shown in this section. Filters use each card's listing category.",
    )

    class Meta:
        icon  = "home"
        label = "Property Listing Section"


class EoiCtaSectionBlock(StructBlock):
    badge_text = CharBlock(required=False, default="Expression of Interest")
    title = CharBlock(required=False, default="Ready to submit your property offer?")
    text = TextBlock(
        required=False,
        default=(
            "Share buyer details, offer terms, conditions, and solicitor "
            "information in one structured submission."
        ),
    )
    button_label = CharBlock(required=False, default="Start the Form")
    button_href = CharBlock(required=False, default="/expressions-of-interest", help_text="Relative path (e.g. /expressions-of-interest) or full URL")
    background_image = ImageChooserBlock(
        required=False,
        help_text="Desktop background image. Pick from media library.",
    )
    mobile_background_image = ImageChooserBlock(
        required=False,
        help_text="Mobile background image. Pick from media library.",
    )
    min_height = CharBlock(required=False, default="100vh")
    mobile_min_height = CharBlock(required=False, default="70vh")

    class Meta:
        icon = "placeholder"
        label = "EOI CTA Block"


class ServiceCardBlock(StructBlock):
    theme       = ChoiceBlock(choices=[("buy", "Buy"), ("sell", "Sell"), ("rent", "Rent")], default="buy")
    headline    = CharBlock(default="Consulting")
    title       = CharBlock(default="Buyer Guidance")
    subtitle    = CharBlock(default="And Strategy")
    description = TextBlock()
    cta_label   = CharBlock(default="Contact the Team")

    class Meta:
        icon  = "pick"
        label = "Service Card"


class ServiceSectionBlock(StructBlock):
    header_eyebrow   = CharBlock(default="How We Can Support You")
    header_title     = CharBlock(default="Choose The")
    header_title_em  = CharBlock(default="Right Next Step")
    header_subtitle  = TextBlock(default="Buying, selling, and leasing decisions become simpler with clear advice and local market perspective.")
    services         = ListBlock(ServiceCardBlock())

    class Meta:
        icon  = "list-ul"
        label = "Service Selection Block"


class CtaSectionBlock(StructBlock):
    eyebrow    = CharBlock(default="Need Direction?")
    title      = CharBlock(default="Unsure What Comes")
    title_em   = CharBlock(default="Next?")
    text       = TextBlock(default="Tell us your goals and we will help map a practical path through your next property decision.")
    primary    = CtaBlock()
    secondary  = CtaBlock()
    background_type = ChoiceBlock(
        choices=[
            ("image", "Background Image"),
            ("video", "Background Video"),
        ],
        default="image",
        required=False,
        help_text="Choose Image or Video background.",
    )
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick background image from media library. Used when 'Background Image' is selected.",
    )
    background_video = DocumentChooserBlock(
        required=False,
        help_text="Upload or choose a video file (mp4 recommended). Used when 'Background Video' is selected.",
    )
    video_poster_image = ImageChooserBlock(
        required=False,
        help_text="Poster image shown before video loads. Used when 'Background Video' is selected.",
    )
    stats = ListBlock(
        CtaStatBlock(),
        required=False,
        help_text="Optional trust stats shown below the CTA buttons (e.g. 350+ Properties Sold).",
    )
    min_height = CharBlock(required=False, default="100vh")

    class Meta:
        icon  = "placeholder"
        label = "CTA Block"


class PropertyCtaCommitmentBlock(StructBlock):
    title = CharBlock(default="Clear market guidance")

    class Meta:
        icon = "doc-full"
        label = "Property CTA Commitment"


class PropertyCtaBlock(StructBlock):
    eyebrow = CharBlock(default="Need Help Deciding?")
    title = CharBlock(default="Find The Property")
    title_em = CharBlock(default="That Fits")
    text = TextBlock(
        default=(
            "Share what matters most and we will help compare options, "
            "coordinate inspections, and clarify the next move."
        ),
    )
    primary = CtaBlock()
    secondary = CtaBlock(required=False)
    commitments = ListBlock(
        PropertyCtaCommitmentBlock(),
        required=False,
        help_text="Optional right-column commitments.",
    )
    background_type = ChoiceBlock(
        choices=[
            ("image", "Background Image"),
            ("video", "Background Video"),
        ],
        default="image",
        required=False,
        help_text="Choose Image or Video background.",
    )
    background_image = ImageChooserBlock(
        required=False,
        help_text="Pick background image from media library. Used when 'Background Image' is selected.",
    )
    background_video = DocumentChooserBlock(
        required=False,
        help_text="Upload or choose a video file (mp4 recommended). Used when 'Background Video' is selected.",
    )
    video_poster_image = ImageChooserBlock(
        required=False,
        help_text="Poster image shown before video loads. Used when 'Background Video' is selected.",
    )
    min_height = CharBlock(required=False, default="100vh")

    class Meta:
        icon = "placeholder"
        label = "Property CTA Block"


class VideoTestimonialsSectionBlock(StructBlock):
    section_label = CharBlock(default="Client Stories")
    heading       = CharBlock(default="Hear From")
    heading_em    = CharBlock(default="Our Clients")

    class Meta:
        icon  = "media"
        label = "Video Testimonials Section"


class PortfolioSectionBlock(StructBlock):
    eyebrow   = CharBlock(default="PROPERTY PORTFOLIO")
    heading   = CharBlock(default="Selected")
    heading_em = CharBlock(default="Homes")
    subtitle  = TextBlock(default="A focused collection of properties chosen for location, presentation, and long-term appeal.")

    class Meta:
        icon  = "folder-open-inverse"
        label = "Portfolio Showcase Section"


class ContactInfoBlock(StructBlock):
    title = CharBlock(default="Let's Talk Property.")
    tagline = TextBlock(
        default=(
            "Whether you are buying, selling, or reviewing your options, our team "
            "can help you understand the next step."
        ),
    )
    contact_number = CharBlock(default="0450 009 291")
    email = CharBlock(default="admin@realgoldproperties.com.au")
    address = CharBlock(default="Forest Lake, Brisbane QLD 4078")
    working_hours = CharBlock(default="All days · 09:00 – 18:00")
    quote_text = TextBlock(
        default=(
            '"Good property advice starts with listening, then turns information '
            'into a clear decision."'
        ),
    )
    quote_author = CharBlock(default="— Our Approach")

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
        default="Client Stories",
        help_text="Small label above the heading (e.g. 'Client Stories')",
    )
    heading = CharBlock(
        default="Real Client Feedback",
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

    eyebrow = CharBlock(required=False, default="Client Feedback")
    heading = CharBlock(default="Stories From Our Clients")
    subtitle = TextBlock(
        required=False,
        default="First-hand experiences from people who trusted the team with their property goals.",
    )

    class Meta:
        icon = "openquote"
        label = "Text Testimonials Grid"


class TestimonialTickerBlock(StructBlock):
    """Infinite auto-scroll ticker strip. Items come automatically from Text Testimonial snippets."""

    eyebrow = CharBlock(required=False, default="WHAT OUR CLIENTS SAY")
    heading = CharBlock(required=False, default="Voices From the Community")
    subtitle = TextBlock(required=False, default="")

    class Meta:
        icon = "arrows-up-down"
        label = "Testimonial Ticker"


class TestimonialFinalCtaBlock(StructBlock):
    heading = CharBlock(default="Request Your Property Appraisal")
    body = TextBlock(
        default="Receive a practical price range, market context, and a plan for moving forward with confidence.",
    )
    primary_label = CharBlock(default="Arrange an Appraisal")
    primary_href = CharBlock(required=False, default="/contact")
    secondary_label = CharBlock(default="Speak With the Team")
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
    cta = CtaSectionBlock()
    eoi_cta = EoiCtaSectionBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "featured_testimonials": {"min_num": 0, "max_num": 1},
            "text_testimonials_grid": {"min_num": 0, "max_num": 1},
            "ticker": {"min_num": 0, "max_num": 1},
            "final_cta": {"min_num": 0, "max_num": 1},
            "cta": {"min_num": 0, "max_num": 1},
            "eoi_cta": {"min_num": 0, "max_num": 1},
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
        default="Real Gold Properties brings calm advice, local market clarity, and practical pricing insight to each property conversation.",
        help_text="Wrap words in [gold]…[/gold] to highlight them in gold. E.g. [gold]Real Gold Properties[/gold] brings calm advice.",
    )

    class Meta:
        icon = "doc-full"
        label = "Intro Statement"


class AboutSplitBlock(StructBlock):
    heading = CharBlock(default="Why Sellers Choose This Approach")
    p1 = TextBlock(
        default="We turn market signals into a realistic pricing position and a campaign plan designed to attract qualified buyers.",
    )
    p2 = TextBlock(
        default="You receive plain-language advice, a staged process, and regular feedback so decisions stay informed.",
    )
    bullets = ListBlock(
        CharBlock(),
        help_text="Key selling points shown as a bullet list.",
    )
    video = DocumentChooserBlock(
        required=False,
        help_text="Upload or choose a video file from the CMS media library.",
    )
    video_url = CharBlock(
        required=False,
        default="",
        help_text="Fallback video URL if no document is selected above.",
    )
    cta_label = CharBlock(default="Arrange an Appraisal")
    cta_href = CharBlock(required=False, default="/contact")

    class Meta:
        icon = "media"
        label = "Why Sellers Choose (Split Section)"


class AboutOverlayBlock(StructBlock):
    heading = CharBlock(default="A Clear Appraisal Plan")
    text = TextBlock(
        default="Each appraisal is built around evidence, buyer demand, and a practical path toward a confident sale.",
    )
    image = ImageChooserBlock(
        required=False,
        help_text="Overlay background image. Takes priority over the URL field.",
    )
    image_url = CharBlock(
        required=False,
        default="",
        help_text="Optional full URL only if no image is chosen above.",
    )
    steps = ListBlock(
        CharBlock(),
        help_text="Numbered process steps shown in the overlay card.",
    )

    class Meta:
        icon = "image"
        label = "Appraisal Strategy Overlay"


class AboutAvailabilityBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="PROPERTY APPRAISAL")
    heading = CharBlock(default="Ready To Understand Your Value?")
    text = TextBlock(
        default="Request a no-pressure appraisal and receive a useful price range, market context, and next-step guidance.",
    )
    image = ImageChooserBlock(
        required=False,
        help_text="Section photo. Takes priority over the URL field.",
    )
    image_url = CharBlock(
        required=False,
        default="",
        help_text="Optional full URL only if no image is chosen above.",
    )
    cta_label = CharBlock(default="Request an Appraisal")
    cta_href = CharBlock(required=False, default="/contact")

    class Meta:
        icon = "pick"
        label = "Availability / Appraisal CTA"


class PropertyMarqueeBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="OUR LISTINGS")
    title = CharBlock(required=False, default="Properties That")
    title_em = CharBlock(required=False, default="Speak For Themselves")
    subtitle = CharBlock(required=False, default="Browse our current listings — from first homes to prestige properties, each one backed by honest advice and clear market insight.")
    cta_label = CharBlock(required=False, default="View All Properties")

    class Meta:
        icon = "arrow-right"
        label = "Property Marquee Slider"
        help_text = "Auto-injects all properties from the listings app. No manual entry needed."


class AboutPageStreamBlock(StreamBlock):
    hero = InternalPageHeroBlock()
    intro = AboutIntroBlock()
    property_marquee = PropertyMarqueeBlock()
    split = AboutSplitBlock()
    overlay = AboutOverlayBlock()
    avail = AboutAvailabilityBlock()
    cta = CtaSectionBlock()
    eoi_cta = EoiCtaSectionBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "intro": {"min_num": 0, "max_num": 1},
            "property_marquee": {"min_num": 0, "max_num": 1},
            "split": {"min_num": 0, "max_num": 1},
            "overlay": {"min_num": 0, "max_num": 1},
            "avail": {"min_num": 0, "max_num": 1},
            "cta": {"min_num": 0, "max_num": 1},
            "eoi_cta": {"min_num": 0, "max_num": 1},
        }


# ─── Team page blocks ────────────────────────────────────────────────────────

class TeamSectionBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="Meet the Team")
    title_line_1 = CharBlock(
        required=False,
        default="The People",
        help_text="Use [gold]word[/gold] for gold accent colour.",
    )
    title_line_2 = CharBlock(required=False, default="[gold]Guiding[/gold] Each Step")
    subtitle = TextBlock(
        default="A focused team bringing local knowledge, clear communication, and steady support to every client relationship.",
    )

    class Meta:
        icon = "group"
        label = "Team Section Heading"


class CoreValueItemBlock(StructBlock):
    title = CharBlock(default="Integrity")
    description = TextBlock(
        default="We give honest advice even when it's not what clients want to hear.",
    )

    class Meta:
        icon = "pick"
        label = "Core Value"


class CoreValuesBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="WHAT DRIVES US")
    heading = CharBlock(default="Our Core")
    heading_em = CharBlock(required=False, default="Values")
    subtitle = TextBlock(
        required=False,
        default="The principles that guide every conversation, every campaign, and every result.",
    )
    values = ListBlock(
        CoreValueItemBlock(),
        default=[
            {
                "title": "Integrity",
                "description": "We give honest advice even when it's not what clients want to hear. Trust is earned through consistency, not promises.",
            },
            {
                "title": "Clarity",
                "description": "Clear communication at every stage — no jargon, no guesswork. Clients always know where they stand and what comes next.",
            },
            {
                "title": "Results",
                "description": "Every strategy is built around one goal: the best outcome for our client. We bring data, discipline, and drive to every campaign.",
            },
            {
                "title": "Care",
                "description": "Property is personal. We treat every client's home and investment with the same respect and attention we would give our own.",
            },
        ],
        help_text="Edit the default values or add more. Icons are shown automatically.",
    )

    class Meta:
        icon = "list-ul"
        label = "What Drives Us (Core Values)"


class TeamPageStreamBlock(StreamBlock):
    hero = InternalPageHeroBlock()
    team_section = TeamSectionBlock()
    core_values = CoreValuesBlock()
    cta = CtaSectionBlock()
    eoi_cta = EoiCtaSectionBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "team_section": {"min_num": 0, "max_num": 1},
            "core_values": {"min_num": 0, "max_num": 1},
            "cta": {"min_num": 0, "max_num": 1},
            "eoi_cta": {"min_num": 0, "max_num": 1},
        }


# ─── Contact page blocks ─────────────────────────────────────────────────────

class ContactFormConfigBlock(StructBlock):
    eyebrow = CharBlock(default="Start your enquiry")
    heading_line_1 = CharBlock(default="Share what you")
    heading_line_2 = CharBlock(default="need next.")
    subtitle = TextBlock(default="Send through the details and our team will respond as soon as possible.")
    intent_options = CharBlock(
        required=False,
        default="Buy,Sell,Rent,Invest,Off-Plan,Valuation",
        help_text="Comma-separated intent chips (e.g. Buy,Sell,Rent).",
    )
    property_type_options = CharBlock(
        required=False,
        default="Apartment,Villa / Townhouse,Penthouse,Commercial,Plot / Land",
        help_text="Comma-separated property types for the dropdown.",
    )
    budget_min = IntegerBlock(default=500000, help_text="Minimum budget (AUD)")
    budget_max = IntegerBlock(default=20000000, help_text="Maximum budget (AUD)")
    budget_step = IntegerBlock(default=500000, help_text="Budget slider step (AUD)")
    budget_default = IntegerBlock(default=5000000, help_text="Default budget value (AUD)")
    submit_note = CharBlock(default="We will review your enquiry and get back to you shortly.")

    class Meta:
        icon = "form"
        label = "Contact Form Config"


class ContactPageStreamBlock(StreamBlock):
    hero = InternalPageHeroBlock()
    contact_info = ContactInfoBlock()
    contact_form = ContactFormConfigBlock()
    cta = CtaSectionBlock()
    eoi_cta = EoiCtaSectionBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "contact_info": {"min_num": 0, "max_num": 1},
            "contact_form": {"min_num": 0, "max_num": 1},
            "cta": {"min_num": 0, "max_num": 1},
            "eoi_cta": {"min_num": 0, "max_num": 1},
        }


# ─── Properties page blocks ──────────────────────────────────────────────────

class PropertiesPageListingBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="View Listings")
    heading = CharBlock(default="Find Your Next Opportunity")
    subtitle = TextBlock(
        required=False,
        default="Filter available, rental, and sold properties to review the current portfolio.",
    )

    class Meta:
        icon = "home"
        label = "Listing Section Heading"


class PropertyMarqueeConfigBlock(StructBlock):
    eyebrow = CharBlock(required=False, default="Portfolio Highlights")
    title = CharBlock(default="Browse")
    title_em = CharBlock(default="Selected Properties")
    subtitle = TextBlock(
        required=False,
        default="A rotating selection of notable listings and results from across the property portfolio.",
    )
    cta_label = CharBlock(default="See All Properties")

    class Meta:
        icon = "arrows-up-down"
        label = "Property Marquee"


class PropertiesPageStreamBlock(StreamBlock):
    hero = InternalPageHeroBlock()
    property_listing = PropertiesPageListingBlock()
    property_marquee = PropertyMarqueeConfigBlock()
    property_cta = PropertyCtaBlock()
    cta = CtaSectionBlock()
    eoi_cta = EoiCtaSectionBlock()

    class Meta:
        block_counts = {
            "hero": {"min_num": 0, "max_num": 1},
            "property_listing": {"min_num": 0, "max_num": 1},
            "property_marquee": {"min_num": 0, "max_num": 1},
            "property_cta": {"min_num": 0, "max_num": 1},
            "cta": {"min_num": 0, "max_num": 1},
            "eoi_cta": {"min_num": 0, "max_num": 1},
        }


# kept for migration compatibility — no longer used in models
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
