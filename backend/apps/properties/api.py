from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.permissions import AllowAny

from . import vaultre


class PropertyListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            category = request.query_params.get("category")
            items = vaultre.get_listings(category=category)
            return Response([vaultre.normalise_list(p) for p in items])
        except Exception as exc:
            return Response({"error": str(exc)}, status=http_status.HTTP_502_BAD_GATEWAY)


class PropertyDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            p = vaultre.get_listing(slug)
            return Response(vaultre.normalise_detail(p))
        except ValueError:
            return Response({"error": "Not found"}, status=http_status.HTTP_404_NOT_FOUND)
        except Exception as exc:
            return Response({"error": str(exc)}, status=http_status.HTTP_502_BAD_GATEWAY)
