import type { InternalPageHeroData } from "@/types/internalPageHero";
import type { CtaSection, EoiCtaSection } from "@/types/homePage";

export type CmsTestimonial = {
  id: number;
  slug: string;
  client_name: string;
  location: string;
  quote: string;
  rating: number;
  avatar_image: { url: string; width: number; height: number; alt: string } | null;
  avatar_url: string;
};

export type CmsFeaturedTestimonial = {
  id: number;
  slug: string;
  kicker: string;
  title_lines: string[];
  description: string;
  link_text: string;
  link_url: string | null;
  image: string;
  theme:
    | "theme-1" | "theme-2" | "theme-3" | "theme-4" | "theme-5"
    | "theme-6" | "theme-7" | "theme-8" | "theme-9" | "theme-10";
  order: number;
  is_active: boolean;
};

export type TestimonialsPageSections = {
  hero?: InternalPageHeroData;
  featured_testimonials?: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    items: CmsFeaturedTestimonial[];
  };
  text_testimonials_grid?: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    items: CmsTestimonial[];
  };
  ticker?: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    items: CmsTestimonial[];
  };
  final_cta?: {
    heading: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    items: CmsTestimonial[];
  };
  cta?: CtaSection;
  eoi_cta?: EoiCtaSection;
};

export type TestimonialsPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  sections: TestimonialsPageSections;
};
