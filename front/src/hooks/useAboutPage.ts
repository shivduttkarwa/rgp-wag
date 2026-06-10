import { startTransition, useEffect, useState } from "react";
import { DEFAULT_ABOUT_PAGE_DATA, fetchAboutPage } from "@/lib/api/aboutPage";
import type { AboutPageData } from "@/types/aboutPage";

type Status = "loading" | "ready" | "error";

let cachedData: AboutPageData | null = null;

export function useAboutPage(): { data: AboutPageData; status: Status } {
  const [data, setData] = useState<AboutPageData>(cachedData ?? DEFAULT_ABOUT_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();
    fetchAboutPage(controller.signal)
      .then((d) => {
        startTransition(() => {
          cachedData = d;
          setData(d);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[AboutPage] API unavailable.", err.message);
        startTransition(() => setStatus("error"));
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
