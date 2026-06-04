import { useEffect, useState } from "react";
import { DEFAULT_EOI_PAGE_DATA, fetchEoiPage } from "@/lib/api/eoiPage";
import type { EoiPageData } from "@/types/eoiPage";

type Status = "loading" | "ready" | "error";

export function useEoiPage(): { data: EoiPageData; status: Status } {
  const [data, setData] = useState<EoiPageData>(DEFAULT_EOI_PAGE_DATA);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetchEoiPage(controller.signal)
      .then((d) => { setData(d); setStatus("ready"); })
      .catch((err) => {
        if (err.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return { data, status };
}
