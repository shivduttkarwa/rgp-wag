from django.db import models


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
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Expression of Interest"
        verbose_name_plural = "Expressions of Interest"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"
