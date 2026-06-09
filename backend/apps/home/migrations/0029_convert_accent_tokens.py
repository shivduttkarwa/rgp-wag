"""
Data migration: convert [gold]...[/gold] / [amber]...[/amber] tokens in StreamField
title_line_1 / title_line_2 fields to RichText HTML format, ready for the
RichTextBlock editor.
"""
import re

from django.db import migrations


# ─── Conversion helpers ───────────────────────────────────────────────────────

def _has_tokens(text):
    return isinstance(text, str) and ("[gold]" in text or "[amber]" in text)


def _convert(text):
    """'Your [gold]Dream[/gold] Home'  →  '<p>Your <span class="rg-gold">Dream</span> Home</p>'"""
    if not isinstance(text, str) or text.strip().startswith("<"):
        return text
    text = re.sub(r"\[gold\](.*?)\[/gold\]", r'<span class="rg-gold">\1</span>', text)
    text = re.sub(r"\[amber\](.*?)\[/amber\]", r'<span class="rg-amber">\1</span>', text)
    return f"<p>{text}</p>"


def _patch_blocks(stream_data, block_types_fields):
    """
    Mutate stream_data in-place, return True if any value was changed.
    block_types_fields: {block_type_name: [field, ...]}
    """
    changed = False
    if not isinstance(stream_data, list):
        return False
    for block in stream_data:
        btype = block.get("type")
        fields = block_types_fields.get(btype)
        if not fields:
            continue
        value = block.get("value")
        if not isinstance(value, dict):
            continue
        for field in fields:
            old = value.get(field, "")
            if _has_tokens(old):
                value[field] = _convert(old)
                changed = True
    return changed


# ─── Forwards migration ───────────────────────────────────────────────────────

def forwards(apps, schema_editor):
    TITLE_FIELDS = ["title_line_1", "title_line_2"]

    # HomePage — HeroBlock (type "hero")
    for page in apps.get_model("home", "HomePage").objects.all():
        if _patch_blocks(page.body, {"hero": TITLE_FIELDS}):
            page.save(update_fields=["body"])

    # TeamPage — InternalPageHeroBlock (type "hero") + TeamSectionBlock (type "team_section")
    for page in apps.get_model("home", "TeamPage").objects.all():
        if _patch_blocks(page.body, {"hero": TITLE_FIELDS, "team_section": TITLE_FIELDS}):
            page.save(update_fields=["body"])

    # AboutPage, ContactPage, TestimonialsPage, PropertiesPage — InternalPageHeroBlock (type "hero")
    for model_name in ("AboutPage", "ContactPage", "TestimonialsPage", "PropertiesPage"):
        for page in apps.get_model("home", model_name).objects.all():
            if _patch_blocks(page.body, {"hero": TITLE_FIELDS}):
                page.save(update_fields=["body"])

    # ServicesPage, EoiPage — InternalPageHeroBlock (type "internal_page_hero") in hero_content
    for model_name in ("ServicesPage", "EoiPage"):
        for page in apps.get_model("home", model_name).objects.all():
            if _patch_blocks(page.hero_content, {"internal_page_hero": TITLE_FIELDS}):
                page.save(update_fields=["hero_content"])


def backwards(apps, schema_editor):
    pass  # Irreversible — no need to un-convert


# ─── Migration class ──────────────────────────────────────────────────────────

class Migration(migrations.Migration):

    dependencies = [
        ("home", "0028_remove_contactpage_contact_content_and_more"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
