from django.db import DatabaseError
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FeaturedTestimonial, TextTestimonial, VideoTestimonial


class VideoTestimonialListAPIView(APIView):
    """
    GET /api/testimonials/video/
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        try:
            items = (
                VideoTestimonial.objects.filter(is_active=True)
                .select_related("poster_image")
                .order_by("order", "id")
            )
            return Response([item.to_api_item() for item in items])
        except DatabaseError:
            return Response([])


class TextTestimonialListAPIView(APIView):
    """
    GET /api/testimonials/text/
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        try:
            items = TextTestimonial.objects.filter(is_active=True).select_related("client_image").order_by("order", "id")
            return Response([item.to_api_item() for item in items])
        except DatabaseError:
            return Response([])


class FeaturedTestimonialListAPIView(APIView):
    """
    GET /api/testimonials/featured/
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        try:
            items = (
                FeaturedTestimonial.objects.filter(is_active=True)
                .select_related("image")
                .order_by("order", "id")
            )
            return Response([item.to_api_item() for item in items])
        except DatabaseError:
            return Response([])
