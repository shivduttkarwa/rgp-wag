import type { InternalPageHeroData } from "@/types/internalPageHero";
import type { CtaSection, EoiCtaSection } from "@/types/homePage";

export type AboutPageSections = {
  hero?: InternalPageHeroData;
  intro?: { statement: string };
  marquee?: { items: string[]; speed: number };
  split?: {
    heading: string;
    p1: string;
    p2: string;
    bullets: string[];
    video_url: string;
    cta_label: string;
    cta_href: string;
  };
  overlay?: {
    heading: string;
    text: string;
    image_url: string;
    steps: string[];
  };
  avail?: {
    eyebrow: string;
    heading: string;
    text: string;
    image_url: string;
    cta_label: string;
    cta_href: string;
  };
  cta?: CtaSection;
  eoi_cta?: EoiCtaSection;
};

export type AboutPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  sections: AboutPageSections;
};
