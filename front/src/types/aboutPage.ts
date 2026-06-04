import type { InternalPageHeroData } from "@/types/internalPageHero";

export type AboutPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: InternalPageHeroData;
  intro: { statement: string };
  split: {
    heading: string;
    p1: string;
    p2: string;
    bullets: string[];
    video_url: string;
    cta_label: string;
    cta_href: string;
  };
  overlay: {
    heading: string;
    text: string;
    image_url: string;
    steps: string[];
  };
  avail: {
    eyebrow: string;
    heading: string;
    text: string;
    image_url: string;
    cta_label: string;
    cta_href: string;
  };
};
