from django.shortcuts import redirect
from django.contrib import messages
from django.urls import path, reverse
from django.utils.safestring import mark_safe
from wagtail import hooks
from wagtail.admin.menu import MenuItem
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet

from .models import Property, PortfolioShowcaseItem


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
register_snippet(PortfolioShowcaseViewSet)


# ─── Sync Properties ─────────────────────────────────────────────────────────

def sync_properties_view(request):
    from apps.properties.vaultre import _fetch_all_listings, save_cache
    try:
        data = _fetch_all_listings()
        save_cache(data)
        messages.success(request, f"Synced {len(data)} properties from VaultRE.")
    except Exception as exc:
        messages.error(request, f"Sync failed: {exc}")
    return redirect(reverse("wagtailadmin_home"))


@hooks.register("register_admin_urls")
def register_sync_url():
    return [path("sync-properties/", sync_properties_view, name="sync_properties")]


@hooks.register("register_admin_menu_item")
def register_sync_menu_item():
    return MenuItem("Sync Properties", "/cms/sync-properties/", icon_name="upload", order=270)


# ─── Portfolio admin CSS / JS ────────────────────────────────────────────────

@hooks.register("insert_global_admin_css")
def vault_portfolio_css():
    return mark_safe("""
<style>
/* Sync Properties button */
a[href="/cms/sync-properties/"] {
  background: #1a6be5 !important;
  color: #fff !important;
  border-radius: 6px !important;
  font-weight: 600 !important;
  margin-top: 0.5rem !important;
}
a[href="/cms/sync-properties/"]:hover {
  background: #1558c0 !important;
  color: #fff !important;
}
a[href="/cms/sync-properties/"] svg,
a[href="/cms/sync-properties/"] .icon {
  color: #fff !important;
  fill: #fff !important;
}

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
      while (sel.options.length) sel.remove(0);
      allOptions.forEach(function (item) {
        if (!q || item.val === '' || item.text.includes(q)) {
          sel.appendChild(item.el.cloneNode(true));
        }
      });
    });

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

  document.addEventListener('DOMContentLoaded', function () { setTimeout(initVaultSelect, 200); });
})();
</script>
""")
