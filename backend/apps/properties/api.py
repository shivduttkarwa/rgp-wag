from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny

from .models import Property
from .serializers import PropertyListSerializer, PropertyDetailSerializer


class PropertyListAPIView(ListAPIView):
    """
    GET /api/properties/
    Optional query params:
      ?status=for_sale
      ?featured=true
      ?category=House
    """

    serializer_class = PropertyListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Property.objects.prefetch_related("images", "features", "agent").all()

        status = self.request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)

        featured = self.request.query_params.get("featured")
        if featured and featured.lower() == "true":
            qs = qs.filter(featured=True)

        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(listing_category=category)

        return qs


class PropertyDetailAPIView(RetrieveAPIView):
    """
    GET /api/properties/<slug>/
    """

    serializer_class = PropertyDetailSerializer
    permission_classes = [AllowAny]
    queryset = Property.objects.prefetch_related(
        "images",
        "features",
        "detail_rows",
        "nearby_locations",
        "agent",
    ).all()
    lookup_field = "slug"
