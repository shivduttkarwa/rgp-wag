import { useEffect, useState } from "react";
import { DEFAULT_ABOUT_PAGE_DATA, fetchAboutPage } from "@/lib/api/aboutPage";
import type { AboutPageData } from "@/types/aboutPage";

type Status = "loading" | "ready" | "error";

export function useAboutPage(): { data: AboutPageData; status: Status } {
  const [data, setData] = useState<AboutPageData>(DEFAULT_ABOUT_PAGE_DATA);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetchAboutPage(controller.signal)
      .then((d) => { setData(d); setStatus("ready"); })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
