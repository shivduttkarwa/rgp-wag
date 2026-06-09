import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("testimonials", "0002_featuredtestimonial"),
    ]

    operations = [
        # Remove old fields
        migrations.RemoveField(model_name="featuredtestimonial", name="kicker"),
        migrations.RemoveField(model_name="featuredtestimonial", name="title_line_1"),
        migrations.RemoveField(model_name="featuredtestimonial", name="title_line_2"),
        migrations.RemoveField(model_name="featuredtestimonial", name="title_line_3"),
        # Add new fields
        migrations.AddField(
            model_name="featuredtestimonial",
            name="rating",
            field=models.PositiveSmallIntegerField(
                default=5,
                help_text="Star rating 1–5. Shown above the slide title.",
                validators=[
                    django.core.validators.MinValueValidator(1),
                    django.core.validators.MaxValueValidator(5),
                ],
            ),
        ),
        migrations.AddField(
            model_name="featuredtestimonial",
            name="title",
            field=models.CharField(
                default="",
                max_length=500,
                help_text=(
                    "Slide heading. Use newlines to control line breaks; "
                    "otherwise words are grouped automatically (~2 per line)."
                ),
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="featuredtestimonial",
            name="image_url",
            field=models.CharField(
                blank=True,
                default="",
                help_text="Fallback image path relative to public/ or full URL. Used when no image is chosen above.",
                max_length=500,
            ),
        ),
    ]
