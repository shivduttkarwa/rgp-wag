import type { InternalPageHeroData } from "@/types/internalPageHero";

export type TeamMemberStat = {
  value: string;
  label: string;
};

export type TeamMemberData = {
  id: number;
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  stats: TeamMemberStat[];
  tags: string[];
  email: string;
  phone: string;
  social: {
    linkedin?: string;
  };
  order?: number;
  is_active?: boolean;
};

export type TeamSectionData = {
  eyebrow: string;
  title_line_1: string;
  title_line_2: string;
  subtitle: string;
};

export type TeamPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: InternalPageHeroData;
  team_section: TeamSectionData;
  members: TeamMemberData[];
};
