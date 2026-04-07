from rest_framework import serializers
from .models import (
    Property,
    PropertyImage,
    PropertyFeature,
    PropertyAgent,
    PropertyDetailRow,
    PropertyNearbyLocation,
)


class PropertyAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAgent
        fields = ["name", "title", "photo_url", "phone", "email", "rating", "review_count"]


class PropertyImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = PropertyImage
        fields = ["url", "alt"]

    def get_url(self, obj: PropertyImage) -> str:
        return obj.get_resolved_url() or ""


class PropertyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyFeature
        fields = ["icon", "title", "description"]


class PropertyDetailRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDetailRow
        fields = ["label", "value"]


class PropertyNearbyLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyNearbyLocation
        fields = ["name", "distance", "type"]


class PropertyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the listings grid."""

    agent = PropertyAgentSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    status = serializers.CharField(source="get_status_display")
    category = serializers.CharField(source="listing_category")
    soldPrice = serializers.DecimalField(source="sold_price", max_digits=12, decimal_places=0, allow_null=True)
    image = serializers.SerializerMethodField()
    beds = serializers.IntegerField(source="bedrooms")
    baths = serializers.IntegerField(source="bathrooms")
    sqft = serializers.IntegerField(source="area_sqft")
    garage = serializers.IntegerField(source="garages")
    features = serializers.SerializerMethodField()
    soldDate = serializers.CharField(source="sold_date_label", allow_blank=True)
    daysOnMarket = serializers.IntegerField(source="days_on_market", allow_null=True)
    isNew = serializers.BooleanField(source="is_new")
    deposit = serializers.DecimalField(max_digits=12, decimal_places=0, allow_null=True)
    minLease = serializers.CharField(source="min_lease", allow_blank=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "slug",
            "title",
            "address",
            "city",
            "state",
            "price",
            "soldPrice",
            "status",
            "category",
            "image",
            "beds",
            "baths",
            "sqft",
            "garage",
            "features",
            "badge",
            "isNew",
            "views",
            "soldDate",
            "daysOnMarket",
            "deposit",
            "minLease",
            "featured",
            "price_label",
            "thumbnail",
            "agent",
        ]

    def get_thumbnail(self, obj: Property) -> str | None:
        first = obj.images.first()
        return first.get_resolved_url() if first else None

    def get_image(self, obj: Property) -> str:
        first = obj.images.first()
        return first.get_resolved_url() if first else ""

    def get_features(self, obj: Property) -> list[str]:
        return [feature.title for feature in obj.features.all()]


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the property detail page."""

    agent = PropertyAgentSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    features = PropertyFeatureSerializer(many=True, read_only=True)
    details = PropertyDetailRowSerializer(source="detail_rows", many=True, read_only=True)
    nearbyLocations = PropertyNearbyLocationSerializer(source="nearby_locations", many=True, read_only=True)
    status = serializers.CharField(source="get_status_display")
    stats = serializers.SerializerMethodField()
    overview_lines = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "slug", "title", "address", "city", "state", "zip_code",
            "price", "price_label", "status", "featured", "category",
            "stats", "overview_lines", "description",
            "images", "features", "details", "nearbyLocations",
            "map_embed_url", "video_tour_url", "video_thumbnail_url",
            "agent",
            "updated_at",
        ]

    def get_stats(self, obj: Property) -> list[dict]:
        return [
            {"icon": "bed", "value": str(obj.bedrooms), "label": "Bedrooms"},
            {"icon": "bath", "value": str(obj.bathrooms), "label": "Bathrooms"},
            {"icon": "area", "value": str(obj.area_sqft), "label": "Sq. Ft."},
            {"icon": "garage", "value": str(obj.garages), "label": "Garages"},
            {"icon": "year", "value": str(obj.year_built) if obj.year_built else "N/A", "label": "Year Built"},
            {"icon": "lot", "value": obj.lot_size or "N/A", "label": "Lot Size"},
        ]

    def get_overview_lines(self, obj: Property) -> list[str]:
        return [line.strip() for line in obj.overview.splitlines() if line.strip()]
