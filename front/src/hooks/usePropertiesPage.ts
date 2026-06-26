import { startTransition, useEffect, useState } from "react";
import {
  DEFAULT_PROPERTIES_PAGE_DATA,
  fetchPropertiesPage,
} from "@/lib/api/propertiesPage";
import { prefetchPropertyDetails } from "@/lib/api/propertyDetail";
import type { PropertiesPageData } from "@/types/propertiesPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: PropertiesPageData | null = null;
const REQUEST_TIMEOUT_MS = 20000;

export function usePropertiesPage(): { data: PropertiesPageData; status: Status } {
  const [data, setData] = useState<PropertiesPageData>(
    cachedData ?? DEFAULT_PROPERTIES_PAGE_DATA,
  );
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();
    let didCancel = false;
    let didTimeout = false;
    const timeoutId = window.setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    fetchPropertiesPage(controller.signal)
      .then((payload) => {
        if (didCancel) return;
        window.clearTimeout(timeoutId);
        startTransition(() => {
          cachedData = payload;
          setData(payload);
          setStatus("ready");
        });
        // Silently pre-warm detail cache for every listing
        prefetchPropertyDetails(payload.listings.map((p) => p.slug));
      })
      .catch((err) => {
        if (didCancel) return;
        window.clearTimeout(timeoutId);
        if (controller.signal.aborted && !didTimeout) return;

        const reason = didTimeout
          ? `request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
          : err.message;
        console.warn("[PropertiesPage] API unavailable, using defaults.", reason);
        startTransition(() => setStatus("fallback"));
      });

    return () => {
      didCancel = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return { data, status };
}
