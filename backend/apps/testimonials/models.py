from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel


class TestimonialTint(models.TextChoices):
    GOLD = "gold", "Gold"
    AMBER = "amber", "Amber"
    CRIMSON = "crimson", "Crimson"


class VideoTestimonial(models.Model):
    # Keep schema compatible with existing DB tables from the older Wagtail build.
    slug = models.SlugField(
        unique=True,
        max_length=200,
        help_text="Unique slug for this testimonial record.",
    )
    name = models.CharField(
        max_length=200,
        help_text="Client name shown on card.",
    )
    kicker = models.CharField(
        max_length=200,
        blank=True,
        default="",
        help_text="e.g. SUNNYBANK · SOLD",
    )
    video_url = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Path relative to front public/ (e.g. vids/x.mp4) or full URL.",
    )
    video_file = models.ForeignKey(
        "wagtaildocs.Document",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Optional uploaded file. Used when video URL is empty.",
    )
    poster_image = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Thumbnail image from media library.",
    )
    tint = models.CharField(
        max_length=20,
        choices=TestimonialTint.choices,
        default=TestimonialTint.GOLD,
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active testimonials are sent to the frontend.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldRowPanel([FieldPanel("name"), FieldPanel("slug")]),
                FieldPanel("kicker"),
                FieldPanel("video_url"),
                FieldPanel("video_file"),
                FieldPanel("poster_image"),
                FieldRowPanel([FieldPanel("tint"), FieldPanel("is_active"), FieldPanel("order")]),
            ],
            heading="Video Testimonial",
        ),
    ]

    class Meta:
        verbose_name = "Video Testimonial"
        verbose_name_plural = "Video Testimonials"
        ordering = ("order", "id")

    def __str__(self) -> str:
        return self.name

    def _resolved_video_url(self) -> str:
        if self.video_url:
            return self.video_url
        if self.video_file and getattr(self.video_file, "file", None):
            return self.video_file.file.url
        return ""

    def to_home_item(self) -> dict:
        poster_image_payload = None
        if self.poster_image and getattr(self.poster_image, "file", None):
            poster_image_payload = {
                "url": self.poster_image.file.url,
                "width": self.poster_image.width,
                "height": self.poster_image.height,
                "alt": self.poster_image.title,
            }

        return {
            "kicker": self.kicker,
            "name": self.name,
            "video_url": self._resolved_video_url(),
            "poster_image": poster_image_payload,
            "poster_url": "",
            "tint": self.tint,
        }

    def to_api_item(self) -> dict:
        payload = self.to_home_item()
        payload.update(
            {
                "id": self.pk,
                "slug": self.slug,
                "title": self.name,
                "is_active": self.is_active,
                "order": self.order,
            }
        )
        return payload


class TextTestimonial(models.Model):
    # Keep schema compatible with existing DB tables from the older Wagtail build.
    slug = models.SlugField(
        unique=True,
        max_length=200,
        help_text="Unique slug for this testimonial record.",
    )
    client_name = models.CharField(max_length=200)
    location = models.CharField(
        max_length=200,
        blank=True,
        default="",
        help_text="e.g. Brisbane, QLD",
    )
    quote = models.TextField(help_text="Main testimonial copy.")
    rating = models.PositiveSmallIntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="1 to 5 stars.",
    )
    client_image = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Optional client avatar from media library.",
    )
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers appear first.",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active testimonials are returned by the API.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldRowPanel([FieldPanel("client_name"), FieldPanel("slug")]),
                FieldRowPanel([FieldPanel("location"), FieldPanel("rating"), FieldPanel("order")]),
                FieldPanel("quote"),
                FieldPanel("client_image"),
                FieldPanel("is_active"),
            ],
            heading="Text Testimonial",
        ),
    ]

    class Meta:
        verbose_name = "Text Testimonial"
        verbose_name_plural = "Text Testimonials"
        ordering = ("order", "id")

    def __str__(self) -> str:
        return self.client_name

    def to_api_item(self) -> dict:
        client_image_payload = None
        if self.client_image and getattr(self.client_image, "file", None):
            client_image_payload = {
                "url": self.client_image.file.url,
                "width": self.client_image.width,
                "height": self.client_image.height,
                "alt": self.client_image.title,
            }

        return {
            "id": self.pk,
            "slug": self.slug,
            "title": self.client_name,
            "client_name": self.client_name,
            "client_role": "",
            "location": self.location,
            "quote": self.quote,
            "rating": self.rating,
            "avatar_image": client_image_payload,
            "avatar_url": "",
            "is_active": self.is_active,
            "order": self.order,
        }
