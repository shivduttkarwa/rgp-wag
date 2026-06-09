import { startTransition, useEffect, useState } from "react";
import { DEFAULT_TEAM_PAGE_DATA, fetchTeamPage } from "@/lib/api/teamPage";
import type { TeamMemberData, TeamPageData, TeamSectionData } from "@/types/teamPage";
import type { InternalPageHeroData } from "@/types/internalPageHero";

type Status = "loading" | "ready" | "fallback";

let cachedData: TeamPageData | null = null;

function mergeMembers(members: TeamMemberData[] | undefined): TeamMemberData[] {
  const defaultMembers = DEFAULT_TEAM_PAGE_DATA.sections.team_section?.members ?? [];
  if (!members?.length) return defaultMembers;
  return members.map((member, index) => {
    const fallback = defaultMembers[index] ?? defaultMembers[0];
    return {
      ...fallback,
      ...member,
      stats: member.stats?.length ? member.stats : fallback?.stats ?? [],
      tags: member.tags?.length ? member.tags : fallback?.tags ?? [],
      social: {
        ...fallback?.social,
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
    sections: {
      ...defaults.sections,
      ...data.sections,
      hero: {
        ...defaults.sections.hero,
        ...data.sections?.hero,
      } as InternalPageHeroData,
      team_section: {
        ...defaults.sections.team_section,
        ...data.sections?.team_section,
        members: mergeMembers(data.sections?.team_section?.members),
      } as TeamSectionData & { members: TeamMemberData[] },
    },
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
