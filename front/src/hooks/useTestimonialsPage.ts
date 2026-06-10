import { startTransition, useEffect, useState } from "react";
import { DEFAULT_TESTIMONIALS_PAGE_DATA, fetchTestimonialsPage } from "@/lib/api/testimonialsPage";
import type { TestimonialsPageData } from "@/types/testimonialsPage";

type Status = "loading" | "ready" | "error";

let cachedData: TestimonialsPageData | null = null;

export function useTestimonialsPage(): { data: TestimonialsPageData; status: Status } {
  const [data, setData] = useState<TestimonialsPageData>(cachedData ?? DEFAULT_TESTIMONIALS_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();
    fetchTestimonialsPage(controller.signal)
      .then((d) => {
        startTransition(() => {
          cachedData = d;
          setData(d);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[TestimonialsPage] API unavailable.", err.message);
        startTransition(() => setStatus("error"));
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
