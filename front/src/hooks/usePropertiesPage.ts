import { startTransition, useEffect, useState } from "react";
import {
  DEFAULT_PROPERTIES_PAGE_DATA,
  fetchPropertiesPage,
} from "@/lib/api/propertiesPage";
import type { PropertiesPageData } from "@/types/propertiesPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: PropertiesPageData | null = null;

function mergePropertiesPageData(data: PropertiesPageData): PropertiesPageData {
  const defaults = DEFAULT_PROPERTIES_PAGE_DATA;
  return {
    ...defaults,
    ...data,
    hero: {
      ...defaults.hero,
      ...data.hero,
      buttons: data.hero?.buttons?.length ? data.hero.buttons : defaults.hero.buttons,
      stats: data.hero?.stats?.length ? data.hero.stats : defaults.hero.stats,
    },
    property_section: {
      ...defaults.property_section,
      ...data.property_section,
    },
    marquee: {
      ...defaults.marquee,
      ...data.marquee,
    },
    property_cta: {
      ...defaults.property_cta,
      ...data.property_cta,
      primary: {
        ...defaults.property_cta.primary,
        ...data.property_cta?.primary,
      },
      secondary: {
        ...defaults.property_cta.secondary,
        ...data.property_cta?.secondary,
      },
      commitments: data.property_cta?.commitments?.length
        ? data.property_cta.commitments
        : defaults.property_cta.commitments,
    },
    listings: data.listings?.length ? data.listings : defaults.listings,
  };
}

export function usePropertiesPage(): { data: PropertiesPageData; status: Status } {
  const [data, setData] = useState<PropertiesPageData>(
    cachedData ?? DEFAULT_PROPERTIES_PAGE_DATA,
  );
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();

    fetchPropertiesPage(controller.signal)
      .then((payload) => {
        startTransition(() => {
          const merged = mergePropertiesPageData(payload);
          cachedData = merged;
          setData(merged);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[PropertiesPage] API unavailable, using defaults.", err.message);
        startTransition(() => setStatus("fallback"));
      });

    return () => controller.abort();
  }, []);

  return { data, status };
}
