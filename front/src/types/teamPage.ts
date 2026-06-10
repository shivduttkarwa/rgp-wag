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

export type CoreValueItem = {
  icon: string;
  title: string;
  description: string;
};

export type CoreValuesData = {
  eyebrow: string;
  heading: string;
  heading_em: string;
  subtitle: string;
  values: CoreValueItem[];
};

export type TeamPageSections = {
  hero?: InternalPageHeroData;
  team_section?: TeamSectionData & { members: TeamMemberData[] };
  core_values?: CoreValuesData;
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
