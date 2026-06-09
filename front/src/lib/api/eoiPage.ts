import type { EoiPageData } from "@/types/eoiPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_EOI_PAGE_DATA: EoiPageData = {
  id: 0,
  title: "Expression of Interest",
  slug: "expressions-of-interest",
  updated_at: null,
  legal_text: "",
};

export async function fetchEoiPage(signal?: AbortSignal): Promise<EoiPageData> {
  const res = await fetch(`${API_BASE}/api/pages/eoi/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`EOI page fetch failed: ${res.status}`);
  return res.json() as Promise<EoiPageData>;
}
