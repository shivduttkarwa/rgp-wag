import type { ContactPageData } from "@/types/contactPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_CONTACT_PAGE_DATA: ContactPageData = {
  id: 0,
  title: "Contact",
  slug: "contact",
  updated_at: null,
  hero: {
    title_line_1: "Get In [gold]Touch[/gold]",
    title_line_2: "[amber]We're[/amber] Here",
    subtitle: "Our team is ready to guide you — from first enquiry to final key.",
    background_image: null,
    background_image_url: "images/contact-hero.jpg",
    show_video: false,
    background_video_url: "",
    mode: "buttons",
    buttons: [
      {
        label: "Call Us",
        href: "tel:+61450009291",
        style: "gold",
        open_in_new_tab: false,
      },
      {
        label: "Email Us",
        href: "mailto:admin@realgoldproperties.com.au",
        style: "blue",
        open_in_new_tab: false,
      },
    ],
    stats: [],
  },
  contact_info: {
    title: "Let's Talk Appraisal.",
    tagline:
      "Whether you're buying, selling, or investing — our advisors are ready to guide you through every step.",
    contact_number: "0450 009 291",
    email: "admin@realgoldproperties.com.au",
    address: "Forest Lake, Brisbane QLD 4078",
    working_hours: "All days · 09:00 – 18:00",
    quote_text:
      '"Real estate is not just a transaction — it is the beginning of a life lived better."',
    quote_author: "— Our Promise",
  },
  form: {
    eyebrow: "Begin your enquiry",
    heading_line_1: "Tell us what you're",
    heading_line_2: "looking for.",
    subtitle: "Fill in the details and a specialist will respond within one business day.",
    intent_options: ["Buy", "Sell", "Rent", "Invest", "Off-Plan", "Valuation"],
    property_type_options: [
      "Apartment",
      "Villa / Townhouse",
      "Penthouse",
      "Commercial",
      "Plot / Land",
    ],
    budget_min: 500_000,
    budget_max: 20_000_000,
    budget_step: 500_000,
    budget_default: 5_000_000,
    submit_note: "We respond within one business day.",
  },
};

export async function fetchContactPage(signal?: AbortSignal): Promise<ContactPageData> {
  const res = await fetch(`${API_BASE}/api/pages/contact/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Contact page fetch failed: ${res.status}`);
  return res.json() as Promise<ContactPageData>;
}
