import { useEffect, startTransition, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData } from "@/components/reusable/PropDetails";
import { fetchPropertyDetail } from "@/lib/api/propertyDetail";
import PageSkeleton from "@/components/reusable/PageSkeleton";

const cache = new Map<string, PropertyData>();

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<PropertyData | null>(
    id ? (cache.get(id) ?? null) : null,
  );
  const [isLoading, setIsLoading] = useState(id ? !cache.has(id) : false);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    if (!id) { setIsLoading(false); return; }
    if (cache.has(id)) return;

    const controller = new AbortController();
    setIsLoading(true);

    fetchPropertyDetail(id, controller.signal)
      .then((data) => {
        cache.set(id, data);
        startTransition(() => {
          setProperty(data);
          setApiFailed(false);
        });
      })
      .catch(() => {
        startTransition(() => {
          setApiFailed(true);
          setProperty(null);
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (!property && !isLoading && apiFailed) return <Navigate to="/" replace />;
  if (isLoading) return <PageSkeleton />;
  if (!property) return null;

  return (
    <>
      <PropDetail
        property={property}
        onContactSubmit={(data) => console.log("Contact:", data)}
        onSaveProperty={() => {}}
        onShareProperty={() => {}}
        onScheduleViewing={() => {}}
        onDownloadBrochure={() => {}}
      />
    </>
  );
}
