from django.db import models
from django.conf import settings
from wagtail.admin.panels import FieldPanel, FieldRowPanel, InlinePanel, MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Orderable
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


class PropertyStatus(models.TextChoices):
    FOR_SALE = "for_sale", "For Sale"
    FOR_RENT = "for_rent", "For Rent"
    SOLD = "sold", "Sold"
    PENDING = "pending", "Pending"


class ListingCategory(models.TextChoices):
    FOR_SALE = "for-sale", "For Sale"
    SOLD = "sold", "Sold"
    FOR_RENT = "for-rent", "For Rent"


class PropertyAgent(models.Model):
    """Reusable agent/consultant attached to properties."""

    name = models.CharField(max_length=200)
    title = models.CharField(max_length=200, blank=True)
    photo_url = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    review_count = models.PositiveIntegerField(default=0)

    panels = [
        FieldRowPanel([FieldPanel("name"), FieldPanel("title")]),
        FieldPanel("photo_url"),
        FieldRowPanel([FieldPanel("phone"), FieldPanel("email")]),
        FieldRowPanel([FieldPanel("rating"), FieldPanel("review_count")]),
    ]

    class Meta:
        verbose_name = "Property Agent"
        verbose_name_plural = "Property Agents"

    def __str__(self):
        return self.name


class Property(ClusterableModel):
    """
    Core property model — managed as a Wagtail snippet.
    Each property maps to a card on /properties and a detail page at /properties/:id
    """

    slug = models.SlugField(unique=True, max_length=200)
    title = models.CharField(max_length=300)
    address = models.CharField(max_length=300)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50, default="QLD")
    zip_code = models.CharField(max_length=20, blank=True)

    price = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    price_label = models.CharField(max_length=100, default="Listed Price")
    status = models.CharField(max_length=20, choices=PropertyStatus.choices, default=PropertyStatus.FOR_SALE)
    listing_category = models.CharField(
        max_length=20,
        choices=ListingCategory.choices,
        default=ListingCategory.FOR_SALE,
        help_text="Used by homepage listing filters (For Sale / Sold / For Rent).",
    )
    featured = models.BooleanField(default=False)
    sold_price = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    badge = models.CharField(max_length=120, blank=True, help_text="Optional badge shown on property card.")
    is_new = models.BooleanField(default=False)
    views = models.PositiveIntegerField(null=True, blank=True)
    sold_date_label = models.CharField(max_length=80, blank=True, help_text="e.g. 5 weeks ago")
    days_on_market = models.PositiveIntegerField(null=True, blank=True)
    deposit = models.DecimalField(max_digits=12, decimal_places=0, null=True, blank=True)
    min_lease = models.CharField(max_length=80, blank=True)
    card_image = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Single image used on listing cards.",
    )

    # Stats
    bedrooms = models.PositiveSmallIntegerField(default=0)
    bathrooms = models.PositiveSmallIntegerField(default=0)
    garages = models.PositiveSmallIntegerField(default=0)
    area_sqft = models.PositiveIntegerField(default=0)
    year_built = models.PositiveSmallIntegerField(null=True, blank=True)
    lot_size = models.CharField(max_length=50, blank=True)

    # Content
    overview = models.TextField(blank=True, help_text="One paragraph per line.")
    description = RichTextField(blank=True)
    map_embed_url = models.URLField(blank=True)
    video_tour_url = models.URLField(blank=True)
    video_thumbnail_url = models.CharField(max_length=500, blank=True)

    agent = models.ForeignKey(
        PropertyAgent, null=True, blank=True, on_delete=models.SET_NULL, related_name="properties"
    )

    # Category (used for filtering on /properties)
    category = models.CharField(
        max_length=100,
        blank=True,
        help_text="e.g. House, Land, Townhouse — used for Isotope filter.",
    )

    order = models.PositiveIntegerField(default=0, help_text="Sort order on listings page.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldRowPanel([FieldPanel("title"), FieldPanel("slug")]),
                FieldPanel("address"),
                FieldRowPanel([FieldPanel("city"), FieldPanel("state"), FieldPanel("zip_code")]),
                FieldRowPanel([FieldPanel("listing_category"), FieldPanel("status"), FieldPanel("featured")]),
                FieldRowPanel([FieldPanel("price"), FieldPanel("price_label"), FieldPanel("sold_price")]),
                FieldRowPanel([FieldPanel("bedrooms"), FieldPanel("bathrooms"), FieldPanel("garages")]),
                FieldRowPanel([FieldPanel("area_sqft"), FieldPanel("badge"), FieldPanel("is_new")]),
                FieldRowPanel([FieldPanel("views"), FieldPanel("sold_date_label"), FieldPanel("days_on_market")]),
                FieldRowPanel([FieldPanel("deposit"), FieldPanel("min_lease"), FieldPanel("category")]),
                FieldPanel("card_image"),
            ],
            heading="Card Fields",
            help_text="Top section for fields used in the home listing cards and filters.",
        ),
        MultiFieldPanel(
            [
                FieldRowPanel([FieldPanel("year_built"), FieldPanel("lot_size"), FieldPanel("order")]),
                FieldPanel("overview"),
                FieldPanel("description"),
                InlinePanel("images", label="Gallery Images"),
                InlinePanel("features", label="Features"),
                InlinePanel("detail_rows", label="Details Grid"),
                InlinePanel("nearby_locations", label="Nearby Locations"),
                MultiFieldPanel(
                    [
                        FieldPanel("map_embed_url"),
                        FieldRowPanel([FieldPanel("video_tour_url"), FieldPanel("video_thumbnail_url")]),
                    ],
                    heading="Map & Video",
                ),
                FieldPanel("agent"),
            ],
            heading="Property Details",
            help_text="Bottom section for detail-page content.",
        ),
    ]

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.title} — {self.city}"


class PropertyImage(Orderable):
    property = ParentalKey(Property, on_delete=models.CASCADE, related_name="images")
    image = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    url = models.CharField(max_length=500, blank=True)
    alt = models.CharField(max_length=200, blank=True)

    panels = [FieldRowPanel([FieldPanel("image"), FieldPanel("alt")])]

    def get_resolved_url(self):
        if self.image and getattr(self.image, "file", None):
            return self.image.file.url
        return ""

    class Meta(Orderable.Meta):
        verbose_name = "Image"


class PropertyFeature(Orderable):
    property = ParentalKey(Property, on_delete=models.CASCADE, related_name="features")
    icon = models.CharField(max_length=50, default="star")
    title = models.CharField(max_length=200)
    description = models.CharField(max_length=500, blank=True)

    panels = [
        FieldRowPanel([FieldPanel("icon"), FieldPanel("title")]),
        FieldPanel("description"),
    ]

    class Meta(Orderable.Meta):
        verbose_name = "Feature"


class PropertyDetailRow(Orderable):
    property = ParentalKey(Property, on_delete=models.CASCADE, related_name="detail_rows")
    label = models.CharField(max_length=200)
    value = models.CharField(max_length=500)

    panels = [FieldRowPanel([FieldPanel("label"), FieldPanel("value")])]

    class Meta(Orderable.Meta):
        verbose_name = "Detail Row"


class NearbyLocationType(models.TextChoices):
    SHOPPING = "shopping", "Shopping"
    AIRPORT = "airport", "Airport"
    DINING = "dining", "Dining"
    GOLF = "golf", "Golf"
    BEACH = "beach", "Beach"
    SCHOOL = "school", "School"
    HOSPITAL = "hospital", "Hospital"


class PropertyNearbyLocation(Orderable):
    property = ParentalKey(Property, on_delete=models.CASCADE, related_name="nearby_locations")
    name = models.CharField(max_length=200)
    distance = models.CharField(max_length=100)
    type = models.CharField(
        max_length=20,
        choices=NearbyLocationType.choices,
        default=NearbyLocationType.SHOPPING,
    )

    panels = [FieldRowPanel([FieldPanel("name"), FieldPanel("distance"), FieldPanel("type")])]

    class Meta(Orderable.Meta):
        verbose_name = "Nearby Location"
