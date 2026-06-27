import { useEffect, startTransition, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData } from "@/components/reusable/PropDetails";
import { detailCache, fetchPropertyDetail } from "@/lib/api/propertyDetail";
import { fetchPropertyList } from "@/lib/api/propertiesPage";
import type { Property } from "@/components/reusable/PropertyCard";
import PropertyCard from "@/components/reusable/PropertyCard";
import PageSkeleton from "@/components/reusable/PageSkeleton";
import RgpCta from "@/components/reusable/RgpCta";
import "./PropertyPage.css";

function pickRelated(all: Property[], currentSlug: string, city: string, category: string): Property[] {
  const others = all.filter(p => p.slug !== currentSlug);
  const sameCity = others.filter(p => city && p.location.toLowerCase().includes(city.toLowerCase()));
  const sameCat  = others.filter(p => p.category === category && !sameCity.includes(p));
  return [...sameCity, ...sameCat].slice(0, 3);
}

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();

  const [property, setProperty] = useState<PropertyData | null>(
    id ? (detailCache.get(id) ?? null) : null,
  );
  const [isLoading, setIsLoading] = useState(id ? !detailCache.has(id) : false);
  const [apiFailed, setApiFailed] = useState(false);
  const [related, setRelated] = useState<Property[]>([]);

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

  // Fetch related properties once the detail is known
  useEffect(() => {
    if (!property) return;
    const controller = new AbortController();
    fetchPropertyList(controller.signal)
      .then(all => {
        const picks = pickRelated(all, property.id, property.city, property.status === "For Rent" ? "for-rent" : property.status === "Sold" ? "sold" : "for-sale");
        setRelated(picks);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [property]);

  if (!property && !isLoading && apiFailed) return <Navigate to="/properties" replace />;
  if (isLoading) return <PageSkeleton />;
  if (!property) return null;

  return (
    <>
      <PropDetail
        property={property}
      />

      {related.length > 0 && (
        <section className="pd-related">
          <div className="pd-related__head">
            <h2 className="pd-related__title">Similar Properties</h2>
            <p className="pd-related__sub">You might also be interested in these listings</p>
          </div>
          <div className="pd-related__grid">
            {related.map((p, i) => (
              <PropertyCard key={p.slug} property={p} cardIndex={i} />
            ))}
          </div>
        </section>
      )}

      <RgpCta
        eyebrow="Real Gold Properties"
        title="Ready to Find Your"
        titleEm="Dream Home?"
        text="Our expert agents are here to guide you through every step — from search to settlement."
        primary={{ label: "View All Properties", href: "/properties", style: "gold", open_in_new_tab: false }}
        secondary={{ label: "Contact Us", href: "/contact", style: "outline", open_in_new_tab: false }}
        bgImage="/images/prop-hero.jpg"
        minHeight="100vh"
      />
    </>
  );
}
