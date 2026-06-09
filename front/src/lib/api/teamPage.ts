import type { TeamPageData } from "@/types/teamPage";

const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

export const DEFAULT_TEAM_PAGE_DATA: TeamPageData = {
  id: 0,
  title: "Team",
  slug: "team",
  updated_at: null,
  sections: {},
};

export async function fetchTeamPage(signal?: AbortSignal): Promise<TeamPageData> {
  const res = await fetch(`${API_BASE}/api/pages/team/`, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!res.ok) throw new Error(`Team page fetch failed: ${res.status}`);
  return res.json() as Promise<TeamPageData>;
}
