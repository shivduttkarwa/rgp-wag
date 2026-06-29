from django.urls import path, reverse
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods
from django.contrib import messages

from wagtail import hooks
from wagtail.admin.menu import MenuItem
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
    menu_label = "Team Members"
    menu_name = "team"
    menu_icon = "group"
    menu_order = 245
    items = (TeamMemberViewSet,)


register_snippet(TeamViewSetGroup)


# ─── Sync Team Members ────────────────────────────────────────────────────────

@require_http_methods(["GET", "POST"])
def sync_team_view(request):
    if request.method == "POST":
        from django.core.management import call_command
        from io import StringIO
        try:
            out = StringIO()
            call_command("sync_vault_agents", stdout=out)
            output = out.getvalue()
            lines = [l for l in output.splitlines() if l.strip()]
            synced = sum(1 for l in lines if l.strip().startswith(("Created", "Updated")))
            messages.success(request, f"Team members synced from VaultRE ({synced} upserted).")
        except Exception as exc:
            messages.error(request, f"Sync failed: {exc}")
        return redirect(reverse("sync_team"))

    return render(request, "wagtailadmin/sync_team.html")


@hooks.register("register_admin_urls")
def register_team_urls():
    return [
        path("sync-team/", sync_team_view, name="sync_team"),
    ]


@hooks.register("register_admin_menu_item")
def register_sync_team_menu_item():
    return MenuItem("Sync Team", "/cms/sync-team/", icon_name="group", order=106)
