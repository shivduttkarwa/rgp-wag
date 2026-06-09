from wagtail import hooks
from django.utils.safestring import mark_safe


@hooks.register("insert_global_admin_css")
def global_admin_css():
    return mark_safe("""
<style>
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

  /* Active / hover menu items */
  .sidebar-menu-item__link:hover,
  .sidebar-menu-item--active .sidebar-menu-item__link {
    background-color: rgba(249, 194, 6, 0.12) !important;
    color: #f9c206 !important;
  }

  /* Account bar at bottom */
  .sidebar-sub-menu-panel,
  .sidebar-footer {
    background-color: #001430 !important;
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
