import { useLayoutEffect, useRef, useState, useMemo, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import gsap from "gsap";
import {
  Tag,
  CheckCircle,
  Key,
  ChevronDown,
  X,
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";
import {
  PropertyCard,
  type Property,
  type Category,
} from "../components/reusable/PropertyCard";
import { allProperties } from "../data/listingProperties";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import "./PropertiesPage.css";
import "../sections/ServiceSelection.css";

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
  cat: "all",
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

const PAGE_CTA = {
  eyebrow: "Need Help Choosing?",
  title: "Let’s Find Your",
  titleEm: "Perfect Property",
  text: "Tell us what you’re looking for and we’ll shortlist the best options, arrange inspections, and guide you through every step.",
  primaryLabel: "Talk to an Expert",
  primaryHref: "/contact",
  secondaryLabel: "0450 009 291",
  secondaryHref: "tel:+61450009291",
};

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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PropertiesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageRef = useRef<HTMLDivElement>(null);
  const gridSectionRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const pendingScrollRef = useRef<{
    mode: ScrollAction;
    scrollY: number;
    gridTop: number;
  } | null>(null);

  const preventPointerFocus = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const finalizeGridTransition = () => {
    if (gridContainerRef.current) {
      gridContainerRef.current.style.minHeight = "";
    }

    const pendingScroll = pendingScrollRef.current;
    if (!pendingScroll) return;

    if (pendingScroll.mode === "preserve") {
      window.scrollTo({ top: pendingScroll.scrollY, behavior: "auto" });
    }

    if (pendingScroll.mode === "gridTop") {
      window.scrollTo({
        top: Math.max(0, pendingScroll.gridTop - 110),
        behavior: "auto",
      });
    }

    pendingScrollRef.current = null;
  };

  useEffect(() => {
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
  }, []);

  // Seed initial filters from URL params (set by HeroSearchPanel)
  const VALID_CATS: Category[] = ["for-sale", "sold", "for-rent"];
  const paramCat   = searchParams.get("cat") as Category | null;
  const paramPrice = searchParams.get("price") ?? "all";
  const paramBeds  = searchParams.get("beds")  ?? "any";
  const paramBaths = searchParams.get("baths") ?? "any";
  const initialFilters: Filters = {
    cat:     paramCat && VALID_CATS.includes(paramCat) ? paramCat : "all",
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
  const isoRef = useRef<any>(null);
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

    if (gridContainerRef.current && scrollAction !== "none") {
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const pendingScroll = pendingScrollRef.current;
          if (!pendingScroll) return;

          if (pendingScroll.mode === "preserve") {
            window.scrollTo({ top: pendingScroll.scrollY, behavior: "auto" });
          }

          if (pendingScroll.mode === "gridTop") {
            window.scrollTo({
              top: Math.max(0, pendingScroll.gridTop - 110),
              behavior: "auto",
            });
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
  const filtered = useMemo(
    () => applyFilters(allProperties, displayedFilters),
    [displayedFilters],
  );
  // activeFiltered is for the result count badge (updates immediately)
  const activeFiltered = useMemo(
    () => applyFilters(allProperties, activeFilters),
    [activeFilters],
  );

  const displayed = displayedFilters.showAll
    ? filtered
    : filtered.slice(0, INITIAL_COUNT);
  const hasMore = !displayedFilters.showAll && filtered.length > INITIAL_COUNT;

  // isoKey drives Isotope reinit — changes only after animation completes
  const isoKey = `${displayedFilters.cat}-${displayedFilters.price}-${displayedFilters.beds}-${displayedFilters.baths}-${displayedFilters.showAll}`;

  // ── Isotope ──────────────────────────────────────────────────────────────
  // transitionDuration:0 — CSS animations handle all visual transitions
  useLayoutEffect(() => {
    if (!gridRef.current || displayed.length === 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => finalizeGridTransition());
      });
      return;
    }

    let iso: any = null;
    const timer = setTimeout(() => {
      if (!gridRef.current) return;
      import("isotope-layout").then(({ default: Isotope }) => {
        if (!gridRef.current) return;
        iso = new Isotope(gridRef.current, {
          itemSelector: ".ap-card-wrap",
          layoutMode: "fitRows",
          transitionDuration: 0,
        });
        isoRef.current = iso;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => finalizeGridTransition());
        });
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      iso?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isoKey]);

  const hasActiveFilters =
    activeFilters.cat !== "all" ||
    activeFilters.price !== "all" ||
    activeFilters.beds !== "any" ||
    activeFilters.baths !== "any";

  return (
    <div className="ap-page" ref={pageRef}>
      <HeroSection
        ready={true}
        showVideo={false}
        bgImage="images/prop-hero.jpg"
        titleLine1={
          <>
            Our <span className="rg-gold">Premium</span>
          </>
        }
        titleLine2={
          <>
            <span className="rg-amber">Properties</span>
          </>
        }
        subtitle="Browse our curated portfolio of for-sale, sold and rental properties across South-East Queensland."
        showCta
        ctaLabel="Talk to an Expert"
        ctaOnClick={() => navigate("/contact")}
      />

      {/* ── Filter Slab ───────────────────────────────────────────────── */}
      <div className="ap-filter-slab">
        <div
          className="ap-filter-slab__inner"
          data-gsap="fade-up"
          data-gsap-start="top 95%"
        >
          <div className="ap-filter-row">
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
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
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
                key={isoKey}
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
                      className="ap-view-btn ap-view-btn--ghost"
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

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <div className="svc-cta">
        <div className="svc-cta__container">
          <div className="svc-cta__decor svc-cta__decor--left" />
          <div className="svc-cta__decor svc-cta__decor--right" />

          <div className="svc-cta__content">
            <span className="svc-cta__eyebrow" data-gsap="fade-up">
              {PAGE_CTA.eyebrow}
            </span>
            <h3 className="svc-cta__title">
              {PAGE_CTA.title} <em>{PAGE_CTA.titleEm}</em>
            </h3>
            <p className="svc-cta__text">{PAGE_CTA.text}</p>

            <div className="svc-cta__actions">
              <Link
                to={PAGE_CTA.primaryHref}
                className="svc-cta__btn svc-cta__btn--primary"
              >
                <MessageCircle size={20} />
                <span>{PAGE_CTA.primaryLabel}</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href={PAGE_CTA.secondaryHref}
                className="svc-cta__btn svc-cta__btn--secondary"
              >
                <Phone size={18} />
                <span>{PAGE_CTA.secondaryLabel}</span>
              </a>
            </div>

            <div className="svc-cta__trust">
              <div className="svc-cta__trust-item">
                <span className="svc-cta__trust-value">150+</span>
                <span className="svc-cta__trust-label">Local Deals Closed</span>
              </div>
              <div className="svc-cta__trust-divider" />
              <div className="svc-cta__trust-item">
                <span className="svc-cta__trust-value">24/7</span>
                <span className="svc-cta__trust-label">Buyer Support</span>
              </div>
              <div className="svc-cta__trust-divider" />
              <div className="svc-cta__trust-item">
                <span className="svc-cta__trust-value">100%</span>
                <span className="svc-cta__trust-label">
                  Client Satisfaction
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
