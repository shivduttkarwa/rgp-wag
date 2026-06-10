import type { InternalPageHeroData } from "@/types/internalPageHero";
import type { CtaSection, EoiCtaSection } from "@/types/homePage";
import type { Property } from "@/components/reusable/PropertyCard";

export type AboutPageSections = {
  hero?: InternalPageHeroData;
  intro?: { statement: string };
  property_marquee?: {
    eyebrow: string;
    title: string;
    title_em: string;
    subtitle: string;
    cta?: import("@/types/shared").ButtonBlockData;
    properties: Property[];
  };
  split?: {
    heading: string;
    p1: string;
    p2: string;
    bullets: string[];
    video_url: string;
    cta?: import("@/types/shared").ButtonBlockData;
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
    cta?: import("@/types/shared").ButtonBlockData;
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
  section_order: string[];
};
