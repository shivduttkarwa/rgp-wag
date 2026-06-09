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
  sections: {},
};

export async function fetchContactPage(signal?: AbortSignal): Promise<ContactPageData> {
  const res = await fetch(`${API_BASE}/api/pages/contact/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Contact page fetch failed: ${res.status}`);
  return res.json() as Promise<ContactPageData>;
}
