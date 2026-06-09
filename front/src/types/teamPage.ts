import type { InternalPageHeroData } from "@/types/internalPageHero";
import type { CtaSection, EoiCtaSection } from "@/types/homePage";

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

export type TeamPageSections = {
  hero?: InternalPageHeroData;
  team_section?: TeamSectionData & { members: TeamMemberData[] };
  cta?: CtaSection;
  eoi_cta?: EoiCtaSection;
};

export type TeamPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  sections: TeamPageSections;
};
