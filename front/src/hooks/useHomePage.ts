import { startTransition, useEffect, useState } from "react";
import { DEFAULT_HOME_PAGE_SECTIONS, fetchHomePage } from "@/lib/api/homePage";
import type { HomePageSections } from "@/types/homePage";

type Status = "loading" | "ready" | "fallback";
let cachedSections: HomePageSections | null = null;
const heroDefaults = DEFAULT_HOME_PAGE_SECTIONS.hero!;
const introDefaults = DEFAULT_HOME_PAGE_SECTIONS.intro!;
const propertyListingDefaults = DEFAULT_HOME_PAGE_SECTIONS.property_listing!;
const eoiCtaDefaults = DEFAULT_HOME_PAGE_SECTIONS.eoi_cta!;
const servicesDefaults = DEFAULT_HOME_PAGE_SECTIONS.services!;
const ctaDefaults = DEFAULT_HOME_PAGE_SECTIONS.cta!;
const videoTestimonialsDefaults = DEFAULT_HOME_PAGE_SECTIONS.video_testimonials!;
const portfolioDefaults = DEFAULT_HOME_PAGE_SECTIONS.portfolio!;

function applyBlockLevelDefaults(sections: HomePageSections): HomePageSections {
  const merged: HomePageSections = { ...sections };

  if (sections.hero) {
    merged.hero = {
      ...heroDefaults,
      ...sections.hero,
      search_tabs: sections.hero.search_tabs ?? heroDefaults.search_tabs,
    };
  }

  if (sections.intro) {
    merged.intro = {
      ...introDefaults,
      ...sections.intro,
    };
  }

  if (sections.property_listing) {
    merged.property_listing = {
      ...propertyListingDefaults,
      ...sections.property_listing,
      cards: sections.property_listing.cards ?? propertyListingDefaults.cards,
    };
  }

  if (sections.eoi_cta) {
    merged.eoi_cta = {
      ...eoiCtaDefaults,
      ...sections.eoi_cta,
      background_image: sections.eoi_cta.background_image ?? eoiCtaDefaults.background_image,
      mobile_background_image:
        sections.eoi_cta.mobile_background_image ?? eoiCtaDefaults.mobile_background_image,
    };
  }

  if (sections.services) {
    merged.services = {
      ...servicesDefaults,
      ...sections.services,
      services: sections.services.services ?? servicesDefaults.services,
    };
  }

  if (sections.cta) {
    merged.cta = {
      ...ctaDefaults,
      ...sections.cta,
      primary: sections.cta.primary ?? ctaDefaults.primary,
      secondary: sections.cta.secondary ?? ctaDefaults.secondary,
    };
  }

  if (sections.video_testimonials) {
    merged.video_testimonials = {
      ...videoTestimonialsDefaults,
      ...sections.video_testimonials,
      items: sections.video_testimonials.items ?? videoTestimonialsDefaults.items,
    };
  }

  if (sections.portfolio) {
    merged.portfolio = {
      ...portfolioDefaults,
      ...sections.portfolio,
      projects: sections.portfolio.projects ?? portfolioDefaults.projects,
    };
  }

  return merged;
}

export function useHomePage(): { sections: HomePageSections; status: Status } {
  const [sections, setSections] = useState<HomePageSections>(
    cachedSections ?? DEFAULT_HOME_PAGE_SECTIONS,
  );
  const [status, setStatus] = useState<Status>(cachedSections ? "ready" : "loading");

  useEffect(() => {
    if (cachedSections) return;

    const controller = new AbortController();

    fetchHomePage(controller.signal)
      .then((data) => {
        startTransition(() => {
          // Keep blocks independent: only apply defaults to blocks that exist in CMS
          // (do not auto-inject missing blocks from DEFAULT_HOME_PAGE_SECTIONS)
          const cmsSections = applyBlockLevelDefaults(data.sections ?? {});
          cachedSections = cmsSections;
          setSections(cmsSections);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[HomePage] API unavailable, using defaults.", err.message);
        startTransition(() => setStatus("fallback"));
      });

    return () => controller.abort();
  }, []);

  return { sections, status };
}
