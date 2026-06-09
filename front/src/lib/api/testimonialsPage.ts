import type { TestimonialsPageData } from "@/types/testimonialsPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_TESTIMONIALS_PAGE_DATA: TestimonialsPageData = {
  id: 0, title: "Testimonials", slug: "testimonials", updated_at: null,
  hero: {
    title_line_1: "Client [gold]Stories[/gold]",
    title_line_2: "Words That [amber]Inspire[/amber]",
    subtitle: "Verified experiences — refined, discreet service across South-East Queensland.",
    background_image: null, background_image_url: "images/testi-hero.jpg",
    show_video: false, background_video_url: "", mode: "stats", buttons: [],
    stats: [
      { value: "5★", label: "Avg. Rating" },
      { value: "100%", label: "Client Satisfaction" },
      { value: "52", label: "Total Reviews" },
    ],
  },
  section: {
    eyebrow: "Client Voices",
    heading: "What Our Clients Say",
    subtitle: "Real experiences from real clients — every word earned, never scripted.",
  },
  testimonials: [],
  featured_testimonials: [],
  final_cta: {
    heading: "Book a Free Appraisal",
    body: "Get a clear price range, honest advice, and a plan that positions your property for a confident sale.",
    primary: { label: "Book Your Appraisal", href: "/contact" },
    secondary: { label: "Talk to Rahul", href: "/contact" },
  },
};

export async function fetchTestimonialsPage(signal?: AbortSignal): Promise<TestimonialsPageData> {
  const res = await fetch(`${API_BASE}/api/pages/testimonials/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Testimonials page fetch failed: ${res.status}`);
  return res.json() as Promise<TestimonialsPageData>;
}
