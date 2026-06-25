import { useLayoutEffect, useRef, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import InternalPageHero from "@/sections/InternalPageHero";
import gsap from "gsap";
import {
  Tag,
  CheckCircle,
  Key,
  ChevronDown,
  X,
  ArrowRight,
} from "lucide-react";
import {
  PropertyCard,
  type Property,
  type Category,
} from "../components/reusable/PropertyCard";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import Cta2 from "@/components/reusable/cta-2";
import PropertyMarqee from "@/components/reusable/PropertyMarqee";
import RgpCta from "@/components/reusable/RgpCta";
import EoiCta from "@/components/reusable/eoi-cta";
import { usePropertiesPage } from "@/hooks/usePropertiesPage";
import CmsEditBar from "@/components/reusable/CmsEditBar";
import PageSkeleton from "@/components/reusable/PageSkeleton";
import "./PropertiesPage.css";

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_COUNT = 6;

type Filters = {
  cat: "all" | Category;
  price: string;
  beds: string;
  baths: string;
  showAll: boolean;
};

type ScrollAction = "none" | "preserve" | "gridTop";

const DEFAULT_FILTERS: Filters = {
  cat: "for-sale",
  price: "all",
  beds: "any",
  baths: "any",
  showAll: false,
};

const categoryTabs = [
  { id: "all", label: "All" },
  { id: "for-sale", label: "For Sale", icon: Tag },
  { id: "sold", label: "Sold", icon: CheckCircle },
  { id: "for-rent", label: "For Rent", icon: Key },
];

const applyFilters = (items: Property[], f: Filters) =>
  items.filter((p) => {
    if (f.cat !== "all" && p.category !== f.cat) return false;
    if (f.price === "contact" && p.price !== 0) return false;
    if (f.price === "under500" && (p.price === 0 || p.price >= 500000))
      return false;
    if (
      f.price === "500-800" &&
      (p.price === 0 || p.price < 500000 || p.price > 800000)
    )
      return false;
    if (
      f.price === "800-1200" &&
      (p.price === 0 || p.price < 800000 || p.price > 1200000)
    )
      return false;
    if (f.price === "over1200" && (p.price === 0 || p.price <= 1200000))
      return false;
    if (f.beds === "land" && p.beds !== 0) return false;
    if (f.beds === "3" && p.beds < 3) return false;
    if (f.beds === "4" && p.beds < 4) return false;
    if (f.beds === "5" && p.beds < 5) return false;
    if (f.baths === "1" && p.baths < 1) return false;
    if (f.baths === "2" && p.baths < 2) return false;
    if (f.baths === "3" && p.baths < 3) return false;
    return true;
  });

const CATEGORY_ORDER: Record<string, number> = { "for-sale": 0, "sold": 1, "for-rent": 2 };

const sortAll = (items: Property[]): Property[] =>
  [...items].sort((a, b) => (CATEGORY_ORDER[a.category] ?? 99) - (CATEGORY_ORDER[b.category] ?? 99));

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertiesPage({ ready = false }: { ready?: boolean }) {
  const [searchParams] = useSearchParams();
  const pageRef = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { data, status } = usePropertiesPage();
  const { sections, listings: sourceProperties } = data;
  const propertyListing = sections.property_listing;
  const propertyMarquee = sections.property_marquee;
  const hasListings = sourceProperties.length > 0;
  const hasVisibleSections = Boolean(
    sections.hero ||
      propertyListing ||
      propertyMarquee ||
      sections.property_cta ||
      sections.cta ||
      sections.eoi_cta,
  );
  const pageClassName = [
    "ap-page",
    status !== "loading" && !sections.hero ? "ap-page--no-hero" : "",
    status !== "loading" && !hasVisibleSections ? "ap-page--empty" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const pendingScrollRef = useRef<{
    mode: ScrollAction;
    scrollY: number;
    gridTop: number;
  } | null>(null);

  const preventPointerFocus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };


  useEffect(() => {
    if (status === "loading") return;
    const guards = [
      "clipRevealInit",
      "clipRevealRtlInit",
      "clipRevealTopInit",
      "clipRevealLeftInit",
      "clipRevealRightInit",
      "wordRevealInit",
      "wordWriteInit",
      "clipSmoothInit",
      "clipSmoothDownInit",
      "charRevealInit",
    ];
    guards.forEach((key) => {
      pageRef.current
        ?.querySelectorAll<HTMLElement>(
          `[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}]`,
        )
        .forEach((el) => delete el.dataset[key]);
    });
    const cleanup = initGsapSwitchAnimations(pageRef.current);
    return cleanup;
  }, [status, data.updated_at]);

  // Seed initial filters from URL params (set by HeroSearchPanel)
  const VALID_CATS: Category[] = ["for-sale", "sold", "for-rent"];
  const paramCat   = searchParams.get("cat") as Category | null;
  const paramPrice = searchParams.get("price") ?? "all";
  const paramBeds  = searchParams.get("beds")  ?? "any";
  const paramBaths = searchParams.get("baths") ?? "any";
  const initialFilters: Filters = {
    cat:     paramCat && VALID_CATS.includes(paramCat) ? paramCat : "for-sale",
    price:   paramPrice,
    beds:    paramBeds,
    baths:   paramBaths,
    showAll: false,
  };

  // activeFilters drives UI controls (immediate feedback)
  // displayedFilters drives the grid (lags 280ms behind for exit animation)
  const [activeFilters, setActiveFilters] = useState<Filters>(initialFilters);
  const [displayedFilters, setDisplayedFilters] =
    useState<Filters>(initialFilters);
  const [isExiting, setIsExiting] = useState(false);

  const pendingRef = useRef<Filters>(DEFAULT_FILTERS);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const filterTabsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const pillInitialized = useRef(false);

  useLayoutEffect(() => {
    const container = filterTabsRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return;
    const activeBtn = container.querySelector<HTMLElement>(
      ".ap-filter-tab.active",
    );
    if (!activeBtn) return;

    if (!pillInitialized.current) {
      gsap.set(pill, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
      pillInitialized.current = true;
    } else {
      gsap.to(pill, {
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.38,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  }, [activeFilters.cat]);

  // ── Filter Change Handler ────────────────────────────────────────────────
  const changeFilters = (
    patch: Partial<Filters>,
    scrollAction: ScrollAction = "none",
  ) => {
    const next = { ...pendingRef.current, ...patch };
    pendingRef.current = next;

    if (gridContainerRef.current) {
      gridContainerRef.current.style.minHeight = `${gridContainerRef.current.offsetHeight}px`;
    }

    pendingScrollRef.current =
      scrollAction === "none"
        ? null
        : {
            mode: scrollAction,
            scrollY: window.scrollY,
            gridTop: gridSectionRef.current
              ? gridSectionRef.current.getBoundingClientRect().top +
                window.scrollY
              : window.scrollY,
          };
    setActiveFilters({ ...next });
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setDisplayedFilters({ ...next });
      setIsExiting(false);
      if (gridContainerRef.current) gridContainerRef.current.style.minHeight = "";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const pendingScroll = pendingScrollRef.current;
          if (!pendingScroll) return;
          if (pendingScroll.mode === "preserve") {
            window.scrollTo({ top: pendingScroll.scrollY, behavior: "auto" });
          }
          if (pendingScroll.mode === "gridTop") {
            window.scrollTo({ top: Math.max(0, pendingScroll.gridTop - 110), behavior: "auto" });
          }
          pendingScrollRef.current = null;
        });
      });
    }, 280);
  };

  const clearFilters = () => {
    pendingRef.current = { ...DEFAULT_FILTERS };
    setActiveFilters({ ...DEFAULT_FILTERS });
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => {
      setDisplayedFilters({ ...DEFAULT_FILTERS });
      setIsExiting(false);
    }, 280);
  };

  // ── Data ─────────────────────────────────────────────────────────────────
  // filtered/displayed are from displayedFilters (what the grid actually shows)
  const filtered = useMemo(() => {
    const result = applyFilters(sourceProperties, displayedFilters);
    return displayedFilters.cat === "all" ? sortAll(result) : result;
  }, [sourceProperties, displayedFilters]);
  // activeFiltered is for the result count badge (updates immediately)
  const activeFiltered = useMemo(() => {
    const result = applyFilters(sourceProperties, activeFilters);
    return activeFilters.cat === "all" ? sortAll(result) : result;
  }, [sourceProperties, activeFilters]);

  const displayed = displayedFilters.showAll
    ? filtered
    : filtered.slice(0, INITIAL_COUNT);
  const hasMore = !displayedFilters.showAll && filtered.length > INITIAL_COUNT;

  // gridKey forces grid remount after each filter animation completes
  const gridKey = `${displayedFilters.cat}-${displayedFilters.price}-${displayedFilters.beds}-${displayedFilters.baths}-${displayedFilters.showAll}`;

  const hasActiveFilters =
    activeFilters.price !== "all" ||
    activeFilters.beds !== "any" ||
    activeFilters.baths !== "any";

  if (status === "loading") return <PageSkeleton />;

  return (
    <div className={pageClassName} ref={pageRef}>
      <CmsEditBar pageId={data.id} />
      {sections.hero && <InternalPageHero ready={ready} hero={sections.hero} />}

      {propertyListing ? (
      <>
      {/* ── Filter Slab ───────────────────────────────────────────────── */}
      <div className="ap-filter-slab">
        <div className="ap-filter-slab__inner">
          {hasListings ? (
          <div
            className="ap-filter-row"
            data-gsap="fade-in"
            data-gsap-stagger="0.12"
            data-gsap-start="top 95%"
          >
            <div className="ap-filter-wrapper">
              <div ref={filterTabsRef} className="ap-filter-tabs">
                <div ref={pillRef} className="ap-filter-pill" />
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      changeFilters({
                        cat: tab.id as "all" | Category,
                        showAll: false,
                      })
                    }
                    className={`ap-filter-tab ${activeFilters.cat === tab.id ? "active" : ""}`}
                  >
                    {tab.icon ? <tab.icon size={16} /> : null}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ap-filter-group ap-filter-group--dropdowns">
              <div className="ap-select-wrap">
                <select
                  className="ap-select"
                  value={activeFilters.price}
                  onChange={(e) =>
                    changeFilters({ price: e.target.value, showAll: false })
                  }
                >
                  <option value="all">Any Price</option>
                  <option value="contact">Contact Agent</option>
                  <option value="under500">Under $500k</option>
                  <option value="500-800">$500k – $800k</option>
                  <option value="800-1200">$800k – $1.2M</option>
                  <option value="over1200">Over $1.2M</option>
                </select>
                <ChevronDown size={14} className="ap-select-icon" />
              </div>

              <div className="ap-select-wrap">
                <select
                  className="ap-select"
                  value={activeFilters.beds}
                  onChange={(e) =>
                    changeFilters({ beds: e.target.value, showAll: false })
                  }
                >
                  <option value="any">Any Beds</option>
                  <option value="land">Land / No Bedrooms</option>
                  <option value="3">3+ Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
                <ChevronDown size={14} className="ap-select-icon" />
              </div>

              <div className="ap-select-wrap">
                <select
                  className="ap-select"
                  value={activeFilters.baths}
                  onChange={(e) =>
                    changeFilters({ baths: e.target.value, showAll: false })
                  }
                >
                  <option value="any">Any Baths</option>
                  <option value="1">1+ Bathrooms</option>
                  <option value="2">2+ Bathrooms</option>
                  <option value="3">3+ Bathrooms</option>
                </select>
                <ChevronDown size={14} className="ap-select-icon" />
              </div>

              {hasActiveFilters && (
                <button className="ap-clear-btn" onClick={clearFilters}>
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>

            <p className="ap-result-count">
              {activeFiltered.length}{" "}
              {activeFiltered.length === 1 ? "property" : "properties"} found
            </p>
          </div>
          ) : null}
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      {hasListings ? (
      <div className="ap-grid-section" ref={gridSectionRef}>
        <div className="ap-grid-container" ref={gridContainerRef}>
          {filtered.length === 0 ? (
            <div className="ap-empty">
              <p>No properties match your filters.</p>
              <button className="ap-clear-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                key={gridKey}
                ref={gridRef}
                className={`ap-grid ${isExiting ? "grid-exiting" : "grid-entering"}`}
              >
                {displayed.map((p, i) => (
                  <div
                    key={p.id}
                    className="ap-card-wrap"
                    style={
                      { "--ap-delay": `${i * 0.06}s` } as React.CSSProperties
                    }
                    // data-gsap="clip-smooth-down"
                    // data-gsap-delay={`${i * 0.08}`}
                    // data-gsap-start="top 90%"
                  >
                    <PropertyCard property={p} cardIndex={i} />
                  </div>
                ))}
              </div>

              {/* View All / Show Less */}
              <div className="ap-view-all">
                {hasMore && (
                  <button
                    type="button"
                    className="ap-view-btn"
                    onMouseDown={preventPointerFocus}
                    onClick={(event) => {
                      event.currentTarget.blur();
                      changeFilters({ showAll: true }, "preserve");
                    }}
                  >
                    <span>View All {filtered.length} Properties</span>
                    <ArrowRight size={16} />
                  </button>
                )}
                {displayedFilters.showAll &&
                  filtered.length > INITIAL_COUNT && (
                    <button
                      type="button"
                      className="ap-view-btn"
                      onMouseDown={preventPointerFocus}
                      onClick={(event) => {
                        event.currentTarget.blur();
                        changeFilters({ showAll: false }, "gridTop");
                      }}
                    >
                      Show Less
                    </button>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
      ) : null}
      </>
      ) : null}

      {sections.property_marquee && propertyMarquee ? (
        <PropertyMarqee
          properties={sourceProperties}
          eyebrow={propertyMarquee.eyebrow}
          title={propertyMarquee.title}
          titleEm={propertyMarquee.title_em}
          subtitle={propertyMarquee.subtitle}
          cta={propertyMarquee.cta}
        />
      ) : null}

      {sections.property_cta && (
        <Cta2
          eyebrow={sections.property_cta.eyebrow}
          title={sections.property_cta.title}
          titleEm={sections.property_cta.title_em}
          text={sections.property_cta.text}
          primary={{
            label: sections.property_cta.primary.label,
            to: sections.property_cta.primary.href.startsWith("/")
              ? sections.property_cta.primary.href
              : undefined,
            href: sections.property_cta.primary.href.startsWith("/")
              ? undefined
              : sections.property_cta.primary.href,
          }}
          secondary={{
            label: sections.property_cta.secondary.label,
            to: sections.property_cta.secondary.href.startsWith("/")
              ? sections.property_cta.secondary.href
              : undefined,
            href: sections.property_cta.secondary.href.startsWith("/")
              ? undefined
              : sections.property_cta.secondary.href,
          }}
          commitments={sections.property_cta.commitments}
          bgImage={sections.property_cta.background_image?.url}
          bgVideo={
            sections.property_cta.background_type === "video"
              ? (sections.property_cta.background_video || undefined)
              : undefined
          }
          posterImage={sections.property_cta.video_poster_image?.url}
          minHeight={sections.property_cta.min_height}
        />
      )}

      {sections.cta && (
        <RgpCta
          eyebrow={sections.cta.eyebrow}
          title={sections.cta.title}
          titleEm={sections.cta.title_em}
          text={sections.cta.text}
          primary={sections.cta.primary}
          secondary={sections.cta.secondary}
          bgImage={sections.cta.background_image?.url}
          bgVideo={sections.cta.background_type === "video" ? sections.cta.background_video || undefined : undefined}
          posterImage={sections.cta.video_poster_image?.url}
          minHeight={sections.cta.min_height}
        />
      )}
      {sections.eoi_cta && (
        <EoiCta
          badgeText={sections.eoi_cta.badge_text}
          title={sections.eoi_cta.title}
          text={sections.eoi_cta.text}
          button={sections.eoi_cta.button}
          bgImage={sections.eoi_cta.background_image?.url}
          mobileBgImage={sections.eoi_cta.mobile_background_image?.url}
          minHeight={sections.eoi_cta.min_height}
          mobileMinHeight={sections.eoi_cta.mobile_min_height}
        />
      )}
    </div>
  );
}
