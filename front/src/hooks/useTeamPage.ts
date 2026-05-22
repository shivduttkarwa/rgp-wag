import { startTransition, useEffect, useState } from "react";
import { DEFAULT_TEAM_PAGE_DATA, fetchTeamPage } from "@/lib/api/teamPage";
import type { TeamMemberData, TeamPageData } from "@/types/teamPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: TeamPageData | null = null;

function mergeMembers(members: TeamMemberData[] | undefined): TeamMemberData[] {
  if (!members?.length) return DEFAULT_TEAM_PAGE_DATA.members;
  return members.map((member, index) => {
    const fallback = DEFAULT_TEAM_PAGE_DATA.members[index] ?? DEFAULT_TEAM_PAGE_DATA.members[0];
    return {
      ...fallback,
      ...member,
      stats: member.stats?.length ? member.stats : fallback.stats,
      tags: member.tags?.length ? member.tags : fallback.tags,
      social: {
        ...fallback.social,
        ...member.social,
      },
    };
  });
}

function mergeTeamData(data: TeamPageData): TeamPageData {
  const defaults = DEFAULT_TEAM_PAGE_DATA;
  return {
    ...defaults,
    ...data,
    hero: {
      ...defaults.hero,
      ...data.hero,
    },
    team_section: {
      ...defaults.team_section,
      ...data.team_section,
    },
    members: mergeMembers(data.members),
  };
}

export function useTeamPage(): { data: TeamPageData; status: Status } {
  const [data, setData] = useState<TeamPageData>(cachedData ?? DEFAULT_TEAM_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();

    fetchTeamPage(controller.signal)
      .then((payload) => {
        startTransition(() => {
          const merged = mergeTeamData(payload);
          cachedData = merged;
          setData(merged);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[TeamPage] API unavailable, using defaults.", err.message);
        startTransition(() => setStatus("fallback"));
      });

    return () => controller.abort();
  }, []);

  return { data, status };
}
