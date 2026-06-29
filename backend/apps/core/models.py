from django.db import models
from wagtail.images.models import AbstractImage, AbstractRendition, Image
from wagtail.fields import RichTextField
from wagtail.admin.panels import FieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting


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


@register_setting
class LegalSettings(BaseSiteSetting):
    privacy_policy = RichTextField(
        blank=True,
        help_text="Content for the Privacy Policy page.",
    )
    collection_notice = RichTextField(
        blank=True,
        help_text="Content for the Collection Notice page.",
    )

    panels = [
        FieldPanel("privacy_policy"),
        FieldPanel("collection_notice"),
    ]

    class Meta:
        verbose_name = "Legal Pages"
