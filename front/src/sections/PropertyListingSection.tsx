import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { ArrowLeft, ArrowRight, Building2, CheckCircle, Key, Tag } from "lucide-react";
import SectionBadge from "@/components/reusable/SectionBadge";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import assetUrl from "@/lib/assetUrl";
import { renderHeroAccentTokens } from "@/lib/heroTokens";
import type { PropertyListingSection as PropertyListingSectionData } from "@/types/homePage";
import {
  PropertyCard,
  type Category,
  type Property as ListingCardProperty,
} from "../components/reusable/PropertyCard";
import "swiper/css";
import "swiper/css/pagination";
import "./PropertyListingSection.css";

const isCategory = (value: string): value is Category =>
  value === "for-sale" || value === "sold" || value === "for-rent";

const filterTabs = [
  { id: "for-sale", label: "For Sale", icon: Tag },
  { id: "sold", label: "Sold", icon: CheckCircle },
  { id: "for-rent", label: "For Rent", icon: Key },
] as const;

const mapCards = (
  cards: PropertyListingSectionData["cards"],
): ListingCardProperty[] =>
  (cards ?? [])
    .filter((card): card is NonNullable<typeof card> => Boolean(card))
    .map((card) => ({
      id: Number(card.id),
      slug: card.slug,
      category: isCategory(card.category) ? card.category : "for-sale",
      title: card.title,
      location: card.location,
      price: Number(card.price || 0),
      soldPrice: card.soldPrice == null ? undefined : Number(card.soldPrice),
      image: assetUrl(card.image),
      beds: Number(card.beds || 0),
      baths: Number(card.baths || 0),
      sqft: Number(card.sqft || 0),
      garage: Number(card.garage || 0),
      features: card.features || [],
      badge: card.badge || undefined,
      isNew: Boolean(card.isNew),
      views: card.views == null ? undefined : Number(card.views),
      soldDate: card.soldDate || undefined,
      daysOnMarket:
        card.daysOnMarket == null ? undefined : Number(card.daysOnMarket),
      deposit: card.deposit == null ? undefined : Number(card.deposit),
      minLease: card.minLease || undefined,
      type: card.type || undefined,
    }));

const PropertyListingSection = ({
  data,
}: {
  data?: PropertyListingSectionData;
}) => {
  const [activeFilter, setActiveFilter] = useState<Category | "*">("*");
  const [gridPhase, setGridPhase] = useState<"" | "grid-exiting" | "grid-entering">("");
  const [swiperPhase, setSwiperPhase] = useState<"" | "swiper-exiting" | "swiper-entering">("");
  const pendingFilter = useRef<Category | "*">("*");
  const animating = useRef(false);
  const mobileSwiperRef = useRef<SwiperType | null>(null);
  const [mobileSwiperIndex, setMobileSwiperIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const swiperWrapperRef = useRef<HTMLDivElement>(null);

  const sourceProperties = useMemo(
    () => mapCards(data?.cards),
    [data?.cards],
  );

  useEffect(() => {
    if (!sourceProperties.length) return;
    let raf: number;
    let st: ReturnType<typeof ScrollTrigger.create> | null = null;
    raf = requestAnimationFrame(() => {
      // Desktop: stagger each card
      const cards = gridRef.current?.querySelectorAll<HTMLElement>(".property-card-wrap");
      if (cards?.length) {
        gsap.set(cards, { clipPath: "inset(0 0 100% 0)" });
        st = ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.0,
              ease: "power3.inOut",
              stagger: 0.3,
              onComplete: () => { gsap.set(cards, { clearProps: "clip-path" }); },
            });
          },
        });
      }
      // Mobile: animate the whole swiper wrapper as one unit
      const swiper = swiperWrapperRef.current;
      if (swiper) {
        gsap.set(swiper, { clipPath: "inset(0 0 100% 0)" });
        ScrollTrigger.create({
          trigger: swiper,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(swiper, {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.1,
              ease: "power3.inOut",
              onComplete: () => { gsap.set(swiper, { clearProps: "clip-path" }); },
            });
          },
        });
      }
    });
    return () => { cancelAnimationFrame(raf); st?.kill(); };
  }, [sourceProperties]);

  if (!data) return null;

  const displayed =
    activeFilter === "*"
      ? sourceProperties
      : sourceProperties.filter((property) => property.category === activeFilter);

  const handleFilter = (next: Category | "*") => {
    if (next === activeFilter || animating.current) return;
    pendingFilter.current = next;
    animating.current = true;
    setGridPhase("grid-exiting");
    setSwiperPhase("swiper-exiting");
    setTimeout(() => {
      setActiveFilter(pendingFilter.current);
      setGridPhase("grid-entering");
      setSwiperPhase("swiper-entering");
      mobileSwiperRef.current?.slideTo(0, 0);
      setMobileSwiperIndex(0);
      setTimeout(() => {
        setGridPhase("");
        setSwiperPhase("");
        animating.current = false;
      }, 420);
    }, 260);
  };

  return (
    <section className="property-section">
      <div className="property-container">
        <header className="section-header">
          {data.section_title?.eyebrow ? (
            <SectionBadge text={data.section_title.eyebrow} icon={Building2} />
          ) : null}
          {data.section_title?.title ? (
            <h2
              className="section-title"
              data-gsap="char-reveal"
              data-gsap-start="top 85%"
            >
              {renderHeroAccentTokens(data.section_title.title)}
            </h2>
          ) : null}
          {data.section_title?.description ? (
            <p
              className="section-subtitle"
              data-gsap="fade-up"
              data-gsap-delay="0.15"
            >
              {data.section_title.description}
            </p>
          ) : null}
        </header>

        {sourceProperties.length ? (
          <>
            <div
              className="filter-wrapper"
              data-gsap="fade-up"
              data-gsap-delay="0.1"
            >
              <div className="filter-tabs">
                <button
                  onClick={() => handleFilter("*")}
                  className={`filter-tab ${activeFilter === "*" ? "active" : ""}`}
                  type="button"
                >
                  <span>All</span>
                </button>
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleFilter(tab.id)}
                    className={`filter-tab ${
                      activeFilter === tab.id ? "active" : ""
                    }`}
                    type="button"
                  >
                    <tab.icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop grid — hidden on mobile via CSS */}
            <div
              ref={gridRef}
              className={`property-grid${gridPhase ? ` ${gridPhase}` : ""}`}
            >
              {displayed.slice(0, 3).map((property, index) => (
                <div
                  key={property.id}
                  className="property-card-wrap"
                  style={gridPhase === "grid-entering" ? { animationDelay: `${index * 0.08}s` } : undefined}
                >
                  <PropertyCard property={property} cardIndex={index} />
                </div>
              ))}
            </div>

            {/* Mobile swiper — hidden on desktop via CSS */}
            <div ref={swiperWrapperRef} className={`property-swiper-wrapper${swiperPhase ? ` ${swiperPhase}` : ""}`}>
              <Swiper
                className="property-swiper"
                modules={[Pagination]}
                spaceBetween={16}
                slidesPerView={1.15}
                centeredSlides={false}
                grabCursor={true}
                speed={420}
                pagination={{ clickable: true, dynamicBullets: true }}
                breakpoints={{
                  480: { slidesPerView: 1.3, spaceBetween: 20 },
                  640: { slidesPerView: 1.8, spaceBetween: 24 },
                }}
                onSwiper={(swiper) => { mobileSwiperRef.current = swiper; }}
                onActiveIndexChange={(swiper) => setMobileSwiperIndex(swiper.activeIndex)}
              >
                {displayed.map((property, index) => (
                  <SwiperSlide key={property.id}>
                    <div className="property-card-wrap">
                      <PropertyCard property={property} cardIndex={index} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="swiper-nav">
                <button
                  type="button"
                  className="swiper-btn"
                  aria-label="Previous property"
                  disabled={mobileSwiperIndex === 0}
                  onClick={() => mobileSwiperRef.current?.slidePrev()}
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  type="button"
                  className="swiper-btn"
                  aria-label="Next property"
                  disabled={mobileSwiperIndex >= displayed.length - 1}
                  onClick={() => mobileSwiperRef.current?.slideNext()}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="view-all-wrapper">
              <Link
                to="/properties"
                className="view-all-btn"
                data-gsap="btn-clip-reveal"
              >
                <span>View All Properties</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default PropertyListingSection;
