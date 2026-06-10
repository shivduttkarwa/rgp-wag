import type { InternalPageHeroData } from "@/types/internalPageHero";

import type { ButtonBlockData } from "@/types/shared";

export type ServicesPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero?: InternalPageHeroData;
  intro?: { statement: string };
  buy?: { heading: string; p1: string; p2: string; image_url: string; cta_label: string; cta_href: string };
  cta?: {
    eyebrow: string;
    title: string;
    title_em: string;
    text: string;
    primary?: ButtonBlockData;
    secondary?: ButtonBlockData;
    stats: Array<{ value: string; label: string }>;
  };
  sell?: { heading: string; text: string; image_url: string; cta_label: string; cta_href: string };
  rent?: { heading: string; text: string; image_url: string; cta_label: string; cta_href: string };
};
