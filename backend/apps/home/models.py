from wagtail.admin.panels import FieldPanel, PublishingPanel
from wagtail.fields import StreamField
from wagtail.models import Page

from .blocks import HomePageStreamBlock


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
    subpage_types = []
    max_count = 1

    class Meta:
        verbose_name = "Home Page"

    def get_api_representation(self) -> dict:
        """Returns a clean dict representation for the headless API."""
        sections = {}
        for block in self.body:
            sections[block.block_type] = _serialise_block_value(block.value)
        return {
            "id":         self.pk,
            "title":      self.title,
            "slug":       self.slug,
            "sections":   sections,
            "updated_at": self.last_published_at.isoformat() if self.last_published_at else None,
        }


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
