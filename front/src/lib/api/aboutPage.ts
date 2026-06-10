import type { AboutPageData } from "@/types/aboutPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_ABOUT_PAGE_DATA: AboutPageData = {
  id: 0,
  title: "About",
  slug: "about",
  updated_at: null,
  sections: {},
  section_order: [],
};

export async function fetchAboutPage(signal?: AbortSignal): Promise<AboutPageData> {
  const res = await fetch(`${API_BASE}/api/pages/about/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`About page fetch failed: ${res.status}`);
  return res.json() as Promise<AboutPageData>;
}
