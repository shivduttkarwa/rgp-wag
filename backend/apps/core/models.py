from django.db import models
from django.utils.text import slugify
from wagtail.images.models import AbstractImage, AbstractRendition, Image
from wagtail.admin.panels import FieldPanel, MultiFieldPanel


class RGPImage(AbstractImage):
    """
    Custom image model — add site-specific fields here.
    Declared in settings: WAGTAILIMAGES_IMAGE_MODEL = "core.RGPImage"
    """

    admin_form_fields = Image.admin_form_fields

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"


class RGPRendition(AbstractRendition):
    image = models.ForeignKey(
        RGPImage,
        on_delete=models.CASCADE,
        related_name="renditions",
    )

    class Meta:
        unique_together = (("image", "filter_spec", "focal_point_key"),)


class Video(models.Model):
    CATEGORY_CHOICES = [
        ("hero",        "Hero / Background"),
        ("testimonial", "Testimonial"),
        ("property",    "Property"),
        ("team",        "Team"),
        ("general",     "General"),
    ]

    title       = models.CharField(max_length=255)
    slug        = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="general")
    video_file  = models.FileField(upload_to="videos/", blank=True, help_text="Upload an .mp4 file")
    video_url   = models.URLField(blank=True, help_text="Or paste a YouTube / Vimeo / direct video URL")
    thumbnail   = models.ForeignKey(
        "core.RGPImage",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Optional preview thumbnail",
    )
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel([
            FieldPanel("title"),
            FieldPanel("slug"),
            FieldPanel("description"),
            FieldPanel("category"),
        ], heading="Details"),
        MultiFieldPanel([
            FieldPanel("video_file"),
            FieldPanel("video_url"),
            FieldPanel("thumbnail"),
        ], heading="Media"),
    ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def url(self):
        if self.video_file:
            return self.video_file.url
        return self.video_url or ""

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Video"
        verbose_name_plural = "Videos"
