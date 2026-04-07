from rest_framework import serializers
from .models import Property, PropertyImage, PropertyFeature, PropertyAgent


class PropertyAgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyAgent
        fields = ["name", "title", "photo_url", "phone", "email", "rating", "review_count"]


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["url", "alt"]


class PropertyFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyFeature
        fields = ["icon", "title", "description"]


class PropertyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for the listings grid."""

    agent = PropertyAgentSerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    status = serializers.CharField(source="get_status_display")

    class Meta:
        model = Property
        fields = [
            "slug", "title", "address", "city", "state",
            "price", "price_label", "status", "featured", "category",
            "bedrooms", "bathrooms", "garages", "area_sqft",
            "thumbnail", "agent",
        ]

    def get_thumbnail(self, obj: Property) -> str | None:
        first = obj.images.first()
        return first.url if first else None


class PropertyDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the property detail page."""

    agent = PropertyAgentSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    features = PropertyFeatureSerializer(many=True, read_only=True)
    status = serializers.CharField(source="get_status_display")
    stats = serializers.SerializerMethodField()
    overview_lines = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "slug", "title", "address", "city", "state", "zip_code",
            "price", "price_label", "status", "featured", "category",
            "stats", "overview_lines", "description",
            "images", "features", "agent",
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
