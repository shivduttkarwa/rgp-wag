import logging
import threading
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from django.conf import settings

logger = logging.getLogger("apps.properties.vaultre")

BASE_URL = "https://ap-southeast-2.api.vaultre.com.au/api/v1.3"
CACHE_TTL = 300        # 5 minutes
_REFRESH_INTERVAL = 240  # refresh every 4 min so cache never expires
_MAX_WORKERS = 8         # concurrent VaultRE endpoint fetches

# Per-page response cache:  (url, frozen-params) → (timestamp, data)
_page_cache: dict = {}

# Merged all-listings cache: "all" → (timestamp, [items])
_listings_cache: dict = {}

# Background refresh guard
_refresh_lock = threading.Lock()
_refresh_started = False


def _headers() -> dict:
    return {
        "X-Api-Key": settings.VAULTRE_API_KEY,
        "Authorization": f"Bearer {settings.VAULTRE_ACCESS_TOKEN}",
        "Accept": "application/json",
    }


# (path, prop_class, listing_category)
LISTING_ENDPOINTS = [
    # ── Residential ───────────────────────────────────────────────────────────
    ("residential/sale",              "residential",    "for-sale"),
    ("residential/sale/available",    "residential",    "for-sale"),
    ("residential/sale/sold",         "residential",    "sold"),
    ("residential/lease",             "residential",    "for-rent"),
    ("residential/lease/available",   "residential",    "for-rent"),
    # ── Commercial ────────────────────────────────────────────────────────────
    ("commercial/sale",               "commercial",     "for-sale"),
    ("commercial/sale/available",     "commercial",     "for-sale"),
    ("commercial/sale/sold",          "commercial",     "sold"),
    ("commercial/lease",              "commercial",     "for-rent"),
    ("commercial/lease/available",    "commercial",     "for-rent"),
    ("commercial/lease/leased",       "commercial",     "for-rent"),
    # ── Land ──────────────────────────────────────────────────────────────────
    ("land/sale",                     "land",           "for-sale"),
    ("land/sale/available",           "land",           "for-sale"),
    ("land/sale/sold",                "land",           "sold"),
    # ── Business ──────────────────────────────────────────────────────────────
    ("business/sale",                 "business",       "for-sale"),
    ("business/sale/available",       "business",       "for-sale"),
    ("business/sale/sold",            "business",       "sold"),
    # ── Rural ─────────────────────────────────────────────────────────────────
    ("rural/sale",                    "rural",          "for-sale"),
    ("rural/sale/available",          "rural",          "for-sale"),
    ("rural/sale/sold",               "rural",          "sold"),
    # ── Holiday Rental ────────────────────────────────────────────────────────
    ("holidayRental/lease",           "holidayRental",  "for-rent"),
    ("holidayRental/lease/available", "holidayRental",  "for-rent"),
]


# ─── HTTP / Cache helpers ─────────────────────────────────────────────────────

def _get_page(url: str, params: dict | None = None) -> dict:
    """Fetch one API page; cache the raw response for CACHE_TTL seconds."""
    cache_key = (url, tuple(sorted((params or {}).items())))
    now = time.time()
    if cache_key in _page_cache and now - _page_cache[cache_key][0] < CACHE_TTL:
        return _page_cache[cache_key][1]
    resp = requests.get(url, headers=_headers(), params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    _page_cache[cache_key] = (now, data)
    return data


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


# ─── Public API ──────────────────────────────────────────────────────────────

def get_listings(category: str | None = None) -> list[dict]:
    """Return all listings (optionally filtered by category). 5-min in-process cache."""
    now = time.time()
    cached = _listings_cache.get("all")
    if cached and now - cached[0] < CACHE_TTL:
        data = cached[1]
    else:
        data = _fetch_all_listings()
        _listings_cache["all"] = (now, data)

    return [i for i in data if i.get("_category") == category] if category else data


def get_listing(vault_id: str) -> dict:
    for item in get_listings():
        if str(item.get("id")) == str(vault_id):
            return item
    raise ValueError(f"Property {vault_id} not found")


def _refresh_loop() -> None:
    """Runs forever in a daemon thread, keeping the cache warm."""
    while True:
        time.sleep(_REFRESH_INTERVAL)
        try:
            logger.info("[VaultRE] Scheduled refresh starting …")
            data = _fetch_all_listings()
            _listings_cache["all"] = (time.time(), data)
            logger.info("[VaultRE] Scheduled refresh done — %d properties cached.", len(data))
        except Exception as exc:
            logger.warning("[VaultRE] Scheduled refresh failed: %s", exc)


def start_background_refresh() -> None:
    """Warm the cache immediately on startup, then keep it fresh every 4 min.

    Called once from PropertiesConfig.ready(). The _refresh_started guard
    prevents a double-start when Django's dev-server reloader forks the process.
    """
    global _refresh_started
    with _refresh_lock:
        if _refresh_started:
            return
        _refresh_started = True

    def _warmup_then_loop() -> None:
        try:
            logger.info("[VaultRE] Cache warmup starting …")
            data = _fetch_all_listings()
            _listings_cache["all"] = (time.time(), data)
            logger.info("[VaultRE] Cache warmup done — %d properties ready.", len(data))
        except Exception as exc:
            logger.warning("[VaultRE] Cache warmup failed: %s", exc)
        _refresh_loop()

    t = threading.Thread(target=_warmup_then_loop, daemon=True, name="vaultre-refresh")
    t.start()
    logger.info("[VaultRE] Background refresh thread started.")


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
        "sqft": int(p["floorArea"]["value"]) if p.get("floorArea") else 0,
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
        "video_tour_url": "",
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
