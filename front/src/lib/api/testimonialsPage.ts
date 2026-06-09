import type { TestimonialsPageData } from "@/types/testimonialsPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_TESTIMONIALS_PAGE_DATA: TestimonialsPageData = {
  id: 0,
  title: "Testimonials",
  slug: "testimonials",
  updated_at: null,
  sections: {},
};

export async function fetchTestimonialsPage(signal?: AbortSignal): Promise<TestimonialsPageData> {
  const res = await fetch(`${API_BASE}/api/pages/testimonials/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Testimonials page fetch failed: ${res.status}`);
  return res.json() as Promise<TestimonialsPageData>;
}
