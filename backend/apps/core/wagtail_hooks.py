from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Video


class VideoViewSet(SnippetViewSet):
    model = Video
    menu_label = "Videos"
    menu_name = "videos"
    menu_icon = "media"
    menu_order = 260
    add_to_admin_menu = True
    list_display = ("title", "category", "updated_at")
    list_filter = ("category",)
    search_fields = ("title", "slug", "description")


register_snippet(VideoViewSet)
