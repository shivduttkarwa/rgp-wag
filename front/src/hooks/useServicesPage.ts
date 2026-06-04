import { useEffect, useState } from "react";
import { DEFAULT_SERVICES_PAGE_DATA, fetchServicesPage } from "@/lib/api/servicesPage";
import type { ServicesPageData } from "@/types/servicesPage";

type Status = "loading" | "ready" | "error";

export function useServicesPage(): { data: ServicesPageData; status: Status } {
  const [data, setData] = useState<ServicesPageData>(DEFAULT_SERVICES_PAGE_DATA);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetchServicesPage(controller.signal)
      .then((d) => { setData(d); setStatus("ready"); })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
