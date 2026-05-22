from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactPage, HomePage, TeamPage


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
