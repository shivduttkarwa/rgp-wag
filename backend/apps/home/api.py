from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import AboutPage, ContactPage, EoiPage, HomePage, PropertiesPage, ServicesPage, TeamPage, TestimonialsPage


class HomePageAPIView(APIView):
    """
    GET /api/pages/home/
    Returns the full HomePage StreamField content, section by section.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = HomePage.objects.live().first()
        if page is None:
            return Response({"detail": "Home page not yet published."}, status=404)
        return Response(page.get_api_representation())


class ContactPageAPIView(APIView):
    """
    GET /api/pages/contact/
    Returns CMS-managed contact page content.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = ContactPage.objects.live().first()
        if page is None:
            return Response({"detail": "Contact page not yet published."}, status=404)
        return Response(page.get_api_representation())


class TeamPageAPIView(APIView):
    """
    GET /api/pages/team/
    Returns CMS-managed team page content.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = TeamPage.objects.live().first()
        if page is None:
            return Response({"detail": "Team page not yet published."}, status=404)
        return Response(page.get_api_representation())


class PropertiesPageAPIView(APIView):
    """
    GET /api/pages/properties/
    Returns CMS-managed properties page content.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = PropertiesPage.objects.live().first()
        if page is None:
            return Response({"detail": "Properties page not yet published."}, status=404)
        return Response(page.get_api_representation())


class AboutPageAPIView(APIView):
    """GET /api/pages/about/"""
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = AboutPage.objects.live().first()
        if page is None:
            return Response({"detail": "About page not yet published."}, status=404)
        return Response(page.get_api_representation())


class ServicesPageAPIView(APIView):
    """GET /api/pages/services/"""
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = ServicesPage.objects.live().first()
        if page is None:
            return Response({"detail": "Services page not yet published."}, status=404)
        return Response(page.get_api_representation())


class TestimonialsPageAPIView(APIView):
    """GET /api/pages/testimonials/"""
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = TestimonialsPage.objects.live().first()
        if page is None:
            return Response({"detail": "Testimonials page not yet published."}, status=404)
        return Response(page.get_api_representation())


class EoiPageAPIView(APIView):
    """GET /api/pages/eoi/"""
    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        page = EoiPage.objects.live().first()
        if page is None:
            return Response({"detail": "EOI page not yet published."}, status=404)
        return Response(page.get_api_representation())
