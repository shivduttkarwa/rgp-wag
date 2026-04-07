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
};

export type HeroSection = {
  title_line_1: string;
  title_line_2: string;
  subtitle: string;
  search_tabs?: SearchTab[];
  cta?: CtaData;
  background_image: WagtailImage | null;
  background_image_url: string;
  background_video_url: string;
  show_video: boolean;
};

export type IntroSection = {
  label: string;
  headline_line1: string;
  headline_line2: string;
  founder_name: string;
  body: string;
  primary_cta: CtaData;
  secondary_cta: CtaData;
  image: WagtailImage | null;
  image_url: string;
};

export type PropertyListingSection = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  cards?: (HomeListingCard | null)[];
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
};

export type ServiceCard = {
  theme: "buy" | "sell" | "rent";
  headline: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  cta_label: string;
};

export type ServicesSection = {
  header_eyebrow: string;
  header_title: string;
  header_title_em: string;
  header_subtitle: string;
  services: ServiceCard[];
  cta_eyebrow: string;
  cta_title: string;
  cta_title_em: string;
  cta_text: string;
  cta_primary: CtaData;
  cta_secondary: CtaData;
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
  image: WagtailImage | null;
  image_url: string;
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
  services?: ServicesSection;
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
