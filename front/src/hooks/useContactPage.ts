import { startTransition, useEffect, useState } from "react";
import { DEFAULT_CONTACT_PAGE_DATA, fetchContactPage } from "@/lib/api/contactPage";
import type { ContactPageData } from "@/types/contactPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: ContactPageData | null = null;

export function useContactPage(): { data: ContactPageData; status: Status } {
  const [data, setData] = useState<ContactPageData>(cachedData ?? DEFAULT_CONTACT_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();

    fetchContactPage(controller.signal)
      .then((payload) => {
        startTransition(() => {
          cachedData = payload;
          setData(payload);
          setStatus("ready");
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.warn("[ContactPage] API unavailable, using defaults.", err.message);
        startTransition(() => setStatus("fallback"));
      });

    return () => controller.abort();
  }, []);

  return { data, status };
}
