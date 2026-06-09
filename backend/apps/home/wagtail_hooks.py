import wagtail.admin.rich_text.editors.draftail.features as draftail_features
from wagtail import hooks
from wagtail.admin.rich_text.converters.html_to_contentstate import InlineStyleElementHandler
from django.utils.safestring import mark_safe


# ─── Custom Draftail inline styles ───────────────────────────────────────────

@hooks.register("register_rich_text_features")
def register_accent_gold(features):
    type_ = "ACCENT_GOLD"
    features.register_editor_plugin(
        "draftail", "accent-gold",
        draftail_features.InlineStyleFeature({
            "type": type_,
            "label": "Gold",
            "description": "Gold accent colour",
            "style": {"color": "#f9c206", "fontWeight": "700"},
        }),
    )
    features.register_converter_rule("contentstate", "accent-gold", {
        "from_database_format": {"span[class=\"rg-gold\"]": InlineStyleElementHandler(type_)},
        "to_database_format": {"style_map": {type_: "span class=\"rg-gold\""}},
    })


@hooks.register("register_rich_text_features")
def register_accent_amber(features):
    type_ = "ACCENT_AMBER"
    features.register_editor_plugin(
        "draftail", "accent-amber",
        draftail_features.InlineStyleFeature({
            "type": type_,
            "label": "Amber",
            "description": "Amber accent colour",
            "style": {"color": "#f97316", "fontWeight": "700"},
        }),
    )
    features.register_converter_rule("contentstate", "accent-amber", {
        "from_database_format": {"span[class=\"rg-amber\"]": InlineStyleElementHandler(type_)},
        "to_database_format": {"style_map": {type_: "span class=\"rg-amber\""}},
    })


# ─── Admin branding ───────────────────────────────────────────────────────────

@hooks.register("insert_global_admin_css")
def global_admin_css():
    return mark_safe("""
<style>
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
