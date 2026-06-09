import type { ServicesPageData } from "@/types/servicesPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_SERVICES_PAGE_DATA: ServicesPageData = {
  id: 0,
  title: "Services",
  slug: "services",
  updated_at: null,
};

export async function fetchServicesPage(signal?: AbortSignal): Promise<ServicesPageData> {
  const res = await fetch(`${API_BASE}/api/pages/services/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`Services page fetch failed: ${res.status}`);
  return res.json() as Promise<ServicesPageData>;
}
