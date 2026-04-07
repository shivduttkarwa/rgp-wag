from django.db import migrations


def populate_card_image(apps, schema_editor):
    Property = apps.get_model("properties", "Property")
    PropertyImage = apps.get_model("properties", "PropertyImage")

    for prop in Property.objects.filter(card_image__isnull=True).iterator():
        first = (
            PropertyImage.objects.filter(property_id=prop.id, image__isnull=False)
            .order_by("sort_order", "id")
            .first()
        )
        if first and first.image_id:
            prop.card_image_id = first.image_id
            prop.save(update_fields=["card_image"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0004_property_card_image_alter_propertyimage_url"),
    ]

    operations = [
        migrations.RunPython(populate_card_image, noop_reverse),
    ]

