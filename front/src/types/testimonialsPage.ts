import type { InternalPageHeroData } from "@/types/internalPageHero";

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

export type TestimonialsPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: InternalPageHeroData;
  section: { eyebrow: string; heading: string; subtitle: string };
  testimonials: CmsTestimonial[];
  featured_testimonials: CmsFeaturedTestimonial[];
  final_cta: {
    heading: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};
