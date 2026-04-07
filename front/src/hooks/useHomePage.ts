import { startTransition, useEffect, useState } from "react";
import { DEFAULT_HOME_PAGE_SECTIONS, fetchHomePage } from "@/lib/api/homePage";
import type { HomePageSections } from "@/types/homePage";

type Status = "loading" | "ready" | "fallback";
let cachedSections: HomePageSections | null = null;

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
          // Merge API sections over defaults so missing blocks fall back gracefully
          const merged = { ...DEFAULT_HOME_PAGE_SECTIONS, ...data.sections };
          cachedSections = merged;
          setSections(merged);
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
