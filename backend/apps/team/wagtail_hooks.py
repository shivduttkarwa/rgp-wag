from django.urls import path, reverse
from django.shortcuts import redirect
from django.views.decorators.http import require_http_methods
from django.contrib import messages

from wagtail import hooks
from wagtail.admin.widgets.button import HeaderButton
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import IndexView as SnippetIndexView, SnippetViewSet, SnippetViewSetGroup

from .models import TeamMember


class TeamMemberIndexView(SnippetIndexView):
    def get_header_buttons(self):
        buttons = super().get_header_buttons()
        buttons.append(
            HeaderButton(
                label="Sync from VaultRE",
                url=reverse("sync_team"),
                icon_name="upload",
                classname="button-secondary",
                priority=20,
            )
        )
        return buttons


class TeamMemberViewSet(SnippetViewSet):
    model = TeamMember
    icon = "user"
    menu_label = "Team Members"
    menu_name = "team_members"
    add_to_admin_menu = False
    list_display = ("name", "role", "is_active", "order", "updated_at")
    list_filter = ("is_active",)
    search_fields = ("name", "slug", "role", "tags", "email", "phone")
    index_view_class = TeamMemberIndexView


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
    from django.core.management import call_command
    from io import StringIO
    try:
        out = StringIO()
        call_command("sync_vault_agents", stdout=out)
        output = out.getvalue()
        synced = sum(
            1 for line in output.splitlines()
            if line.strip().startswith(("Created", "Updated"))
        )
        messages.success(request, f"Team members synced from VaultRE ({synced} upserted).")
    except Exception as exc:
        messages.error(request, f"Sync failed: {exc}")

    try:
        return redirect(reverse("wagtailsnippets_team_teammember:list"))
    except Exception:
        return redirect("/cms/snippets/team/teammember/")


@hooks.register("register_admin_urls")
def register_team_urls():
    return [
        path("sync-team/", sync_team_view, name="sync_team"),
    ]
