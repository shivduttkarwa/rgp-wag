import { startTransition, useEffect, useState } from "react";
import { fetchHomePage } from "@/lib/api/homePage";
import type { HomePageSections } from "@/types/homePage";

type Status = "loading" | "ready" | "error";
let cachedSections: HomePageSections | null = null;

export function useHomePage(): { sections: HomePageSections; status: Status } {
  const [sections, setSections] = useState<HomePageSections>(
    cachedSections ?? {},
  );
  const [status, setStatus] = useState<Status>(cachedSections ? "ready" : "loading");

  useEffect(() => {
    if (cachedSections) return;

    const controller = new AbortController();

    fetchHomePage(controller.signal)
      .then((data) => {
        startTransition(() => {
          const cmsSections = data.sections ?? {};
          cachedSections = cmsSections;
          setSections(cmsSections);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[HomePage] API unavailable.", err.message);
        startTransition(() => {
          setSections({});
          setStatus("error");
        });
      });

    return () => controller.abort();
  }, []);

  return { sections, status };
}
