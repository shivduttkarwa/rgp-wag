from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Property, PropertyAgent, PortfolioShowcaseItem


class ListingViewSet(SnippetViewSet):
    model = Property
    menu_label = "Property Listings"
    menu_name = "listings"
    menu_icon = "home"
    menu_order = 250
    add_to_admin_menu = True
    list_display = ("title", "listing_category", "status", "price", "city", "updated_at")
    list_filter = ("listing_category", "status", "featured", "city")
    search_fields = ("title", "slug", "address", "city")


class PropertyAgentViewSet(SnippetViewSet):
    model = PropertyAgent
    menu_label = "Property Agents"
    menu_name = "listing_agents"
    menu_icon = "user"
    menu_order = 255
    add_to_admin_menu = True
    list_display = ("name", "title", "phone", "email")
    search_fields = ("name", "email")


class PortfolioShowcaseViewSet(SnippetViewSet):
    model = PortfolioShowcaseItem
    menu_label = "Portfolio Showcase"
    menu_name = "portfolio_showcase"
    menu_icon = "folder-open-inverse"
    menu_order = 260
    add_to_admin_menu = True
    list_display = ("title", "location", "status", "price", "is_active", "order")
    list_filter = ("is_active", "status")
    search_fields = ("title", "location")


register_snippet(ListingViewSet)
register_snippet(PropertyAgentViewSet)
register_snippet(PortfolioShowcaseViewSet)
