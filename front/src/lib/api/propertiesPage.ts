import type { Property, Category } from "@/components/reusable/PropertyCard";
import { allProperties } from "@/data/listingProperties";
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
  hero: {
    title_line_1: "Our [gold]Premium[/gold]",
    title_line_2: "[amber]Properties[/amber]",
    subtitle:
      "Browse our curated portfolio of for-sale, sold and rental properties across South-East Queensland.",
    background_image: null,
    background_image_url: "images/prop-hero.jpg",
    show_video: false,
    background_video_url: "",
    mode: "buttons",
    buttons: [
      {
        label: "Talk to an Expert",
        href: "/contact",
        style: "gold",
        open_in_new_tab: false,
      },
    ],
    stats: [],
  },
  property_section: {
    eyebrow: "Browse Listings",
    heading: "Discover Your Next Property",
    subtitle:
      "Filter by sale, rent, or sold status and explore our complete listing portfolio in one place.",
  },
  marquee: {
    eyebrow: "Featured Portfolio",
    title: "Explore",
    title_em: "Premium Homes",
    subtitle:
      "A curated selection of standout residences from across our portfolio — updated regularly.",
    cta_label: "View All Properties",
  },
  property_cta: {
    eyebrow: "Need Help Choosing?",
    title: "Let's Find Your",
    title_em: "Perfect Home",
    text:
      "Tell us what you're looking for and we'll shortlist the best options, arrange inspections, and guide you through every step.",
    primary: {
      label: "Talk to an Expert",
      href: "/contact",
    },
    secondary: {
      label: "0450 009 291",
      href: "tel:+61450009291",
    },
    commitments: [
      { title: "Data-backed guidance" },
      { title: "Inspection-ready planning" },
      { title: "Negotiation that protects" },
    ],
    use_video: true,
    background_image: null,
    background_image_url: "images/int.jpg",
    background_video_url: "vids/cta-2-vid.mp4",
    video_poster_image: null,
    video_poster_image_url: "images/int.jpg",
    min_height: "100vh",
  },
  listings: allProperties,
};

export async function fetchPropertiesPage(signal?: AbortSignal): Promise<PropertiesPageData> {
  const res = await fetch(`${API_BASE}/api/pages/properties/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Properties page fetch failed: ${res.status}`);

  const payload = (await res.json()) as Partial<PropertiesPageData> & {
    listings?: unknown;
  };

  return {
    ...payload,
    hero: (payload.hero ?? DEFAULT_PROPERTIES_PAGE_DATA.hero) as PropertiesPageData["hero"],
    property_section:
      (payload.property_section ??
        DEFAULT_PROPERTIES_PAGE_DATA.property_section) as PropertiesPageData["property_section"],
    marquee: (payload.marquee ?? DEFAULT_PROPERTIES_PAGE_DATA.marquee) as PropertiesPageData["marquee"],
    property_cta:
      (payload.property_cta ??
        DEFAULT_PROPERTIES_PAGE_DATA.property_cta) as PropertiesPageData["property_cta"],
    listings: mapListings(payload.listings),
  } as PropertiesPageData;
}
