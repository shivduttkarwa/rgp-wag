from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status
from rest_framework.permissions import AllowAny

from . import vaultre


_STATUS_DISPLAY = {
    "for_sale": "For Sale",
    "for_rent": "For Rent",
    "sold": "Sold",
    "pending": "Pending",
}


def _card_image_url(prop) -> str:
    img = getattr(prop, "card_image", None)
    if img and getattr(img, "file", None):
        try:
            return img.file.url
        except Exception:
            pass
    return ""


def _price_label(prop) -> str:
    if prop.price_label and prop.price_label != "Listed Price":
        return prop.price_label
    return f"${int(prop.price):,}" if prop.price else ""


def normalise_local_list(prop) -> dict:
    """Serialise a local Property to the same shape as vaultre.normalise_list()."""
    thumb = _card_image_url(prop)
    status = _STATUS_DISPLAY.get(prop.status, prop.status)
    location = f"{prop.city}, {prop.state}" if prop.city and prop.state else (prop.city or prop.state or "")
    return {
        "id": f"local-{prop.pk}",
        "slug": prop.slug,
        "title": prop.title,
        "address": prop.address,
        "city": prop.city,
        "state": prop.state,
        "location": location,
        "price": int(prop.price) if prop.price else None,
        "price_label": _price_label(prop),
        "status": status,
        "category": prop.listing_category,
        "image": thumb,
        "thumbnail": thumb or None,
        "beds": prop.bedrooms,
        "baths": prop.bathrooms,
        "sqft": prop.area_sqft,
        "garage": prop.garages,
        "badge": prop.badge,
        "isNew": prop.is_new,
        "featured": prop.featured,
        "show_on_home_prime": prop.show_on_home_prime,
        "show_in_portfolio": prop.show_in_portfolio,
        "views": prop.views,
        "soldDate": prop.sold_date_label,
        "soldPrice": int(prop.sold_price) if prop.sold_price else None,
        "daysOnMarket": prop.days_on_market,
        "deposit": int(prop.deposit) if prop.deposit else None,
        "minLease": prop.min_lease,
        "features": [],
        "agent": None,
        # VaultRE-compat keys (so frontend code that reads these doesn't break)
        "heading": prop.title,
        "displayAddress": prop.address,
        "displayPrice": _price_label(prop),
        "bed": prop.bedrooms,
        "bath": prop.bathrooms,
        "garages": prop.garages,
        "landArea": None,
        "floorArea": {"value": str(prop.area_sqft), "units": "sqft"} if prop.area_sqft else None,
        "photos": [],
        "class": prop.category,
        "type": prop.category,
        "portalStatus": prop.status,
        "sourceEndpoint": "local",
        "listingCategory": prop.listing_category,
        "source": "local",
    }


def normalise_local_detail(prop) -> dict:
    """Serialise a local Property to the same shape as vaultre.normalise_detail()."""
    thumb = _card_image_url(prop)
    status = _STATUS_DISPLAY.get(prop.status, prop.status)
    location = f"{prop.city}, {prop.state}" if prop.city and prop.state else (prop.city or prop.state or "")

    images = []
    for img in prop.images.select_related("image").all():
        url = img.get_resolved_url() or img.url
        if url:
            images.append({"url": url, "alt": img.alt})
    if thumb and not images:
        images = [{"url": thumb, "alt": prop.title}]

    features = [
        {"icon": f.icon, "title": f.title, "description": f.description}
        for f in prop.features.all()
    ]
    details = [
        {"label": r.label, "value": r.value}
        for r in prop.detail_rows.all()
    ]
    nearby = [
        {"name": loc.name, "distance": loc.distance, "type": loc.type}
        for loc in prop.nearby_locations.all()
    ]

    stats = []
    if prop.bedrooms:
        stats.append({"icon": "bed", "value": str(prop.bedrooms), "label": "Bedrooms"})
    if prop.bathrooms:
        stats.append({"icon": "bath", "value": str(prop.bathrooms), "label": "Bathrooms"})
    if prop.area_sqft:
        stats.append({"icon": "area", "value": f"{prop.area_sqft} sqft", "label": "Floor Area"})
    if prop.garages:
        stats.append({"icon": "garage", "value": str(prop.garages), "label": "Garages"})
    if prop.year_built:
        stats.append({"icon": "year", "value": str(prop.year_built), "label": "Year Built"})
    if prop.lot_size:
        stats.append({"icon": "lot", "value": prop.lot_size, "label": "Land Area"})

    overview_lines = [l.strip() for l in (prop.overview or "").splitlines() if l.strip()]

    return {
        "slug": prop.slug,
        "title": prop.title,
        "address": prop.address,
        "city": prop.city,
        "state": prop.state,
        "zip_code": prop.zip_code,
        "location": location,
        "price": int(prop.price) if prop.price else None,
        "price_label": _price_label(prop),
        "status": status,
        "featured": prop.featured,
        "show_on_home_prime": prop.show_on_home_prime,
        "show_in_portfolio": prop.show_in_portfolio,
        "category": prop.listing_category,
        "description": prop.description,
        "map_embed_url": prop.map_embed_url,
        "video_tour_url": prop.video_tour_url,
        "virtual_tour_url": "",
        "video_thumbnail_url": prop.video_thumbnail_url,
        "updated_at": prop.updated_at.isoformat() if prop.updated_at else "",
        "stats": stats,
        "overview_lines": overview_lines,
        "images": images,
        "features": features,
        "details": details,
        "nearbyLocations": nearby,
        "floorplans": [],
        "geolocation": None,
        "agents": [],
        "agent": None,
        # VaultRE-compat keys
        "heading": prop.title,
        "displayAddress": prop.address,
        "displayPrice": _price_label(prop),
        "bed": prop.bedrooms,
        "bath": prop.bathrooms,
        "garages": prop.garages,
        "landArea": None,
        "floorArea": {"value": str(prop.area_sqft), "units": "sqft"} if prop.area_sqft else None,
        "photos": [],
        "class": prop.category,
        "type": prop.category,
        "portalStatus": prop.status,
        "sourceEndpoint": "local",
        "listingCategory": prop.listing_category,
        "source": "local",
    }


class PropertyListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            category = request.query_params.get("category")

            # VaultRE listings from JSON cache
            vault_items = vaultre.get_listings(category=category)
            vault_listings = [vaultre.normalise_list(p) for p in vault_items]

            # Local DB listings
            from .models import Property
            local_qs = Property.objects.select_related("card_image").all()
            if category:
                local_qs = local_qs.filter(listing_category=category)
            local_listings = [normalise_local_list(p) for p in local_qs]

            return Response(vault_listings + local_listings)
        except Exception as exc:
            return Response({"error": str(exc)}, status=http_status.HTTP_502_BAD_GATEWAY)


class PropertyDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        # Try VaultRE cache first (VaultRE slugs are numeric IDs)
        try:
            p = vaultre.get_listing(slug)
            return Response(vaultre.normalise_detail(p))
        except ValueError:
            pass  # not found in VaultRE, try local DB
        except Exception as exc:
            return Response({"error": str(exc)}, status=http_status.HTTP_502_BAD_GATEWAY)

        # Fall back to local DB property by slug
        try:
            from .models import Property
            prop = Property.objects.select_related("card_image").prefetch_related(
                "images__image", "features", "detail_rows", "nearby_locations"
            ).get(slug=slug)
            return Response(normalise_local_detail(prop))
        except Property.DoesNotExist:
            return Response({"error": "Not found"}, status=http_status.HTTP_404_NOT_FOUND)
