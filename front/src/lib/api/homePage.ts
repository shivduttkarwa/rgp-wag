import type { HomePageData, HomePageSections } from "@/types/homePage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

// Kept for backwards-compatible imports only. Runtime fallbacks are intentionally
// empty so the frontend renders only Wagtail-provided sections.
export const DEFAULT_HOME_PAGE_SECTIONS: HomePageSections = {};

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchHomePage(signal?: AbortSignal): Promise<HomePageData> {
  const res = await fetch(`${API_BASE}/api/pages/home/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Home page fetch failed: ${res.status}`);
  return res.json() as Promise<HomePageData>;
}
