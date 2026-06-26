from django.db import models
from django.conf import settings
from django.forms import Select
from wagtail.admin.panels import FieldPanel, FieldRowPanel, InlinePanel, MultiFieldPanel
from wagtail.fields import RichTextField
from wagtail.models import Orderable
from modelcluster.fields import ParentalKey
from modelcluster.models import ClusterableModel





class VaultPropertySelectWidget(Select):
    """Select widget that populates choices from VaultRE and embeds auto-fill data attributes."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._vault_data: dict = {}

    def _load_choices(self):
        try:
            from apps.properties.vaultre import get_listings, normalise_list
            self.choices = [("", "── Select a VaultRE property ──")]
            for p in get_listings():
                n = normalise_list(p)
                vid = str(p["id"])
                self._vault_data[vid] = n
                label = f"{n.get('title') or n.get('address', '')}  |  {n.get('location', '')}  |  {n.get('status', '')}"
                self.choices.append((vid, label))
        except Exception:
            self.choices = [("", "── VaultRE unavailable ──")]

    def optgroups(self, name, value, attrs=None):
        self._load_choices()
        return super().optgroups(name, value, attrs)

    def create_option(self, name, value, label, selected, index, **kwargs):
        option = super().create_option(name, value, label, selected, index, **kwargs)
        vid = str(value)
        if vid and vid in self._vault_data:
            n = self._vault_data[vid]
            option["attrs"].update({
                "data-title":    n.get("title") or n.get("address", ""),
                "data-location": n.get("location", ""),
                "data-price":    n.get("price_label") or str(n.get("price") or ""),
                "data-status":   n.get("status", ""),
                "data-beds":     str(n.get("beds") or n.get("bed") or 0),
                "data-baths":    str(n.get("baths") or n.get("bath") or 0),
                "data-area":     str(n.get("sqft") or ""),
                "data-slug":     n.get("slug", vid),
            })
        return option


class PropertyStatus(models.TextChoices):
    FOR_SALE = "for_sale", "For Sale"
    FOR_RENT = "for_rent", "For Rent"
    SOLD = "sold", "Sold"
    PENDING = "pending", "Pending"


class ListingCategory(models.TextChoices):
    FOR_SALE = "for-sale", "For Sale"
    SOLD = "sold", "Sold"
    FOR_RENT = "for-rent", "For Rent"



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


class PortfolioShowcaseItem(models.Model):
    """
    A curated showcase entry for the homepage Portfolio section.
    Separate from Property listings — has its own background + thumbnail images
    for the parallax showcase design.
    """

    title = models.CharField(max_length=300)
    location = models.CharField(max_length=200, help_text="e.g. Forest Lake, Brisbane QLD")
    price = models.CharField(max_length=100, help_text="e.g. $1.2M, $850,000, Contact Agent")
    status = models.CharField(max_length=80, default="For Sale", help_text="e.g. For Sale, Sold, For Rent")
    background_image = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Full-screen parallax background image shown behind the section.",
    )
    thumbnail = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Card thumbnail image. Falls back to background image if not set.",
    )
    beds = models.PositiveSmallIntegerField(default=0)
    baths = models.PositiveSmallIntegerField(default=0)
    area = models.CharField(max_length=50, blank=True, help_text="e.g. 2,400")
    vault_property_id = models.CharField(
        max_length=50,
        blank=True,
        default="",
        help_text="VaultRE property ID (find it in the property URL: /properties/<id>). When set, title/price/photos/beds/baths auto-fill from VaultRE.",
    )
    property_slug = models.SlugField(
        blank=True,
        help_text="Slug of a property listing to link to. Leave blank — auto-set from vault_property_id if provided.",
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Sort order in the showcase.")

    panels = [
        FieldPanel("vault_property_id", widget=VaultPropertySelectWidget()),
        FieldRowPanel([FieldPanel("title"), FieldPanel("status")]),
        FieldRowPanel([FieldPanel("location"), FieldPanel("price")]),
        FieldPanel("background_image"),
        FieldPanel("thumbnail"),
        FieldRowPanel([FieldPanel("beds"), FieldPanel("baths"), FieldPanel("area")]),
        FieldRowPanel([FieldPanel("property_slug"), FieldPanel("order"), FieldPanel("is_active")]),
    ]

    class Meta:
        verbose_name = "Portfolio Showcase Item"
        verbose_name_plural = "Portfolio Showcase Items"
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.title} — {self.location}"
