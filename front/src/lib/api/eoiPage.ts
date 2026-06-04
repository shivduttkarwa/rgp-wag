import type { EoiPageData } from "@/types/eoiPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_EOI_PAGE_DATA: EoiPageData = {
  id: 0, title: "Expression of Interest", slug: "expressions-of-interest", updated_at: null,
  hero: {
    title_line_1: "Expression [gold]of[/gold]",
    title_line_2: "Interest [amber]Form[/amber]",
    subtitle: "Use this form to submit your offer, purchaser details, and conditions for a property you wish to purchase.",
    background_image: null, background_image_url: "images/hero1.jpg",
    show_video: false, background_video_url: "",
    mode: "buttons",
    buttons: [{ label: "Complete the Form", href: "", style: "gold", open_in_new_tab: false }],
    stats: [],
  },
  legal_text: "I/We acknowledge that if this offer is accepted, I/We will be required to enter into and execute a contract of sale on these terms. I/We acknowledge that we may be one of several parties making offers to the seller for their consideration. Both purchaser and seller must sign a contract of sale before this offer becomes legally binding. An offer may be withdrawn at any time before signing a contract of sale.",
};

export async function fetchEoiPage(signal?: AbortSignal): Promise<EoiPageData> {
  const res = await fetch(`${API_BASE}/api/pages/eoi/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`EOI page fetch failed: ${res.status}`);
  return res.json() as Promise<EoiPageData>;
}
