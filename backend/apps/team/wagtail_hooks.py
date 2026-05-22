from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup

from .models import TeamMember


class TeamMemberViewSet(SnippetViewSet):
    model = TeamMember
    icon = "user"
    menu_label = "Team Members"
    menu_name = "team_members"
    add_to_admin_menu = False
    list_display = ("name", "role", "is_active", "order", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug", "role", "tags", "email", "phone")


class TeamViewSetGroup(SnippetViewSetGroup):
    menu_label = "Team"
    menu_name = "team"
    menu_icon = "group"
    menu_order = 245
    items = (TeamMemberViewSet,)


register_snippet(TeamViewSetGroup)
