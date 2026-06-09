import { startTransition, useEffect, useState } from "react";
import {
  DEFAULT_PROPERTIES_PAGE_DATA,
  fetchPropertiesPage,
} from "@/lib/api/propertiesPage";
import type { PropertiesPageData } from "@/types/propertiesPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: PropertiesPageData | null = null;

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
          cachedData = payload;
          setData(payload);
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
