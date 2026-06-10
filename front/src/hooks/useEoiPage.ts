import { startTransition, useEffect, useState } from "react";
import { DEFAULT_EOI_PAGE_DATA, fetchEoiPage } from "@/lib/api/eoiPage";
import type { EoiPageData } from "@/types/eoiPage";

type Status = "loading" | "ready" | "error";

let cachedData: EoiPageData | null = null;

export function useEoiPage(): { data: EoiPageData; status: Status } {
  const [data, setData] = useState<EoiPageData>(cachedData ?? DEFAULT_EOI_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();
    fetchEoiPage(controller.signal)
      .then((d) => {
        startTransition(() => {
          cachedData = d;
          setData(d);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[EoiPage] API unavailable.", err.message);
        startTransition(() => setStatus("error"));
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
