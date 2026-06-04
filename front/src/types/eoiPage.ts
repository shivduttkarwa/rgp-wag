import type { InternalPageHeroData } from "@/types/internalPageHero";

export type EoiPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: InternalPageHeroData;
  legal_text: string;
};
