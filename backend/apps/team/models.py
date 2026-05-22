from django.conf import settings
from django.db import models
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel


class TeamMember(models.Model):
    slug = models.SlugField(
        unique=True,
        max_length=200,
        help_text="Unique slug for this team member.",
    )
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=220, default="Property Specialist")
    bio = models.TextField(blank=True, default="")
    portrait_image = models.ForeignKey(
        settings.WAGTAILIMAGES_IMAGE_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Preferred team card image from media library.",
    )
    portrait_image_url = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Fallback image path (e.g. images/team3.png) or full URL.",
    )
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=60, blank=True, default="")
    linkedin_url = models.URLField(blank=True, default="")
    tags = models.CharField(
        max_length=500,
        blank=True,
        default="",
        help_text="Comma-separated tags (e.g. Luxury Estates, Market Analysis).",
    )
    stat_1_value = models.CharField(max_length=60, blank=True, default="5+")
    stat_1_label = models.CharField(max_length=80, blank=True, default="Years")
    stat_2_value = models.CharField(max_length=60, blank=True, default="$120M")
    stat_2_label = models.CharField(max_length=80, blank=True, default="Volume")
    stat_3_value = models.CharField(max_length=60, blank=True, default="80+")
    stat_3_label = models.CharField(max_length=80, blank=True, default="Properties")
    order = models.PositiveIntegerField(
        default=0,
        help_text="Lower numbers render first (set founder to 0).",
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Only active members are sent to frontend.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    panels = [
        MultiFieldPanel(
            [
                FieldRowPanel([FieldPanel("name"), FieldPanel("slug")]),
                FieldPanel("role"),
                FieldPanel("bio"),
                FieldRowPanel([FieldPanel("portrait_image"), FieldPanel("portrait_image_url")]),
                FieldRowPanel([FieldPanel("email"), FieldPanel("phone")]),
                FieldPanel("linkedin_url"),
                FieldPanel("tags"),
                FieldRowPanel([FieldPanel("stat_1_value"), FieldPanel("stat_1_label")]),
                FieldRowPanel([FieldPanel("stat_2_value"), FieldPanel("stat_2_label")]),
                FieldRowPanel([FieldPanel("stat_3_value"), FieldPanel("stat_3_label")]),
                FieldRowPanel([FieldPanel("order"), FieldPanel("is_active")]),
            ],
            heading="Team Member",
        ),
    ]

    class Meta:
        verbose_name = "Team Member"
        verbose_name_plural = "Team Members"
        ordering = ("order", "id")

    def __str__(self) -> str:
        return self.name

    @staticmethod
    def _split_tags(raw: str) -> list[str]:
        return [chunk.strip() for chunk in (raw or "").split(",") if chunk.strip()]

    @property
    def resolved_image_url(self) -> str:
        if self.portrait_image and getattr(self.portrait_image, "file", None):
            return self.portrait_image.file.url
        return self.portrait_image_url

    def to_api_item(self) -> dict:
        stats: list[dict[str, str]] = []
        stat_pairs = [
            (self.stat_1_value, self.stat_1_label),
            (self.stat_2_value, self.stat_2_label),
            (self.stat_3_value, self.stat_3_label),
        ]
        for value, label in stat_pairs:
            clean_value = (value or "").strip()
            clean_label = (label or "").strip()
            if clean_value and clean_label:
                stats.append({"value": clean_value, "label": clean_label})

        return {
            "id": self.pk,
            "slug": self.slug,
            "name": self.name,
            "role": self.role,
            "bio": self.bio,
            "image": self.resolved_image_url,
            "stats": stats,
            "tags": self._split_tags(self.tags),
            "email": self.email,
            "phone": self.phone,
            "social": {"linkedin": self.linkedin_url},
            "order": self.order,
            "is_active": self.is_active,
        }
