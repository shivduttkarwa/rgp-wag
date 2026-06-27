from django.http import HttpResponse

BASE_URL = "https://realgoldproperties.com.au"

STATIC_PAGES = [
    ("",                          "1.0",  "weekly"),
    ("/about",                    "0.8",  "monthly"),
    ("/services",                 "0.8",  "monthly"),
    ("/properties",               "0.9",  "daily"),
    ("/team",                     "0.7",  "monthly"),
    ("/testimonials",             "0.7",  "monthly"),
    ("/contact",                  "0.7",  "monthly"),
    ("/expressions-of-interest",  "0.6",  "monthly"),
]


def sitemap_view(request):
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]

    for path, priority, changefreq in STATIC_PAGES:
        lines.append(
            f"  <url>"
            f"<loc>{BASE_URL}{path}</loc>"
            f"<priority>{priority}</priority>"
            f"<changefreq>{changefreq}</changefreq>"
            f"</url>"
        )

    try:
        from apps.properties.vaultre import _load_cache
        for prop in _load_cache():
            slug = prop.get("slug", "")
            if slug:
                lines.append(
                    f"  <url>"
                    f"<loc>{BASE_URL}/properties/{slug}</loc>"
                    f"<priority>0.8</priority>"
                    f"<changefreq>daily</changefreq>"
                    f"</url>"
                )
    except Exception:
        pass

    lines.append("</urlset>")
    return HttpResponse("\n".join(lines), content_type="application/xml; charset=utf-8")
