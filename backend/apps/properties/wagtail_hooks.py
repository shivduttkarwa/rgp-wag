from django.shortcuts import redirect, render
from django.contrib import messages
from django.urls import path, reverse
from django.utils.safestring import mark_safe
from django.views.decorators.http import require_http_methods
from wagtail import hooks
from wagtail.admin.menu import MenuItem, SubmenuMenuItem, Menu
from wagtail.snippets.models import register_snippet
from wagtail.snippets.views.snippets import SnippetViewSet, SnippetViewSetGroup

from .models import Property, PortfolioShowcaseItem


# ─── Snippet ViewSets ─────────────────────────────────────────────────────────

class ListingViewSet(SnippetViewSet):
    model = Property
    menu_label = "Local Listings"
    menu_name = "listings"
    menu_icon = "edit"
    menu_order = 20
    list_display = ("title", "listing_category", "status", "price", "city", "updated_at")
    list_filter = ("listing_category", "status", "featured", "city")
    search_fields = ("title", "slug", "address", "city")


class PropertiesSnippetGroup(SnippetViewSetGroup):
    menu_label = "Properties (internal)"
    menu_name = "properties_internal"
    menu_icon = "home"
    menu_order = 250
    add_to_admin_menu = True   # must be True so Wagtail hides children from Snippets index
    items = (ListingViewSet,)


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


register_snippet(PropertiesSnippetGroup)
register_snippet(PortfolioShowcaseViewSet)


# ─── VaultRE Listings (read-only view) ───────────────────────────────────────

_CATEGORY_CHOICES = [
    ("",         "All"),
    ("for-sale", "For Sale"),
    ("for-rent", "For Rent"),
    ("sold",     "Sold"),
]

_CATEGORY_DISPLAY = {
    "for-sale": "For Sale",
    "for-rent": "For Rent",
    "sold":     "Sold",
}


@require_http_methods(["GET"])
def vaultre_listings_view(request):
    from apps.properties.vaultre import get_listings, normalise_list

    category_filter = request.GET.get("category", "")
    search = request.GET.get("q", "").strip().lower()

    try:
        all_listings = [normalise_list(p) for p in get_listings()]
        for p in all_listings:
            p["category_display"] = _CATEGORY_DISPLAY.get(p.get("category", ""), p.get("category", ""))
    except Exception:
        all_listings = []

    counts = {
        "all":      len(all_listings),
        "for_sale": sum(1 for p in all_listings if p.get("category") == "for-sale"),
        "for_rent": sum(1 for p in all_listings if p.get("category") == "for-rent"),
        "sold":     sum(1 for p in all_listings if p.get("category") == "sold"),
    }

    listings = all_listings
    if category_filter:
        listings = [p for p in listings if p.get("category") == category_filter]

    if search:
        listings = [
            p for p in listings
            if search in (p.get("title") or "").lower()
            or search in (p.get("address") or "").lower()
            or search in (p.get("city") or "").lower()
        ]

    return render(request, "wagtailadmin/vaultre_listings.html", {
        "listings":          listings,
        "category":          category_filter,
        "search":            search,
        "counts":            counts,
        "total":             len(listings),
        "category_choices":  _CATEGORY_CHOICES,
    })


# ─── Sync Properties ─────────────────────────────────────────────────────────

@require_http_methods(["GET", "POST"])
def sync_properties_view(request):
    if request.method == "POST":
        from apps.properties.vaultre import _fetch_all_listings, save_cache, sync_staff_from_listings
        try:
            data = _fetch_all_listings()
            save_cache(data)
            sync_staff_from_listings(data)
            messages.success(request, f"Successfully synced {len(data)} properties from VaultRE.")
        except Exception as exc:
            messages.error(request, f"Sync failed: {exc}")
        return redirect(reverse("sync_properties"))

    return render(request, "wagtailadmin/sync_properties.html")


# ─── URL registration ─────────────────────────────────────────────────────────

@hooks.register("register_admin_urls")
def register_property_urls():
    return [
        path("sync-properties/",  sync_properties_view,  name="sync_properties"),
        path("vaultre-listings/", vaultre_listings_view, name="vaultre_listings"),
    ]


# ─── Menu ─────────────────────────────────────────────────────────────────────

@hooks.register("construct_main_menu")
def remove_internal_properties_group(request, menu_items):
    menu_items[:] = [i for i in menu_items if getattr(i, "name", "") != "properties_internal"]


@hooks.register("register_admin_menu_item")
def register_sync_menu_item():
    return MenuItem("Sync Properties", "/cms/sync-properties/", icon_name="upload", order=105)


@hooks.register("register_admin_menu_item")
def register_properties_menu():
    try:
        local_url = reverse("wagtailsnippets_properties_property:list")
    except Exception:
        local_url = "/cms/snippets/properties/property/"

    submenu = Menu(items=[
        MenuItem(
            "VaultRE Listings",
            "/cms/vaultre-listings/",
            icon_name="home",
            order=10,
        ),
        MenuItem(
            "Local Listings",
            local_url,
            icon_name="edit",
            order=20,
        ),
    ])
    return SubmenuMenuItem(
        "Properties",
        submenu,
        icon_name="home",
        order=250,
    )


# ─── Portfolio Showcase admin CSS / JS ───────────────────────────────────────

@hooks.register("insert_global_admin_css")
def vault_portfolio_css():
    return mark_safe("""
<style>
#id_vault_property_id,
#id_local_property {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  box-sizing: border-box;
}
.vault-search-input,
.local-search-input {
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

  /* ── shared fill helper ── */
  function fill(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined && val !== null) {
      el.value = val;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /* ── VaultRE property selector ── */
  function initVaultSelect() {
    var sel = document.getElementById('id_vault_property_id');
    if (!sel || sel.dataset.vaultInit) return;
    sel.dataset.vaultInit = '1';

    var allOptions = Array.from(sel.options).map(function (o) {
      return { el: o.cloneNode(true), text: o.text.toLowerCase(), val: o.value };
    });

    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Search VaultRE properties…';
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
      fill('id_title',         d.title);
      fill('id_location',      d.location);
      fill('id_price',         d.price);
      fill('id_status',        d.status);
      fill('id_beds',          d.beds);
      fill('id_baths',         d.baths);
      fill('id_area',          d.area);
      fill('id_property_slug', d.slug);
      /* clear local property selector when VaultRE is chosen */
      var local = document.getElementById('id_local_property');
      if (local) local.value = '';
    });
  }

  /* ── Local property selector ── */
  function initLocalSelect() {
    var sel = document.getElementById('id_local_property');
    if (!sel || sel.dataset.localInit) return;
    sel.dataset.localInit = '1';

    var allOptions = Array.from(sel.options).map(function (o) {
      return { el: o.cloneNode(true), text: o.text.toLowerCase(), val: o.value };
    });

    var search = document.createElement('input');
    search.type = 'text';
    search.placeholder = 'Search local properties…';
    search.className = 'local-search-input';
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
      fill('id_title',         d.title);
      fill('id_location',      d.location);
      fill('id_price',         d.price);
      fill('id_status',        d.status);
      fill('id_beds',          d.beds);
      fill('id_baths',         d.baths);
      fill('id_area',          d.area);
      fill('id_property_slug', d.slug);
      /* clear VaultRE selector when local is chosen */
      var vault = document.getElementById('id_vault_property_id');
      if (vault) vault.value = '';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      initVaultSelect();
      initLocalSelect();
    }, 200);
  });

})();
</script>
""")
