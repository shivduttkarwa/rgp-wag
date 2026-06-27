import type { PropertyData } from "@/components/reusable/PropDetails";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

type PropertyDetailApi = {
  slug: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price: number | string;
  price_label?: string;
  status: "For Sale" | "For Rent" | "Sold" | "Pending";
  featured?: boolean;
  images: Array<{ url: string; alt: string }>;
  stats: Array<{ icon: "bed" | "bath" | "area" | "garage" | "year" | "lot"; value: string; label: string }>;
  overview_lines: string[];
  features: Array<{ icon: string; title: string; description: string }>;
  details: Array<{ label: string; value: string }>;
  map_embed_url?: string;
  nearbyLocations: Array<{
    name: string;
    distance: string;
    type: "shopping" | "airport" | "dining" | "golf" | "beach" | "school" | "hospital";
  }>;
  video_tour_url?: string;
  virtual_tour_url?: string;
  video_thumbnail_url?: string;
  floorplans?: Array<{ url: string; alt: string }>;
  agent?: {
    name: string;
    title: string;
    photo_url: string;
    phone: string;
    email: string;
    rating: number | string;
    review_count: number;
  };
};

const FEATURE_ICONS = new Set([
  "smart-home",
  "kitchen",
  "ocean",
  "wine",
  "pool",
  "dock",
  "theater",
  "gym",
  "security",
  "garden",
  "spa",
  "garage",
]);

function resolveUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) return `${API_BASE}${url}`;
  return url;
}

function normalizeFeatureIcon(icon: string): PropertyData["features"][number]["icon"] {
  if (FEATURE_ICONS.has(icon)) return icon as PropertyData["features"][number]["icon"];
  return "smart-home";
}

// ─── Shared detail cache (populated by PropertyPage + prefetcher) ─────────────

export const detailCache = new Map<string, PropertyData>();

const _inFlight = new Set<string>();

export function prefetchPropertyDetails(slugs: string[]): void {
  const CONCURRENCY = 4;
  const queue = slugs.filter((s) => s && !detailCache.has(s) && !_inFlight.has(s));
  if (!queue.length) return;

  let active = 0;
  let idx = 0;

  function next() {
    while (active < CONCURRENCY && idx < queue.length) {
      const slug = queue[idx++];
      active++;
      _inFlight.add(slug);
      fetchPropertyDetail(slug)
        .then((data) => { detailCache.set(slug, data); })
        .catch(() => {})
        .finally(() => { _inFlight.delete(slug); active--; next(); });
    }
  }

  // Yield to the browser first so the listing render isn't blocked
  setTimeout(next, 300);
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchPropertyDetail(slug: string, signal?: AbortSignal): Promise<PropertyData> {
  const res = await fetch(`${API_BASE}/api/properties/${slug}/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Property detail fetch failed: ${res.status}`);
  const data = (await res.json()) as PropertyDetailApi;

  return {
    id: data.slug,
    title: data.title,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    price: Number(data.price || 0),
    priceLabel: data.price_label,
    status: data.status,
    featured: Boolean(data.featured),
    images: (data.images || []).map((img) => ({
      url: resolveUrl(img.url),
      alt: img.alt || data.title,
    })),
    stats: data.stats || [],
    overview: data.overview_lines || [],
    features: (data.features || []).map((feature) => ({
      icon: normalizeFeatureIcon(feature.icon),
      title: feature.title,
      description: feature.description || "",
    })),
    details: data.details || [],
    mapEmbedUrl: data.map_embed_url || "",
    nearbyLocations: data.nearbyLocations || [],
    videoTourUrl: data.video_tour_url || "",
    virtualTourUrl: data.virtual_tour_url || "",
    videoThumbnail: resolveUrl(data.video_thumbnail_url || ""),
    floorplans: (data.floorplans || []).map((fp) => ({ url: resolveUrl(fp.url), alt: fp.alt || "Floorplan" })),
    agent: {
      name: data.agent?.name || "",
      title: data.agent?.title || "",
      image: resolveUrl(data.agent?.photo_url || ""),
      phone: data.agent?.phone || "",
      email: data.agent?.email || "",
      rating: Number(data.agent?.rating || 0),
      reviewCount: data.agent?.review_count || 0,
    },
  };
}
