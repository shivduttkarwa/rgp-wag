from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Property, PropertyAgent


class ListingViewSet(SnippetViewSet):
    model = Property
    menu_label = "Listings"
    menu_name = "listings"
    menu_icon = "home"
    add_to_admin_menu = True
    list_display = ("title", "listing_category", "status", "price", "city", "updated_at")
    list_filter = ("listing_category", "status", "featured", "city")
    search_fields = ("title", "slug", "address", "city")


class PropertyAgentViewSet(SnippetViewSet):
    model = PropertyAgent
    menu_label = "Listing Agents"
    menu_name = "listing_agents"
    menu_icon = "user"
    add_to_admin_menu = False
    list_display = ("name", "title", "phone", "email")
    search_fields = ("name", "email")


register_snippet(ListingViewSet)
register_snippet(PropertyAgentViewSet)
