import { startTransition, useEffect, useState } from "react";
import { DEFAULT_SERVICES_PAGE_DATA, fetchServicesPage } from "@/lib/api/servicesPage";
import type { ServicesPageData } from "@/types/servicesPage";

type Status = "loading" | "ready" | "error";

let cachedData: ServicesPageData | null = null;

export function useServicesPage(): { data: ServicesPageData; status: Status } {
  const [data, setData] = useState<ServicesPageData>(cachedData ?? DEFAULT_SERVICES_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();
    fetchServicesPage(controller.signal)
      .then((d) => {
        startTransition(() => {
          cachedData = d;
          setData(d);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[ServicesPage] API unavailable.", err.message);
        startTransition(() => setStatus("error"));
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
