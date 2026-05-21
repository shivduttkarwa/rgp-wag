from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup

from .models import TextTestimonial, VideoTestimonial


class VideoTestimonialViewSet(SnippetViewSet):
    model = VideoTestimonial
    icon = "media"
    menu_label = "Video Testimonial"
    menu_name = "video_testimonials"
    add_to_admin_menu = False
    list_display = ("name", "slug", "kicker", "tint", "is_active", "order", "updated_at")
    list_filter = ("tint", "is_active")
    search_fields = ("name", "slug", "kicker", "video_url")


class TextTestimonialViewSet(SnippetViewSet):
    model = TextTestimonial
    icon = "openquote"
    menu_label = "Text Testimonial"
    menu_name = "text_testimonials"
    add_to_admin_menu = False
    list_display = ("client_name", "slug", "location", "rating", "is_active", "order", "updated_at")
    list_filter = ("rating", "is_active")
    search_fields = ("client_name", "slug", "location", "quote")


class TestimonialViewSetGroup(SnippetViewSetGroup):
    menu_label = "Testimonial"
    menu_name = "testimonial"
    menu_icon = "openquote"
    menu_order = 240
    items = (VideoTestimonialViewSet, TextTestimonialViewSet)


register_snippet(TestimonialViewSetGroup)
