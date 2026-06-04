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

export type TestimonialsPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: InternalPageHeroData;
  section: { eyebrow: string; heading: string; subtitle: string };
  testimonials: CmsTestimonial[];
  final_cta: {
    heading: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};
