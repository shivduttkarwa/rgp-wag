import type { InternalPageHeroData } from "@/types/internalPageHero";
import type { Property } from "@/components/reusable/PropertyCard";
import type { CtaSection, EoiCtaSection, WagtailImage } from "@/types/homePage";

export type PropertySectionData = {
  eyebrow: string;
  heading: string;
  subtitle: string;
};

export type PropertyMarqueeSectionData = {
  eyebrow: string;
  title: string;
  title_em: string;
  subtitle: string;
  cta_label: string;
};

export type PropertyCtaLink = {
  label: string;
  href: string;
};

export type PropertyCtaCommitment = {
  title: string;
};

export type PropertyCtaData = {
  eyebrow: string;
  title: string;
  title_em: string;
  text: string;
  primary: PropertyCtaLink;
  secondary: PropertyCtaLink;
  commitments: PropertyCtaCommitment[];
  background_type: "image" | "video";
  background_image: WagtailImage | null;
  background_video: string | null;
  video_poster_image: WagtailImage | null;
  min_height: string;
};

export type PropertiesPageSections = {
  hero?: InternalPageHeroData;
  property_listing?: PropertySectionData;
  property_marquee?: PropertyMarqueeSectionData;
  property_cta?: PropertyCtaData;
  cta?: CtaSection;
  eoi_cta?: EoiCtaSection;
};

export type PropertiesPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  sections: PropertiesPageSections;
  listings: Property[];
};
