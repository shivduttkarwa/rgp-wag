from django.core.management.base import BaseCommand
from wagtail.models import Page, Site

from apps.home.models import HomePage


class Command(BaseCommand):
    help = (
        "Normalize Wagtail tree so HomePage sits directly under Root, "
        "with other pages nested under HomePage where possible."
    )

    def handle(self, *args, **options):
        root = Page.get_first_root_node()
        home = HomePage.objects.first()

        if not home:
            self.stdout.write(self.style.WARNING("No HomePage found. Nothing to normalize."))
            return

        moved_home = False
        moved_children = 0
        deleted_wrapper = False
        wrapper = None

        current_parent = home.get_parent()
        if current_parent and current_parent.id != root.id:
            wrapper = current_parent.specific
            self.stdout.write(
                f"Moving HomePage (id={home.id}, title='{home.title}') under Root..."
            )
            home.move(root, pos="last-child")
            moved_home = True
            home.refresh_from_db()

        # If HomePage was under a wrapper, move any remaining wrapper children
        # under HomePage when allowed.
        if wrapper and wrapper.id != root.id:
            remaining = wrapper.get_children().specific()
            for child in remaining:
                if child.id == home.id:
                    continue
                if child.can_move_to(home):
                    self.stdout.write(
                        f"Moving page '{child.title}' (id={child.id}) under HomePage..."
                    )
                    child.move(home, pos="last-child")
                    moved_children += 1
                else:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Could not move '{child.title}' (id={child.id}) under HomePage "
                            f"due to parent type restrictions."
                        )
                    )

            wrapper.refresh_from_db()
            wrapper_children_left = wrapper.get_children_count()
            if wrapper_children_left == 0 and wrapper.specific_class is Page:
                self.stdout.write(
                    f"Deleting empty wrapper page '{wrapper.title}' (id={wrapper.id})..."
                )
                wrapper.delete()
                deleted_wrapper = True
            elif wrapper_children_left > 0:
                self.stdout.write(
                    self.style.WARNING(
                        f"Wrapper page '{wrapper.title}' still has {wrapper_children_left} "
                        "child page(s), so it was kept."
                    )
                )

        default_site = Site.objects.filter(is_default_site=True).first()
        if default_site and default_site.root_page_id != home.id:
            self.stdout.write(
                f"Updating default Site root_page from id={default_site.root_page_id} to HomePage id={home.id}..."
            )
            default_site.root_page = home
            default_site.save(update_fields=["root_page"])

        Page.fix_tree()

        self.stdout.write(
            self.style.SUCCESS(
                "Home tree normalized. "
                f"moved_home={moved_home}, moved_children={moved_children}, "
                f"deleted_wrapper={deleted_wrapper}"
            )
        )
