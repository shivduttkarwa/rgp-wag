from rest_framework import serializers
from .models import ContactSubmission, ExpressionOfInterestSubmission


class ContactFormSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["name", "email", "phone", "subject", "message"]


class ExpressionOfInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpressionOfInterestSubmission
        fields = ["first_name", "last_name", "email", "phone", "property_type", "budget", "timeline", "message"]
