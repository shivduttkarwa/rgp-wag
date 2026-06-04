import { useEffect, useState } from "react";
import { DEFAULT_TESTIMONIALS_PAGE_DATA, fetchTestimonialsPage } from "@/lib/api/testimonialsPage";
import type { TestimonialsPageData } from "@/types/testimonialsPage";

type Status = "loading" | "ready" | "error";

export function useTestimonialsPage(): { data: TestimonialsPageData; status: Status } {
  const [data, setData] = useState<TestimonialsPageData>(DEFAULT_TESTIMONIALS_PAGE_DATA);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetchTestimonialsPage(controller.signal)
      .then((d) => { setData(d); setStatus("ready"); })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
