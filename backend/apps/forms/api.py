from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ContactFormSerializer, ExpressionOfInterestSerializer


class ContactFormAPIView(APIView):
    """POST /api/forms/contact/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = ContactFormSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Message received. We'll be in touch soon."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpressionOfInterestAPIView(APIView):
    """POST /api/forms/eoi/"""

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = ExpressionOfInterestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Expression of interest received. We'll be in touch soon."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
