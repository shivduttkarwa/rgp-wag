from django.db import models


class PropertyEnquirySubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    message = models.TextField(blank=True)
    property_id = models.CharField(max_length=200, blank=True)
    property_title = models.CharField(max_length=300, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Property Enquiry"
        verbose_name_plural = "Property Enquiries"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name} — {self.property_title or self.property_id} ({self.submitted_at:%Y-%m-%d})"


class ContactSubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    subject = models.CharField(max_length=300, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Contact Submission"
        verbose_name_plural = "Contact Submissions"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.name} <{self.email}> — {self.submitted_at:%Y-%m-%d}"


class ExpressionOfInterestSubmission(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    property_type = models.CharField(max_length=200, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    timeline = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    property_address = models.TextField(blank=True)
    buyer_1_full_legal_name = models.CharField(max_length=255, blank=True)
    address_buyer_1 = models.TextField(blank=True)
    phone_buyer_1 = models.CharField(max_length=50, blank=True)
    email_buyer_1 = models.EmailField(blank=True)
    buyer_2_full_legal_name = models.CharField(max_length=255, blank=True)
    address_buyer_2_if_different_to_buyer_1 = models.TextField(blank=True)
    phone_buyer_2 = models.CharField(max_length=50, blank=True)
    email_buyer_2 = models.EmailField(blank=True)
    offer_price = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    initial_deposit = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    balance_deposit = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    will_your_offer_be_subject_to_finance = models.CharField(max_length=20, blank=True)
    finance_if_yes_how_many_days = models.CharField(max_length=100, blank=True)
    will_your_offer_be_subject_to_building_pest = models.CharField(max_length=20, blank=True)
    building_pest_if_yes_how_many_days = models.CharField(max_length=100, blank=True)
    do_you_have_any_other_conditions_for_purchase = models.CharField(max_length=20, blank=True)
    if_yes_please_state_brief_details = models.TextField(blank=True)
    solicitor_details = models.TextField(blank=True)
    are_you_happy_for_us_to_store_your_information_in_our_database = models.CharField(max_length=20, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Expression of Interest"
        verbose_name_plural = "Expressions of Interest"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"
