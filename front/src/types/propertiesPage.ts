import type { InternalPageHeroData } from "@/types/internalPageHero";
import type { Property } from "@/components/reusable/PropertyCard";
import type { WagtailImage } from "@/types/homePage";

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
  use_video: boolean;
  background_image: WagtailImage | null;
  background_image_url: string;
  background_video_url: string;
  video_poster_image: WagtailImage | null;
  video_poster_image_url: string;
  min_height: string;
};

export type PropertiesPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: InternalPageHeroData;
  property_section: PropertySectionData;
  marquee: PropertyMarqueeSectionData;
  property_cta: PropertyCtaData;
  listings: Property[];
};
