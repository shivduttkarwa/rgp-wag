import os
from django.http import HttpResponse
from django.urls import path
from wagtail import hooks
from wagtail.admin.menu import MenuItem
from django.utils.safestring import mark_safe


# ─── Admin branding ───────────────────────────────────────────────────────────

@hooks.register("insert_global_admin_css")
def global_admin_css():
    return mark_safe("""
<style>
  /* ── CMS Guide — gold highlight in sidebar ── */
  a[href="/cms/cms-guide/"],
  a[href="/cms/cms-guide/"].sidebar-menu-item__link {
    background: rgba(249,195,7,0.12) !important;
    border-left: 3px solid #f9c307 !important;
    margin: 2px 6px !important;
    border-radius: 6px !important;
    transition: background 0.2s ease, box-shadow 0.2s ease !important;
  }
  a[href="/cms/cms-guide/"]:hover,
  a[href="/cms/cms-guide/"].sidebar-menu-item__link:hover {
    background: rgba(249,195,7,0.24) !important;
    box-shadow: 0 0 0 1px rgba(249,195,7,0.35) !important;
  }
  a[href="/cms/cms-guide/"] .icon,
  a[href="/cms/cms-guide/"] svg {
    color: #f9c307 !important;
    fill: #f9c307 !important;
  }
  a[href="/cms/cms-guide/"] .menuitem-label {
    color: #f9c307 !important;
    font-weight: 600 !important;
  }

  /* ── Replace Wagtail bird logo with RGP logo ── */
  .sidebar-wagtail-branding__icon { display: none !important; }
  .sidebar-wagtail-branding__icon-wrapper {
    background: url('/images/RGP-logo.png') no-repeat center/contain !important;
    width: 6rem !important;
    height: 6rem !important;
  }

  /* ── Override Wagtail purple with RGP navy ── */
  :root,
  [data-controller~="w-sidebar"] {
    --w-color-primary:        #001f49;
    --w-color-primary-200:    #002a6b;
    --w-color-primary-400:    #001430;
    --w-color-secondary-600:  #f9c206;
    --w-color-secondary-100:  #fef9ec;
  }

  /* Sidebar background */
  .sidebar,
  .sidebar__inner,
  [data-sidebar-nav-singleton-target="inner"] {
    background-color: #001f49 !important;
  }

  /* Top nav / header bar */
  header.header,
  .w-header {
    background-color: #001f49 !important;
    border-bottom-color: rgba(249,194,6,0.2) !important;
  }

  /* Buttons & highlights */
  .button-primary,
  .w-btn-primary,
  a.button.bicolor.icon {
    background-color: #f9c206 !important;
    color: #001f49 !important;
    border-color: #f9c206 !important;
  }

  .button-primary:hover,
  .w-btn-primary:hover {
    background-color: #d4a200 !important;
    border-color: #d4a200 !important;
  }
</style>
""")


@hooks.register("insert_editor_js")
def internal_page_hero_admin_js():
    return mark_safe("""
<script>
(function () {
  function getHeroField(block, name) {
    var children = Array.prototype.slice.call(block.children || []);
    var directMatch = children.find(function (child) {
      return child.getAttribute("data-contentpath") === name;
    });

    return (
      directMatch ||
      block.querySelector('[data-contentpath="' + name + '"]') ||
      block.querySelector('[data-structblock-child="' + name + '"]')
    );
  }

  function setVisible(element, visible) {
    if (!element) return;
    element.hidden = !visible;
    element.style.display = visible ? "" : "none";
  }

  function setupHeroBlock(block) {
    if (!block || block.dataset.internalHeroToggleReady === "true") return;

    var modeField = getHeroField(block, "mode");
    var modeSelect = modeField ? modeField.querySelector("select") : null;

    if (!modeSelect) return;

    var buttonsField = getHeroField(block, "buttons");
    var statsField = getHeroField(block, "stats");

    function syncPanelFields() {
      var mode = modeSelect.value || "none";
      setVisible(buttonsField, mode === "buttons");
      setVisible(statsField, mode === "stats");
    }

    modeSelect.addEventListener("change", syncPanelFields);
    block.dataset.internalHeroToggleReady = "true";
    syncPanelFields();
  }

  function init(root) {
    (root || document).querySelectorAll(".internal-page-hero-block").forEach(setupHeroBlock);
  }

  document.addEventListener("DOMContentLoaded", function () {
    init(document);
  });

  document.addEventListener("wagtail:load", function (event) {
    init(event.target || document);
  });

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (node.nodeType === 1) init(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  init(document);
})();
</script>
""")


# ─── CMS Guide ───────────────────────────────────────────────────────────────

_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
_GUIDE_PATH = os.path.join(_REPO_ROOT, "docs", "cms-guide.html")
_ASSETS_DIR = os.path.join(_REPO_ROOT, "ss-for-guide-page")


def cms_guide_view(request):
    try:
        with open(_GUIDE_PATH, "r", encoding="utf-8") as f:
            html = f.read()
        # Rewrite relative asset paths to the Django-served URL
        html = html.replace("../ss-for-guide-page/", "/cms/guide-assets/")
        return HttpResponse(html, content_type="text/html; charset=utf-8")
    except FileNotFoundError:
        return HttpResponse("<h1>Guide not found</h1>", status=404)


def cms_guide_asset_view(request, asset_path):
    from django.views.static import serve
    return serve(request, asset_path, document_root=_ASSETS_DIR)


@hooks.register("register_admin_urls")
def register_guide_url():
    return [
        path("cms-guide/", cms_guide_view, name="cms_guide"),
        path("guide-assets/<path:asset_path>", cms_guide_asset_view, name="cms_guide_asset"),
    ]


@hooks.register("register_admin_menu_item")
def register_guide_menu_item():
    return MenuItem(
        "CMS Guide",
        "/cms/cms-guide/",
        icon_name="help",
        order=50,
    )
