import type { InternalPageHeroData } from "@/types/internalPageHero";

export type ContactHero = InternalPageHeroData;

export type ContactInfoSection = {
  title: string;
  tagline: string;
  contact_number: string;
  email: string;
  address: string;
  working_hours: string;
  quote_text: string;
  quote_author: string;
};

export type ContactFormSection = {
  eyebrow: string;
  heading_line_1: string;
  heading_line_2: string;
  subtitle: string;
  intent_options: string[];
  property_type_options: string[];
  budget_min: number;
  budget_max: number;
  budget_step: number;
  budget_default: number;
  submit_note: string;
};

export type ContactPageData = {
  id: number;
  title: string;
  slug: string;
  updated_at: string | null;
  hero: ContactHero;
  contact_info: ContactInfoSection;
  form: ContactFormSection;
};
