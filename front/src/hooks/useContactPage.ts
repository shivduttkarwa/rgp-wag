import { startTransition, useEffect, useState } from "react";
import { DEFAULT_CONTACT_PAGE_DATA, fetchContactPage } from "@/lib/api/contactPage";
import type { ContactPageData } from "@/types/contactPage";

type Status = "loading" | "ready" | "fallback";

let cachedData: ContactPageData | null = null;

function mergeContactData(data: ContactPageData): ContactPageData {
  const defaults = DEFAULT_CONTACT_PAGE_DATA;
  return {
    ...defaults,
    ...data,
    hero: {
      ...defaults.hero,
      ...data.hero,
    },
    contact_info: {
      ...defaults.contact_info,
      ...data.contact_info,
    },
    form: {
      ...defaults.form,
      ...data.form,
      intent_options:
        data.form?.intent_options?.length ? data.form.intent_options : defaults.form.intent_options,
      property_type_options:
        data.form?.property_type_options?.length
          ? data.form.property_type_options
          : defaults.form.property_type_options,
    },
  };
}

export function useContactPage(): { data: ContactPageData; status: Status } {
  const [data, setData] = useState<ContactPageData>(cachedData ?? DEFAULT_CONTACT_PAGE_DATA);
  const [status, setStatus] = useState<Status>(cachedData ? "ready" : "loading");

  useEffect(() => {
    if (cachedData) return;

    const controller = new AbortController();

    fetchContactPage(controller.signal)
      .then((payload) => {
        startTransition(() => {
          const merged = mergeContactData(payload);
          cachedData = merged;
          setData(merged);
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
