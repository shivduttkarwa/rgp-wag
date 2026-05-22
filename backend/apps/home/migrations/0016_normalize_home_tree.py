from django.db import migrations


def normalize_home_tree(apps, schema_editor):
    from wagtail.models import Page, Site
    from apps.home.models import HomePage

    root = Page.get_first_root_node()
    home = HomePage.objects.first()

    if not home:
        return

    wrapper = None
    current_parent = home.get_parent()
    if current_parent and current_parent.id != root.id:
        wrapper = current_parent.specific
        home.move(root, pos="last-child")
        home.refresh_from_db()

    if wrapper and wrapper.id != root.id:
        for child in wrapper.get_children().specific():
            if child.id == home.id:
                continue
            if child.can_move_to(home):
                child.move(home, pos="last-child")

        wrapper.refresh_from_db()
        if wrapper.get_children_count() == 0 and wrapper.specific_class is Page:
            wrapper.delete()

    default_site = Site.objects.filter(is_default_site=True).first()
    if default_site and default_site.root_page_id != home.id:
        default_site.root_page = home
        default_site.save(update_fields=["root_page"])

    Page.fix_tree()


class Migration(migrations.Migration):

    dependencies = [
        ("home", "0015_contactpage"),
    ]

    operations = [
        migrations.RunPython(normalize_home_tree, migrations.RunPython.noop),
    ]
