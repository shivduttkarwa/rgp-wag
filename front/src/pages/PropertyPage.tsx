import { useEffect, startTransition, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData, ContactFormData } from "@/components/reusable/PropDetails";
import { detailCache, fetchPropertyDetail } from "@/lib/api/propertyDetail";
import { submitContactForm } from "@/lib/api/forms";
import PageSkeleton from "@/components/reusable/PageSkeleton";

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<PropertyData | null>(
    id ? (detailCache.get(id) ?? null) : null,
  );
  const [isLoading, setIsLoading] = useState(id ? !detailCache.has(id) : false);
  const [apiFailed, setApiFailed] = useState(false);

  useEffect(() => {
    if (!id) { setIsLoading(false); return; }
    if (detailCache.has(id)) {
      setProperty(detailCache.get(id)!);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetchPropertyDetail(id, controller.signal)
      .then((data) => {
        detailCache.set(id, data);
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

  if (!property && !isLoading && apiFailed) return <Navigate to="/properties" replace />;
  if (isLoading) return <PageSkeleton />;
  if (!property) return null;

  const handleContactSubmit = async (data: ContactFormData) => {
    await submitContactForm({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Property Enquiry — ${property.address}`,
      message: data.message,
    });
  };

  return (
    <>
      <PropDetail
        property={property}
        onContactSubmit={handleContactSubmit}
      />
    </>
  );
}
