import json
import logging
import threading
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from django.conf import settings

logger = logging.getLogger("apps.properties.vaultre")

BASE_URL = "https://ap-southeast-2.api.vaultre.com.au/api/v1.3"
_MAX_WORKERS = 5

# JSON file written by `python manage.py sync_properties` (cron, hourly)
CACHE_FILE = Path(__file__).resolve().parent.parent.parent / "cache" / "properties.json"

# In-process cache for hot API requests. The file mtime invalidates it after
# sync_properties writes a fresh cache file.
_cache_lock = threading.RLock()
_mem_cache: list[dict] | None = None
_mem_cache_mtime: float | None = None


def _headers() -> dict:
    return {
        "X-Api-Key": settings.VAULTRE_API_KEY,
        "Authorization": f"Bearer {settings.VAULTRE_ACCESS_TOKEN}",
        "Accept": "application/json",
    }


# (path, prop_class, listing_category)
# 5 endpoints = 5 × 24 = 120 calls/day, well inside the 200/day VaultRE limit.
# /available and /sold sub-endpoints are removed — duplicates are filtered by
# portalStatus in _fetch_endpoint, so a single base endpoint per type is enough.
LISTING_ENDPOINTS = [
    ("residential/sale",  "residential", "for-sale"),
    ("residential/lease", "residential", "for-rent"),
    ("commercial/sale",   "commercial",  "for-sale"),
    ("commercial/lease",  "commercial",  "for-rent"),
    ("land/sale",         "land",        "for-sale"),
]


# ─── HTTP helper ─────────────────────────────────────────────────────────────

def _get_page(url: str, params: dict | None = None) -> dict:
    resp = requests.get(url, headers=_headers(), params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()


def _fetch_endpoint(path: str, prop_class: str, listing_category: str) -> list[dict]:
    """Fetch every page of one endpoint, walk urls.next, tag each item."""
    url: str | None = f"{BASE_URL}/properties/{path}"
    params: dict | None = {"published": "true"}
    items: list[dict] = []
    first_page = True

    while url:
        try:
            data = _get_page(url, params if first_page else None)
            first_page = False

            total = data.get("totalItems", 0)
            page_items = data.get("items", [])
            next_url: str | None = (data.get("urls") or {}).get("next") or None

            logger.info(
                "[VaultRE] %-45s  status=200  totalItems=%-5s  fetched=%-3s  next=%s",
                path, total, len(page_items), next_url or "-",
            )

            if not page_items:
                break

            for item in page_items:
                item["_class"] = prop_class
                item["_sourceEndpoint"] = path
                # Use portalStatus to determine true category — an "unconditional"
                # or "settled" property is sold regardless of which endpoint returned it.
                portal = (item.get("portalStatus") or "").lower()
                if portal in {"unconditional", "settled"}:
                    item["_category"] = "sold"
                elif portal in {"leased"}:
                    item["_category"] = "for-rent"
                else:
                    item["_category"] = listing_category

            items.extend(page_items)
            url = next_url

        except requests.HTTPError as exc:
            code = exc.response.status_code if exc.response is not None else "?"
            logger.warning("[VaultRE] %-45s  HTTP %s — skipped", path, code)
            break
        except Exception as exc:
            logger.warning("[VaultRE] %-45s  error: %s — skipped", path, exc)
            break

    return items


def _fetch_all_listings() -> list[dict]:
    """Fetch all endpoints in parallel, deduplicate by id, log a summary table."""
    logger.info("[VaultRE] ══ Starting parallel fetch (%d endpoints, %d workers) ══", len(LISTING_ENDPOINTS), _MAX_WORKERS)

    # Fan out — all endpoints fetched concurrently
    with ThreadPoolExecutor(max_workers=_MAX_WORKERS) as pool:
        futures = {
            pool.submit(_fetch_endpoint, path, prop_class, listing_category): (path, prop_class, listing_category)
            for path, prop_class, listing_category in LISTING_ENDPOINTS
        }
        raw_by_endpoint: dict = {}
        for future in as_completed(futures):
            key = futures[future]
            try:
                raw_by_endpoint[key] = future.result()
            except Exception as exc:
                logger.warning("[VaultRE] %s unhandled error: %s — skipped", key[0], exc)
                raw_by_endpoint[key] = []

    # Merge in original order so deduplication is deterministic
    seen: set = set()
    results: list[dict] = []
    summary: dict = defaultdict(lambda: defaultdict(int))

    for endpoint in LISTING_ENDPOINTS:
        raw = raw_by_endpoint.get(endpoint, [])
        added = 0
        for item in raw:
            pid = item.get("id")
            if pid not in seen:
                seen.add(pid)
                results.append(item)
                summary[endpoint[1]][endpoint[2]] += 1
                added += 1
        dupes = len(raw) - added
        if dupes:
            logger.info("[VaultRE] %-45s  %d duplicate(s) dropped", endpoint[0], dupes)

    total = sum(c for cats in summary.values() for c in cats.values())
    logger.info("[VaultRE] ══ Fetch complete — %d unique properties ══", total)
    for cls in sorted(summary):
        for cat, count in sorted(summary[cls].items()):
            logger.info("[VaultRE]   %-20s  %-12s  %d", cls, cat, count)

    return results


# ─── Staff sync (piggybacks on already-fetched listings) ─────────────────────

def sync_staff_from_listings(listings: list[dict]) -> None:
    """
    Extract unique contactStaff objects from fetched listings and upsert them
    into the TeamMember table.  Only VaultRE-owned fields are written; bio,
    tags, stats and order are left untouched so the CMS can manage them.
    """
    try:
        from apps.team.models import TeamMember
    except Exception as exc:
        logger.warning("[VaultRE] Staff sync — cannot import TeamMember: %s", exc)
        return

    seen: dict[int, dict] = {}
    for listing in listings:
        for staff in listing.get("contactStaff") or []:
            sid = staff.get("id")
            if not sid or sid in seen:
                continue
            # Skip system/non-login accounts (e.g. "Real Gold Management")
            permissions = staff.get("permissions") or {}
            if permissions.get("canLogin") is False:
                continue
            username = staff.get("username") or ""
            if username.upper().startswith("NOLOGIN-"):
                continue
            seen[sid] = staff

    if not seen:
        logger.info("[VaultRE] Staff sync — no staff found in listings")
        return

    upserted = 0
    for sid, staff in seen.items():
        slug = f"vaultre-{sid}"
        name = f"{staff.get('firstName', '')} {staff.get('lastName', '')}".strip()
        phone_numbers = staff.get("phoneNumbers") or []
        phone = phone_numbers[0].get("number", "") if phone_numbers else ""
        photo = (staff.get("photo") or {}).get("original", "") or ""

        TeamMember.objects.update_or_create(
            slug=slug,
            defaults={
                "name": name,
                "role": (staff.get("position") or "").strip() or "Property Specialist",
                "email": staff.get("email") or "",
                "phone": phone,
                "portrait_image_url": photo,
                "is_active": staff.get("showOnWeb", True),
            },
        )
        upserted += 1

    logger.info("[VaultRE] Staff sync — %d staff upserted", upserted)


# ─── File cache (written by `sync_properties` management command) ─────────────

def _load_cache() -> list[dict]:
    """Read cached properties, falling back to a live fetch only if needed."""
    global _mem_cache, _mem_cache_mtime

    if CACHE_FILE.exists():
        try:
            mtime = CACHE_FILE.stat().st_mtime
            with _cache_lock:
                if _mem_cache is not None and _mem_cache_mtime == mtime:
                    return _mem_cache

            data = json.loads(CACHE_FILE.read_text(encoding="utf-8")).get("items", [])
            if not isinstance(data, list):
                raise ValueError("cache payload missing items list")

            with _cache_lock:
                _mem_cache = data
                _mem_cache_mtime = mtime
            return data
        except Exception as exc:
            logger.warning("[VaultRE] Cache file unreadable (%s)", exc)
            with _cache_lock:
                if _mem_cache is not None:
                    logger.warning("[VaultRE] Using in-memory cache while file cache is unavailable")
                    return _mem_cache
    else:
        logger.warning("[VaultRE] No cache file found (run sync_properties)")

    with _cache_lock:
        if _mem_cache is not None:
            return _mem_cache

    logger.error("[VaultRE] Cache unavailable — returning no listings without calling VaultRE")
    return []


def save_cache(data: list[dict]) -> None:
    """Persist fetched listings to CACHE_FILE. Called by sync_properties command."""
    global _mem_cache, _mem_cache_mtime

    CACHE_FILE.parent.mkdir(parents=True, exist_ok=True)
    tmp_file = CACHE_FILE.with_name(f"{CACHE_FILE.name}.{time.time_ns()}.tmp")
    tmp_file.write_text(json.dumps({"updated_at": time.time(), "items": data}), encoding="utf-8")
    tmp_file.replace(CACHE_FILE)

    with _cache_lock:
        _mem_cache = data
        _mem_cache_mtime = CACHE_FILE.stat().st_mtime

    logger.info("[VaultRE] Saved %d properties to %s", len(data), CACHE_FILE)


# ─── Public API ──────────────────────────────────────────────────────────────

def get_listings(category: str | None = None) -> list[dict]:
    data = _load_cache()
    return [i for i in data if i.get("_category") == category] if category else data


def get_listing(vault_id: str) -> dict:
    for item in get_listings():
        if str(item.get("id")) == str(vault_id):
            return item
    raise ValueError(f"Property {vault_id} not found")


def post_enquiry(payload: dict) -> None:
    """POST a lead enquiry to VaultRE. Fires in a background thread; failures are logged, never raised."""
    if not settings.VAULTRE_API_KEY or not settings.VAULTRE_ACCESS_TOKEN:
        logger.debug("[VaultRE] Skipping enquiry post — credentials not configured")
        return

    # Strip keys with empty-string values so VaultRE doesn't receive noise
    clean_payload = {k: v for k, v in payload.items() if v != ""}

    def _send():
        try:
            resp = requests.post(
                f"{BASE_URL}/enquiries",
                headers={**_headers(), "Content-Type": "application/json"},
                json=clean_payload,
                timeout=10,
            )
            resp.raise_for_status()
            logger.info("[VaultRE] Enquiry submitted — status=%s originalId=%s", resp.status_code, clean_payload.get("originalId"))
        except Exception as exc:
            logger.warning("[VaultRE] Enquiry submission failed: %s", exc)

    threading.Thread(target=_send, daemon=True).start()


# ─── Normalisation helpers ────────────────────────────────────────────────────

def _first_photo(p: dict) -> dict | None:
    photos = [ph for ph in p.get("photos", []) if ph.get("published") and ph.get("type") == "Photograph"]
    return photos[0] if photos else None


def _first_agent(p: dict) -> dict | None:
    agents = [a for a in p.get("contactStaff", []) if a.get("showOnWeb")]
    return agents[0] if agents else None


def _agent_shape(a: dict | None) -> dict | None:
    if not a:
        return None
    phone = a["phoneNumbers"][0]["number"] if a.get("phoneNumbers") else ""
    return {
        "name": f'{a.get("firstName", "")} {a.get("lastName", "")}'.strip(),
        "title": a.get("position", ""),
        "photo_url": (a.get("photo") or {}).get("thumb_360", ""),
        "phone": phone,
        "email": a.get("email", ""),
        "rating": 5.0,
        "review_count": 0,
    }


def _type_name(p: dict) -> str:
    t = p.get("type")
    if isinstance(t, dict):
        return t.get("name", "")
    return str(t) if t else ""


def _class_name(p: dict) -> str:
    """Return the property class internalName, preferring the raw VaultRE field."""
    raw = p.get("class")
    if isinstance(raw, dict):
        return raw.get("internalName", "") or raw.get("name", "")
    return p.get("_class", "")


def _area_obj(raw: dict | None) -> dict | None:
    if not raw or not raw.get("value"):
        return None
    return {"value": raw["value"], "units": raw.get("units", "sqm")}


def _display_status(p: dict) -> str:
    cat = p.get("_category", "")
    if cat == "for-rent":
        return "For Rent"
    if cat == "sold":
        return "Sold"
    portal = (p.get("portalStatus") or "").lower()
    if "conditional" in portal:
        return "Pending"
    return "For Sale"


def _total_parking(p: dict) -> int:
    return (p.get("garages") or 0) + (p.get("carports") or 0) + (p.get("openSpaces") or 0)


def _make_stats(p: dict, floor_area: dict, land_area: dict) -> list[dict]:
    parking = _total_parking(p)
    entries = [
        ("bed",    str(p.get("bed")) if p.get("bed") else None,       "Bedrooms"),
        ("bath",   str(p.get("bath")) if p.get("bath") else None,     "Bathrooms"),
        ("area",   f'{int(floor_area["value"])} sqm' if floor_area.get("value") else None, "Floor Area"),
        ("garage", str(parking) if parking else None,                  "Garages"),
        ("year",   str(p.get("yearBuilt")) if p.get("yearBuilt") else None, "Year Built"),
        ("lot",    f'{int(land_area["value"])} sqm' if land_area.get("value") else None,  "Land Area"),
    ]
    return [{"icon": icon, "value": value, "label": label} for icon, value, label in entries if value]


def _map_embed_url(p: dict) -> str:
    geo = p.get("geolocation") or {}
    lat, lng = geo.get("latitude"), geo.get("longitude")
    if lat and lng:
        return f"https://www.google.com/maps?q={lat},{lng}&output=embed"
    return ""


_FEATURE_ICON_MAP = {
    "pool": "pool", "swimming pool": "pool",
    "spa": "spa", "hot tub": "spa", "jacuzzi": "spa",
    "gym": "gym", "fitness": "gym", "exercise room": "gym",
    "theater": "theater", "theatre": "theater", "cinema": "theater", "home theatre": "theater", "home theater": "theater",
    "wine": "wine", "wine cellar": "wine", "wine room": "wine",
    "security": "security", "alarm": "security", "cctv": "security", "security system": "security",
    "garden": "garden", "landscaped": "garden", "outdoor": "garden",
    "dock": "dock", "pontoon": "dock", "jetty": "dock",
    "ocean": "ocean", "water views": "ocean", "sea views": "ocean", "ocean views": "ocean", "waterfront": "ocean",
    "kitchen": "kitchen", "dishwasher": "kitchen", "gourmet kitchen": "kitchen",
    "garage": "garage", "carport": "garage", "parking": "garage",
    "smart home": "smart-home", "air conditioning": "smart-home", "ducted air": "smart-home",
    "solar": "smart-home", "automation": "smart-home",
}


def _feature_icon(name: str) -> str:
    key = name.lower().strip()
    if key in _FEATURE_ICON_MAP:
        return _FEATURE_ICON_MAP[key]
    for phrase, icon in _FEATURE_ICON_MAP.items():
        if phrase in key:
            return icon
    return "smart-home"


def _parse_features(p: dict) -> list[dict]:
    raw = p.get("features") or []
    result = []
    for item in raw:
        if isinstance(item, str):
            name = item.strip()
        elif isinstance(item, dict):
            name = (item.get("name") or item.get("title") or "").strip()
        else:
            continue
        if name:
            result.append({"icon": _feature_icon(name), "title": name, "description": ""})
    return result


def _parse_overview_lines(p: dict) -> list[str]:
    text = (p.get("description") or "").strip()
    if not text:
        return []
    return [line.strip() for line in text.splitlines() if line.strip()]


def _parse_external_links(p: dict) -> tuple[str, str]:
    """Return (video_url, virtual_tour_url) from externalLinks. First match wins per type."""
    video_url = ""
    virtual_tour_url = ""
    for link in p.get("externalLinks") or []:
        type_name = (link.get("type") or {}).get("name", "").lower()
        url = link.get("url", "")
        if not url:
            continue
        if type_name == "video" and not video_url:
            video_url = url
        elif type_name == "virtual tour" and not virtual_tour_url:
            virtual_tour_url = url
    return video_url, virtual_tour_url


def _pub_photos(p: dict) -> list[dict]:
    return [
        {
            "url": ph.get("url", ""),
            "type": ph.get("type", ""),
            "caption": ph.get("caption", ""),
            "thumb": (ph.get("thumbnails") or {}).get("thumb_1024", ""),
        }
        for ph in p.get("photos", [])
        if ph.get("published")
    ]


# ─── List normaliser (used by PropertyListAPIView) ───────────────────────────

def normalise_list(p: dict) -> dict:
    first_photo = _first_photo(p)
    thumb = first_photo["thumbnails"]["thumb_1024"] if first_photo and first_photo.get("thumbnails") else ""
    suburb = (p.get("address") or {}).get("suburb", {})
    state = (suburb.get("state") or {}).get("abbreviation", "QLD")

    return {
        # ── Frontend-compatible fields (existing shape, unchanged keys) ────
        "id": p["id"],
        "slug": str(p["id"]),
        "title": p.get("heading", ""),
        "address": p.get("displayAddress", ""),
        "city": suburb.get("name", ""),
        "state": state,
        "location": ", ".join(filter(None, [suburb.get("name", ""), state])) or p.get("displayAddress", ""),
        "price": p.get("searchPrice"),
        "price_label": p.get("displayPrice", ""),
        "status": _display_status(p),
        "category": p.get("_category", "for-sale"),
        "image": thumb,
        "thumbnail": thumb or None,
        "beds": p.get("bed", 0),
        "baths": p.get("bath", 0),
        "sqft": int((p.get("floorArea") or p.get("landArea") or {}).get("value") or 0),
        "garage": (p.get("garages") or 0) + (p.get("carports") or 0) + (p.get("openSpaces") or 0),
        "badge": "House & Land" if p.get("isHouseLandPackage") else "",
        "isNew": False,
        "featured": False,
        "views": None,
        "soldDate": "",
        "soldPrice": None,
        "daysOnMarket": None,
        "deposit": None,
        "minLease": "",
        "features": [],
        "agent": _agent_shape(_first_agent(p)),
        # ── VaultRE raw / metadata fields (new) ──────────────────────────
        "heading": p.get("heading", ""),
        "displayAddress": p.get("displayAddress", ""),
        "displayPrice": p.get("displayPrice", ""),
        "bed": p.get("bed", 0),
        "bath": p.get("bath", 0),
        "garages": (p.get("garages") or 0) + (p.get("carports") or 0) + (p.get("openSpaces") or 0),
        "landArea": _area_obj(p.get("landArea")),
        "floorArea": _area_obj(p.get("floorArea")),
        "photos": _pub_photos(p),
        "class": _class_name(p),
        "type": _type_name(p),
        "portalStatus": p.get("portalStatus", ""),
        "sourceEndpoint": p.get("_sourceEndpoint", ""),
        "listingCategory": p.get("_category", ""),
    }


# ─── Detail normaliser (used by PropertyDetailAPIView) ───────────────────────

def normalise_detail(p: dict) -> dict:
    all_pub = [ph for ph in p.get("photos", []) if ph.get("published")]
    photographs = [ph for ph in all_pub if ph.get("type") == "Photograph"]
    floorplans = [ph for ph in all_pub if ph.get("type") == "Floorplan"]

    suburb = (p.get("address") or {}).get("suburb", {})
    state = (suburb.get("state") or {}).get("abbreviation", "QLD")
    floor_area = p.get("floorArea") or {}
    land_area = p.get("landArea") or {}

    agents = [a for a in p.get("contactStaff", []) if a.get("showOnWeb")]
    video_url, virtual_tour_url = _parse_external_links(p)

    return {
        # ── Frontend-compatible fields ────────────────────────────────────
        "slug": str(p["id"]),
        "title": p.get("heading", ""),
        "address": p.get("displayAddress", ""),
        "city": suburb.get("name", ""),
        "state": state,
        "zip_code": suburb.get("postcode", ""),
        "price": p.get("searchPrice"),
        "price_label": p.get("displayPrice", ""),
        "status": _display_status(p),
        "featured": False,
        "category": p.get("_category", "for-sale"),
        "description": p.get("description", ""),
        "map_embed_url": _map_embed_url(p),
        "video_tour_url": video_url,
        "virtual_tour_url": virtual_tour_url,
        "video_thumbnail_url": "",
        "updated_at": p.get("modified", ""),
        "stats": _make_stats(p, floor_area, land_area),
        "overview_lines": _parse_overview_lines(p),
        "images": [{"url": ph.get("url", ""), "alt": ph.get("caption", "")} for ph in photographs],
        "features": _parse_features(p),
        "details": [
            {"label": "Type",           "value": _type_name(p)},
            {"label": "Land Area",      "value": f'{int(land_area["value"])} {land_area.get("units", "sqm")}' if land_area.get("value") else ""},
            {"label": "Floor Area",     "value": f'{int(floor_area["value"])} {floor_area.get("units", "sqm")}' if floor_area.get("value") else ""},
            {"label": "Garages",        "value": str(_total_parking(p)) if _total_parking(p) else ""},
            {"label": "Method of Sale", "value": (p.get("methodOfSale") or {}).get("name", "")},
        ],
        "nearbyLocations": [],
        "floorplans": [{"url": fp.get("url", ""), "alt": fp.get("caption", "")} for fp in floorplans],
        "geolocation": p.get("geolocation"),
        "agents": [_agent_shape(a) for a in agents],
        "agent": _agent_shape(_first_agent(p)),
        # ── VaultRE raw / metadata fields (new) ──────────────────────────
        "heading": p.get("heading", ""),
        "displayAddress": p.get("displayAddress", ""),
        "displayPrice": p.get("displayPrice", ""),
        "bed": p.get("bed", 0),
        "bath": p.get("bath", 0),
        "garages": (p.get("garages") or 0) + (p.get("carports") or 0) + (p.get("openSpaces") or 0),
        "landArea": _area_obj(p.get("landArea")),
        "floorArea": _area_obj(p.get("floorArea")),
        "photos": _pub_photos(p),
        "class": _class_name(p),
        "type": _type_name(p),
        "portalStatus": p.get("portalStatus", ""),
        "sourceEndpoint": p.get("_sourceEndpoint", ""),
        "listingCategory": p.get("_category", ""),
    }
