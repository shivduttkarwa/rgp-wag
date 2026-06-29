from django.db import migrations


def fix_content(apps, schema_editor):
    """Remove <br> inside <p> tags — Wagtail's Draftail editor rejects them."""
    LegalSettings = apps.get_model("core", "LegalSettings")
    for obj in LegalSettings.objects.all():
        obj.privacy_policy = obj.privacy_policy.replace(
            "<p>Real Gold Properties<br>PO Box 4024 Forest Lake, 4078, QLD, Australia<br>Email: "
            "<a href=\"mailto:admin@realgoldproperties.com.au\">admin@realgoldproperties.com.au</a></p>",
            "<p>Real Gold Properties</p>"
            "<p>PO Box 4024 Forest Lake, 4078, QLD, Australia</p>"
            "<p>Email: <a href=\"mailto:admin@realgoldproperties.com.au\">admin@realgoldproperties.com.au</a></p>",
        )
        obj.collection_notice = obj.collection_notice.replace(
            "<p>Address: PO Box 4024, Forest Lakes QLD 4078<br>Email: "
            "<a href=\"mailto:admin@realgoldproperties.com.au\">admin@realgoldproperties.com.au</a></p>",
            "<p>Address: PO Box 4024, Forest Lakes QLD 4078</p>"
            "<p>Email: <a href=\"mailto:admin@realgoldproperties.com.au\">admin@realgoldproperties.com.au</a></p>",
        )
        obj.save()


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_legalsettings_default_content"),
    ]

    operations = [
        migrations.RunPython(fix_content, noop),
    ]
