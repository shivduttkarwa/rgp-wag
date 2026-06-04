import type { ServicesPageData } from "@/types/servicesPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_SERVICES_PAGE_DATA: ServicesPageData = {
  id: 0, title: "Services", slug: "services", updated_at: null,
  hero: {
    title_line_1: "Services For [gold]Buyers[/gold]",
    title_line_2: "Sellers & [amber]Renters[/amber]",
    subtitle: "We handle the full journey — buying, selling, and leasing across South-East Queensland.",
    background_image: null, background_image_url: "images/hero1.jpg",
    show_video: false, background_video_url: "", mode: "none", buttons: [], stats: [],
  },
  intro: { statement: "A full-service partner for buying, selling, and renting — one team, three core services, zero guesswork." },
  buy: {
    heading: "Buy With Confidence From Day One",
    p1: "We narrow the field quickly, secure the right property at the right price, and guide you through every step of the purchase process.",
    p2: "From off-market access to finance coordination and settlement support — you're never navigating alone.",
    image_url: "images/ps1 (6).jpg", cta_label: "Explore Our Homes", cta_href: "/properties",
  },
  cta: {
    eyebrow: "Ready to Move?", title: "Get a", title_em: "Tailored Plan",
    text: "Tell us your goal and timeline — we'll map out a strategy built around your situation.",
    primary: { label: "Book a Consultation", href: "/contact" },
    secondary: { label: "0450 009 291", href: "tel:+61450009291" },
    stats: [
      { value: "5+", label: "Years Experience" },
      { value: "100+", label: "Happy Clients" },
      { value: "24/7", label: "Support Available" },
    ],
  },
  sell: {
    heading: "Sell With Clear Strategy",
    text: "Pricing, positioning, staging, and marketing — all aligned to attract the right buyers and deliver a result you're confident in.",
    image_url: "images/ps1 (5).jpg", cta_label: "Request a Valuation", cta_href: "/contact",
  },
  rent: {
    heading: "Lease With Confidence",
    text: "Premium leasing, tenant screening, and ongoing property care — so your investment performs without the stress.",
    image_url: "images/ps1 (1).jpg", cta_label: "View Available Rentals", cta_href: "/properties",
  },
};

export async function fetchServicesPage(signal?: AbortSignal): Promise<ServicesPageData> {
  const res = await fetch(`${API_BASE}/api/pages/services/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Services page fetch failed: ${res.status}`);
  return res.json() as Promise<ServicesPageData>;
}
