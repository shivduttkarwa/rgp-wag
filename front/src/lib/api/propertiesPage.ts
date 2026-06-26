import type { Property, Category } from "@/components/reusable/PropertyCard";
import type { PropertiesPageData } from "@/types/propertiesPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

type RawProperty = {
  id: number | string;
  slug?: string | null;
  category?: string | null;
  title?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  price?: number | string | null;
  soldPrice?: number | string | null;
  image?: string | null;
  beds?: number | string | null;
  baths?: number | string | null;
  sqft?: number | string | null;
  garage?: number | string | null;
  features?: string[] | null;
  badge?: string | null;
  isNew?: boolean | null;
  views?: number | string | null;
  soldDate?: string | null;
  daysOnMarket?: number | string | null;
  deposit?: number | string | null;
  minLease?: string | null;
  type?: string | null;
};

const isCategory = (value: string): value is Category =>
  value === "for-sale" || value === "sold" || value === "for-rent";

const toNumber = (value: number | string | null | undefined): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const resolveUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) return `${API_BASE}${url}`;
  return url;
};

const mapRawListing = (item: RawProperty): Property => {
  const city = (item.city ?? "").trim();
  const state = (item.state ?? "").trim();
  const location = [city, state].filter(Boolean).join(", ") || (item.address ?? "").trim() || "QLD";
  const rawCategory = (item.category ?? "").trim();
  const category: Category = isCategory(rawCategory) ? rawCategory : "for-sale";

  return {
    id: toNumber(item.id),
    slug: (item.slug ?? "").trim(),
    category,
    title: (item.title ?? "").trim() || "Property",
    location,
    price: toNumber(item.price),
    soldPrice: item.soldPrice == null ? undefined : toNumber(item.soldPrice),
    image: resolveUrl(item.image),
    beds: toNumber(item.beds),
    baths: toNumber(item.baths),
    sqft: toNumber(item.sqft),
    garage: toNumber(item.garage),
    features: Array.isArray(item.features) ? item.features : [],
    badge: (item.badge ?? "").trim() || undefined,
    isNew: Boolean(item.isNew),
    views: item.views == null ? undefined : toNumber(item.views),
    soldDate: (item.soldDate ?? "").trim() || undefined,
    daysOnMarket: item.daysOnMarket == null ? undefined : toNumber(item.daysOnMarket),
    deposit: item.deposit == null ? undefined : toNumber(item.deposit),
    minLease: (item.minLease ?? "").trim() || undefined,
    type: (item.type ?? "").trim() || undefined,
  };
};

const mapListings = (items: unknown): Property[] => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => mapRawListing(item as RawProperty))
    .filter((item) => Boolean(item.slug));
};

export const DEFAULT_PROPERTIES_PAGE_DATA: PropertiesPageData = {
  id: 0,
  title: "Properties",
  slug: "properties",
  updated_at: null,
  sections: {},
  listings: [],
};

export async function fetchPropertyList(signal?: AbortSignal): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/api/properties/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Property list fetch failed: ${res.status}`);
  const items = await res.json();
  return mapListings(items);
}

export async function fetchPropertiesPage(signal?: AbortSignal): Promise<PropertiesPageData> {
  const res = await fetch(`${API_BASE}/api/pages/properties/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Properties page fetch failed: ${res.status}`);

  const payload = (await res.json()) as { sections?: unknown; listings?: unknown } & Partial<PropertiesPageData>;

  return {
    id: payload.id ?? 0,
    title: payload.title ?? "Properties",
    slug: payload.slug ?? "properties",
    updated_at: payload.updated_at ?? null,
    sections: (payload.sections ?? {}) as PropertiesPageData["sections"],
    listings: mapListings(payload.listings),
  };
}
