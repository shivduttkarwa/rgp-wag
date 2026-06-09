import type { AboutPageData } from "@/types/aboutPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_ABOUT_PAGE_DATA: AboutPageData = {
  id: 0, title: "About", slug: "about", updated_at: null,
  sections: {
    hero: {
      title_line_1: "Meet [gold]Rahul[/gold] Singh",
      title_line_2: "Appraisal-First [amber]Agent[/amber]",
      subtitle: "Brisbane's calm, data-backed appraisal specialist. Clear pricing, honest advice, and a plan that helps your property stand out.",
      background_image: null, background_image_url: "images/hero4.jpg",
      show_video: false, background_video_url: "",
      mode: "buttons",
      buttons: [{ label: "Book a Free Appraisal", href: "/contact", style: "gold", open_in_new_tab: false }],
      stats: [],
    },
    intro: { statement: "Rahul Singh is the appraisal-first agent behind Real Gold Properties — bringing local clarity, data-backed pricing, and calm negotiation to every homeowner." },
    split: {
      heading: "Why Sellers Choose Rahul",
      p1: "He translates market noise into a clear, confident price position — with a strategy that attracts buyers and protects your upside.",
      p2: "You get straight answers, a staged plan, and weekly feedback so the appraisal never sits still.",
      bullets: [
        "Street-level pricing: recent sales, buyer demand, and suburb momentum.",
        "Launch strategy: presentation, timing, and campaign plan that drives competition.",
        "Calm guidance: no pressure, just clarity and next steps.",
      ],
      video_url: "vids/rgp-video.mp4",
      cta_label: "Book Your Appraisal",
      cta_href: "/contact",
    },
    overlay: {
      heading: "The Appraisal Strategy",
      text: "Rahul's appraisals are more than a number. Each one is built to attract the right buyers and set a confident path to sale.",
      image_url: "images/int.jpg",
      steps: [
        "01 On-site walk-through + market scan",
        "02 Pricing range + demand positioning",
        "03 Launch plan + feedback loop",
      ],
    },
    avail: {
      eyebrow: "APPRAISAL",
      heading: "Ready For Your Appraisal?",
      text: "Book a free, no-pressure appraisal with Rahul Singh. You'll get a clear price range, honest advice, and a next-step plan.",
      image_url: "images/rahul-singh.jpg",
      cta_label: "Book Your Appraisal",
      cta_href: "/contact",
    },
  },
};

export async function fetchAboutPage(signal?: AbortSignal): Promise<AboutPageData> {
  const res = await fetch(`${API_BASE}/api/pages/about/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`About page fetch failed: ${res.status}`);
  return res.json() as Promise<AboutPageData>;
}
