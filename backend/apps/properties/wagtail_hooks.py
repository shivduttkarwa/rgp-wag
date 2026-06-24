from django.utils.safestring import mark_safe
from wagtail import hooks
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


@hooks.register("insert_global_admin_css")
def vault_portfolio_css():
    return mark_safe("""
<style>
#id_vault_property_id {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
}
.vault-search-input {
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  box-sizing: border-box;
}
</style>
""")


@hooks.register("insert_global_admin_js")
def vault_portfolio_js():
    return mark_safe("""
<script>
(function () {
  function initVaultSelect() {
    var sel = document.getElementById('id_vault_property_id');
    if (!sel || sel.dataset.vaultInit) return;
    sel.dataset.vaultInit = '1';

    /* ── Search filter ───────────────────────────────── */
    var allOptions = Array.from(sel.options).map(function (o) {
      return { el: o.cloneNode(true), text: o.text.toLowerCase(), val: o.value };
    });

    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Search properties…';
    search.className = 'vault-search-input';
    sel.parentNode.insertBefore(search, sel);

    search.addEventListener('input', function () {
      var q = this.value.toLowerCase().trim();
      /* rebuild option list */
      while (sel.options.length) sel.remove(0);
      allOptions.forEach(function (item) {
        if (!q || item.val === '' || item.text.includes(q)) {
          sel.appendChild(item.el.cloneNode(true));
        }
      });
    });

    /* ── Auto-fill sibling fields on selection ───────── */
    sel.addEventListener('change', function () {
      var opt = sel.options[sel.selectedIndex];
      if (!opt || !opt.value) return;
      var d = opt.dataset;

      function fill(id, val) {
        var el = document.getElementById(id);
        if (el && val !== undefined && val !== null) {
          el.value = val;
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      fill('id_title',         d.title);
      fill('id_location',      d.location);
      fill('id_price',         d.price);
      fill('id_status',        d.status);
      fill('id_beds',          d.beds);
      fill('id_baths',         d.baths);
      fill('id_area',          d.area);
      fill('id_property_slug', d.slug);
    });
  }

  /* Run after DOM + Wagtail's own scripts */
  document.addEventListener('DOMContentLoaded', function () { setTimeout(initVaultSelect, 200); });
})();
</script>
""")

