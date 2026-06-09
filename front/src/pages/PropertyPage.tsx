import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData } from "@/components/reusable/PropDetails";
import { fetchPropertyDetail } from "@/lib/api/propertyDetail";

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchPropertyDetail(id, controller.signal)
      .then((data) => {
        setProperty(data);
        setApiFailed(false);
      })
      .catch(() => {
        setApiFailed(true);
        setProperty(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (!property && !isLoading && apiFailed) return <Navigate to="/" replace />;
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
