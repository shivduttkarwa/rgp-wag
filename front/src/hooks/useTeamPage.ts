import { startTransition, useEffect, useState } from "react";
import { DEFAULT_TEAM_PAGE_DATA, fetchTeamPage } from "@/lib/api/teamPage";
import type { TeamPageData } from "@/types/teamPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: TeamPageData | null = null;

export function useTeamPage(): { data: TeamPageData; status: Status } {
  const [data, setData] = useState<TeamPageData>(cachedData ?? DEFAULT_TEAM_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();

    fetchTeamPage(controller.signal)
      .then((payload) => {
        startTransition(() => {
          cachedData = payload;
          setData(payload);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[TeamPage] API unavailable.", err.message);
        startTransition(() => {
          setData(DEFAULT_TEAM_PAGE_DATA);
          setStatus("fallback");
        });
      });

    return () => controller.abort();
  }, []);

  return { data, status };
}
