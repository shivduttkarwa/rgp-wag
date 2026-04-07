import type { HomePageData, HomePageSections } from "@/types/homePage";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

// ─── Defaults ────────────────────────────────────────────────────────────────
// Shown instantly while the API loads, and used as fallback if API is down.

export const DEFAULT_HOME_PAGE_SECTIONS: HomePageSections = {
  hero: {
    title_line_1: "Your [gold]Dream[/gold] Home",
    title_line_2: "[amber]Perfectly[/amber] Delivered",
    subtitle:
      "350+ premium properties delivered — luxury villas, penthouses & exclusive estates crafted for those who demand the extraordinary.",
    search_tabs: [
      { label: "Buy", icon: "buy", href: "/properties?cat=for-sale" },
      { label: "Rent", icon: "rent", href: "/properties?cat=for-rent" },
      { label: "Sold", icon: "sold", href: "/properties?cat=sold" },
      { label: "Agent", icon: "agent", href: "/team" },
    ],
    background_image: null,
    background_image_url: "images/hero-rpg-brisbane.jpg",
    background_video_url: "vids/hero-rgp.mp4",
    show_video: true,
  },
  intro: {
    label: "About the Founder",
    headline_line1: "Building Wealth",
    headline_line2: "Through Property,",
    founder_name: "— Rahul Singh",
    body: "Real Gold Properties is a vision turned reality — a private equity approach to multi-family real estate. Founded by Rahul Singh, we focus on disciplined acquisitions that deliver consistent returns.",
    primary_cta: { label: "Book a Free Appraisal", href: "/contact" },
    secondary_cta: { label: "Meet Rahul", href: "/about" },
    image: null,
    image_url: "images/rahul-singh.jpg",
  },
  property_listing: {
    eyebrow: "Our Listings",
    heading: "Available Properties",
    subtitle: "Explore our current listings across South-East Queensland.",
    cards: [],
  },
  services: {
    header_eyebrow: "How Can We Help You?",
    header_title: "What Are You",
    header_title_em: "Looking For?",
    header_subtitle:
      "Whether you're buying, selling, or renting — we're here to make your real estate journey seamless and rewarding.",
    services: [
      {
        theme: "buy",
        headline: "Advisory",
        title: "Buyer Support",
        subtitle: "And Guidance",
        description:
          "Clear advice and local insight to help you buy with confidence — pricing, comparables, and negotiation support tailored to your goals.",
        features: ["Buyer support and advisory", "Residential property sales", "House & land packages"],
        cta_label: "Speak With Us",
      },
      {
        theme: "sell",
        headline: "Insights",
        title: "Property Appraisals",
        subtitle: "& Market Analysis",
        description:
          "Professional appraisals, transparent pricing strategy, and data-led guidance to help you make the right move at the right time.",
        features: ["Property appraisals and market analysis", "Honest communication", "Results driven outcomes"],
        cta_label: "Request an Appraisal",
      },
      {
        theme: "rent",
        headline: "Management",
        title: "Rentals &",
        subtitle: "Property Management",
        description:
          "Reliable tenancy, proactive maintenance, and smooth day-to-day management for landlords and tenants alike.",
        features: ["Quality tenant selection", "Reliable rent collection", "Routine inspections & maintenance"],
        cta_label: "Get In Touch",
      },
    ],
    cta_eyebrow: "Need Guidance?",
    cta_title: "Not Sure Where to",
    cta_title_em: "Start?",
    cta_text:
      "Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.",
    cta_primary: { label: "Talk to an Expert", href: "/contact" },
    cta_secondary: { label: "0450 009 291", href: "tel:+61450009291" },
  },
  video_testimonials: {
    section_label: "Testimonials",
    heading: "What Our",
    heading_em: "Clients Say",
    items: [],
  },
  portfolio: {
    eyebrow: "REAL GOLD PROPERTIES",
    heading: "Featured",
    heading_em: "Properties",
    subtitle:
      "Handpicked residences across Australia's most coveted neighbourhoods — every listing curated for quality, location, and lasting value.",
    projects: [],
  },
};

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchHomePage(signal?: AbortSignal): Promise<HomePageData> {
  const res = await fetch(`${API_BASE}/api/pages/home/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Home page fetch failed: ${res.status}`);
  return res.json() as Promise<HomePageData>;
}
