// Mirrors the block structure defined in backend/apps/home/blocks.py

export type CtaData = {
  label: string;
  href: string;
};

export type WagtailImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

export type SearchTab = {
  label: string | null;
  icon: "buy" | "rent" | "sold" | "agent" | null;
  href: string | null;
  open_in_new_tab?: boolean;
};

export type HeroSection = {
  title_line_1: string;
  title_line_2: string;
  subtitle: string;
  search_tabs?: SearchTab[];
  cta?: CtaData;
  background_image: WagtailImage | null;
  background_video: string | null;
  background_video_url: string;
  show_video: boolean;
};

export type IntroSection = {
  label: string;
  headline_line1: string;
  headline_line2: string;
  founder_name: string;
  body: string;
  image: WagtailImage | null;
  image_url: string;
};

export type PropertyListingSection = {
  section_title?: import("@/types/shared").SectionTitleData;
  cards?: (HomeListingCard | null)[];
};

export type EoiCtaSection = {
  badge_text: string;
  title: string;
  text: string;
  button?: import("@/types/shared").ButtonBlockData;
  background_image: WagtailImage | null;
  mobile_background_image: WagtailImage | null;
  min_height: string;
  mobile_min_height: string;
};

export type HomeListingCard = {
  id: number;
  slug: string;
  category: "for-sale" | "sold" | "for-rent";
  title: string;
  location: string;
  price: number;
  soldPrice?: number | null;
  image: string;
  beds: number;
  baths: number;
  sqft: number;
  garage: number;
  features: string[];
  badge?: string;
  isNew?: boolean;
  views?: number | null;
  soldDate?: string;
  daysOnMarket?: number | null;
  deposit?: number | null;
  minLease?: string;
  type?: string;
};

export type ServiceCard = {
  theme: "buy" | "sell" | "rent";
  headline: string;
  title: string;
  subtitle: string;
  description: string;
  cta?: import("@/types/shared").ButtonBlockData;
};

export type ServicesSection = {
  header_eyebrow: string;
  header_title: string;
  header_title_em: string;
  header_subtitle: string;
  services: ServiceCard[];
};

export type CtaSection = {
  eyebrow: string;
  title: string;
  title_em: string;
  text: string;
  primary?: import("@/types/shared").ButtonBlockData;
  secondary?: import("@/types/shared").ButtonBlockData;
  background_type: "image" | "video";
  background_image: WagtailImage | null;
  background_video: string | null;
  video_poster_image: WagtailImage | null;
  stats: Array<{ value: string; label: string }>;
  min_height: string;
};

export type VideoTestimonialItem = {
  kicker: string;
  name: string;
  video_url: string;
  poster_image: WagtailImage | null;
  poster_url: string;
  tint: "gold" | "amber" | "crimson";
};

export type VideoTestimonialsSection = {
  section_label: string;
  heading: string;
  heading_em: string;
  items: VideoTestimonialItem[];
};

export type ShowcasePropertyItem = {
  title: string;
  location: string;
  price: string;
  status: string;
  bg_image: WagtailImage | null;
  thumbnail: WagtailImage | null;
  interior_image: WagtailImage | null;
  beds: string;
  baths: string;
  area: string;
  property_slug: string;
};

export type PortfolioSection = {
  eyebrow: string;
  heading: string;
  heading_em: string;
  subtitle: string;
  projects: ShowcasePropertyItem[];
};

export type HomePageSections = {
  hero?: HeroSection;
  intro?: IntroSection;
  property_listing?: PropertyListingSection;
  eoi_cta?: EoiCtaSection;
  services?: ServicesSection;
  cta?: CtaSection;
  video_testimonials?: VideoTestimonialsSection;
  portfolio?: PortfolioSection;
};

export type HomePageData = {
  id: number;
  title: string;
  slug: string;
  sections: HomePageSections;
  updated_at: string | null;
};
