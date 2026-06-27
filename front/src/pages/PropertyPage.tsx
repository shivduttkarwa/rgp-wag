import { useEffect, startTransition, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import PropDetail from "../components/reusable/PropDetails";
import type { PropertyData } from "@/components/reusable/PropDetails";
import { detailCache, fetchPropertyDetail } from "@/lib/api/propertyDetail";
import { fetchPropertyList } from "@/lib/api/propertiesPage";
import type { Property } from "@/components/reusable/PropertyCard";
import PropertyCard from "@/components/reusable/PropertyCard";
import PageSkeleton from "@/components/reusable/PageSkeleton";
import PageSeo from "@/components/reusable/PageSeo";
import RgpCta from "@/components/reusable/RgpCta";
import "swiper/css";
import "swiper/css/pagination";
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
  const relatedSwiperRef = useRef<SwiperType | null>(null);
  const [relatedSwiperIndex, setRelatedSwiperIndex] = useState(0);

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

  const seoDescription = [
    property.status,
    property.priceLabel,
    property.address,
    property.city,
  ].filter(Boolean).join(" · ");

  return (
    <>
      <PageSeo
        title={property.title}
        description={seoDescription}
        image={property.images[0]?.url}
        path={`/properties/${id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "name": property.title,
          "description": seoDescription,
          "url": `https://realgoldproperties.com.au/properties/${id}`,
          "image": property.images[0]?.url,
          "offers": { "@type": "Offer", "price": property.priceLabel, "priceCurrency": "AUD" },
          "address": {
            "@type": "PostalAddress",
            "streetAddress": property.address,
            "addressLocality": property.city,
            "addressRegion": property.state,
            "addressCountry": "AU",
          },
        }}
      />
      <PropDetail
        property={property}
      />

      {related.length > 0 && (
        <section className="pd-related">
          <div className="pd-related__head">
            <h2 className="pd-related__title">Similar Properties</h2>
            <p className="pd-related__sub">You might also be interested in these listings</p>
          </div>

          {/* Desktop grid */}
          <div className="pd-related__grid">
            {related.map((p, i) => (
              <PropertyCard key={p.slug} property={p} cardIndex={i} />
            ))}
          </div>

          {/* Mobile swiper */}
          <div className="pd-related__swiper-wrapper">
            <Swiper
              className="pd-related__swiper"
              modules={[Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              speed={400}
              pagination={{ clickable: true }}
              onSwiper={(swiper) => { relatedSwiperRef.current = swiper; }}
              onActiveIndexChange={(swiper) => setRelatedSwiperIndex(swiper.activeIndex)}
            >
              {related.map((p, i) => (
                <SwiperSlide key={p.slug}>
                  <div className="pd-related__card-wrap">
                    <PropertyCard property={p} cardIndex={i} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="pd-related__swiper-nav">
              <button
                type="button"
                className="pd-related__swiper-btn"
                aria-label="Previous property"
                disabled={relatedSwiperIndex === 0}
                onClick={() => relatedSwiperRef.current?.slidePrev()}
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                className="pd-related__swiper-btn"
                aria-label="Next property"
                disabled={relatedSwiperIndex >= related.length - 1}
                onClick={() => relatedSwiperRef.current?.slideNext()}
              >
                <ArrowRight size={18} />
              </button>
            </div>
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
