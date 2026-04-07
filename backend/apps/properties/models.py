from django.db import models
from wagtail.admin.panels import FieldPanel, FieldRowPanel, InlinePanel, MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Orderable
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel


class PropertyStatus(models.TextChoices):
    FOR_SALE = "for_sale", "For Sale"
    SOLD = "sold", "Sold"
    COMING_SOON = "coming_soon", "Coming Soon"
    OFF_MARKET = "off_market", "Off Market"


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
    status = models.CharField(
        max_length=20, choices=PropertyStatus.choices, default=PropertyStatus.FOR_SALE
    )
    featured = models.BooleanField(default=False)

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
            [FieldRowPanel([FieldPanel("title"), FieldPanel("slug")]),
             FieldPanel("address"),
             FieldRowPanel([FieldPanel("city"), FieldPanel("state"), FieldPanel("zip_code")])],
            heading="Location",
        ),
        MultiFieldPanel(
            [FieldRowPanel([FieldPanel("price"), FieldPanel("price_label")]),
             FieldRowPanel([FieldPanel("status"), FieldPanel("featured"), FieldPanel("category")])],
            heading="Listing",
        ),
        MultiFieldPanel(
            [FieldRowPanel([FieldPanel("bedrooms"), FieldPanel("bathrooms"), FieldPanel("garages")]),
             FieldRowPanel([FieldPanel("area_sqft"), FieldPanel("year_built"), FieldPanel("lot_size")])],
            heading="Stats",
        ),
        FieldPanel("overview"),
        FieldPanel("description"),
        FieldPanel("agent"),
        InlinePanel("images", label="Images"),
        InlinePanel("features", label="Features"),
        FieldPanel("order"),
    ]

    class Meta:
        verbose_name = "Property"
        verbose_name_plural = "Properties"
        ordering = ["order", "-created_at"]

    def __str__(self):
        return f"{self.title} — {self.city}"


class PropertyImage(Orderable):
    property = ParentalKey(Property, on_delete=models.CASCADE, related_name="images")
    url = models.CharField(max_length=500)
    alt = models.CharField(max_length=200, blank=True)

    panels = [FieldRowPanel([FieldPanel("url"), FieldPanel("alt")])]

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
