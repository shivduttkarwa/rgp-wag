import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./PropertySlider.css";

gsap.registerPlugin(ScrollTrigger);

export type PSSlide = {
  tab: string;
  eyebrow: string;
  headline: string;
  body: string;
  stats: Array<{ value: string; label: string }>;
  cta: string;
  coverSrc: string;
  floatSrc: string;
};

const DEFAULT_SLIDES: PSSlide[] = [
  {
    tab: "BUY",
    eyebrow: "BUYER'S GUIDE",
    headline: "FIND YOUR\nPERFECT HOME",
    body: "Curated listings, expert guidance, and zero pressure. We match you with the right property at the right price, every time.",
    stats: [
      { value: "320+", label: "Active Listings" },
      { value: "98%", label: "Client Satisfaction" },
    ],
    cta: "BROWSE LISTINGS",
    coverSrc:
      "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=1800&q=85",
    floatSrc:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=700&q=85",
  },
  {
    tab: "SELL",
    eyebrow: "SELLER'S EDGE",
    headline: "SELL SMARTER,\nEARN MORE",
    body: "Sharp pricing strategy, professional presentation, and maximum market exposure — from day one to closing day.",
    stats: [
      { value: "14", label: "Avg. Days on Market" },
      { value: "103%", label: "List-to-Sale Ratio" },
    ],
    cta: "GET A VALUATION",
    coverSrc:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1800&q=85",
    floatSrc:
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=700&q=85",
  },
  {
    tab: "RENT",
    eyebrow: "RENTAL MANAGEMENT",
    headline: "PREMIUM RENTALS,\nHASSLE-FREE",
    body: "From tenant screening to lease signing, every step handled with care — so landlords relax and renters feel at home.",
    stats: [
      { value: "500+", label: "Managed Units" },
      { value: "4.9★", label: "Tenant Rating" },
    ],
    cta: "VIEW RENTALS",
    coverSrc:
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1800&q=85",
    floatSrc:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=700&q=85",
  },
];

/* ── Per-slide architectural SVG content ── */
/* ── Per-slide architectural SVG content ── */
const ARCH_VIEWBOXES = ["0 0 140 100", "0 0 150 100", "0 0 160 100"];

const ARCH_SHAPES: React.ReactNode[] = [
  /* ── BUY — Grand Estate Mansion ── */
  <>
    {/* main central block */}
    <rect x="35" y="30" width="70" height="55" />

    {/* grand peaked roof */}
    <path d="M30 30 L70 5 L110 30" />
    <path d="M35 30 L70 10 L105 30" />

    {/* left wing */}
    <rect x="5" y="45" width="30" height="40" />
    <path d="M5 45 L20 32 L35 45" />

    {/* right wing */}
    <rect x="105" y="45" width="30" height="40" />
    <path d="M105 45 L120 32 L135 45" />

    {/* decorative roof finial */}
    <line x1="70" y1="5" x2="70" y2="0" />
    <circle cx="70" cy="0" r="2" />

    {/* ornate window - center top (Palladian style) */}
    <path d="M58 35 L58 50 A12 12 0 0 0 82 50 L82 35" />
    <line x1="70" y1="35" x2="70" y2="50" />
    <rect x="58" y="50" width="10" height="12" />
    <rect x="72" y="50" width="10" height="12" />

    {/* grand entrance */}
    <rect x="60" y="65" width="20" height="20" />
    <path d="M58 65 L70 55 L82 65" />
    <line x1="70" y1="65" x2="70" y2="85" />
    <circle cx="67" cy="76" r="1" />
    <circle cx="73" cy="76" r="1" />

    {/* entrance columns */}
    <line x1="55" y1="55" x2="55" y2="85" />
    <line x1="85" y1="55" x2="85" y2="85" />
    <path d="M53 55 L55 52 L57 55" />
    <path d="M83 55 L85 52 L87 55" />

    {/* portico roof */}
    <line x1="52" y1="55" x2="88" y2="55" />

    {/* left wing windows */}
    <rect x="12" y="52" width="8" height="12" />
    <rect x="22" y="52" width="8" height="12" />
    <rect x="12" y="68" width="8" height="12" />
    <rect x="22" y="68" width="8" height="12" />

    {/* right wing windows */}
    <rect x="110" y="52" width="8" height="12" />
    <rect x="120" y="52" width="8" height="12" />
    <rect x="110" y="68" width="8" height="12" />
    <rect x="120" y="68" width="8" height="12" />

    {/* main block side windows */}
    <rect x="40" y="38" width="10" height="14" />
    <line x1="45" y1="38" x2="45" y2="52" />
    <rect x="90" y="38" width="10" height="14" />
    <line x1="95" y1="38" x2="95" y2="52" />

    <rect x="40" y="58" width="10" height="14" />
    <line x1="45" y1="58" x2="45" y2="72" />
    <rect x="90" y="58" width="10" height="14" />
    <line x1="95" y1="58" x2="95" y2="72" />

    {/* chimneys */}
    <rect x="42" y="12" width="6" height="15" />
    <line x1="40" y1="12" x2="50" y2="12" />
    <rect x="92" y="12" width="6" height="15" />
    <line x1="90" y1="12" x2="100" y2="12" />

    {/* grand steps */}
    <path d="M50 85 L50 88 L90 88 L90 85" />
    <path d="M45 88 L45 91 L95 91 L95 88" />
    <path d="M40 91 L40 94 L100 94 L100 91" />

    {/* balustrade details */}
    <line x1="40" y1="93" x2="50" y2="93" />
    <line x1="90" y1="93" x2="100" y2="93" />

    {/* ground line */}
    <line x1="0" y1="94" x2="40" y2="94" />
    <line x1="100" y1="94" x2="140" y2="94" />

    {/* decorative urns */}
    <ellipse cx="38" cy="92" rx="3" ry="4" />
    <ellipse cx="102" cy="92" rx="3" ry="4" />
  </>,

  /* ── SELL — Contemporary Luxury Villa ── */
  <>
    {/* main horizontal mass */}
    <rect x="20" y="40" width="110" height="45" />

    {/* floating roof plane */}
    <line x1="15" y1="38" x2="135" y2="38" />
    <line x1="15" y1="36" x2="135" y2="36" />

    {/* vertical tower element */}
    <rect x="85" y="18" width="35" height="67" />
    <line x1="82" y1="16" x2="123" y2="16" />
    <line x1="82" y1="14" x2="123" y2="14" />

    {/* cantilever left section */}
    <rect x="5" y="50" width="20" height="35" />
    <line x1="3" y1="48" x2="27" y2="48" />

    {/* large glazing panels - main */}
    <rect x="25" y="45" width="18" height="35" />
    <line x1="34" y1="45" x2="34" y2="80" />

    <rect x="46" y="45" width="18" height="35" />
    <line x1="55" y1="45" x2="55" y2="80" />

    <rect x="67" y="45" width="15" height="35" />

    {/* tower glazing */}
    <rect x="90" y="22" width="12" height="20" />
    <rect x="105" y="22" width="12" height="20" />
    <rect x="90" y="46" width="12" height="18" />
    <rect x="105" y="46" width="12" height="18" />
    <rect x="90" y="68" width="25" height="14" />
    <line x1="102" y1="68" x2="102" y2="82" />

    {/* entrance */}
    <rect x="67" y="60" width="15" height="25" />
    <line x1="74.5" y1="60" x2="74.5" y2="85" />
    <circle cx="79" cy="72" r="1" />

    {/* cantilever windows */}
    <rect x="8" y="55" width="14" height="10" />
    <rect x="8" y="70" width="14" height="10" />

    {/* infinity pool */}
    <rect x="5" y="90" width="50" height="8" rx="1" />
    <line x1="10" y1="94" x2="50" y2="94" />

    {/* deck lines */}
    <line x1="55" y1="85" x2="85" y2="85" />
    <line x1="55" y1="88" x2="85" y2="88" />

    {/* minimalist landscaping */}
    <line x1="125" y1="85" x2="145" y2="85" />
    <circle cx="135" cy="78" r="6" />
    <line x1="135" y1="84" x2="135" y2="88" />

    {/* ground plane */}
    <line x1="0" y1="98" x2="150" y2="98" />

    {/* outdoor furniture hint */}
    <rect x="60" y="88" width="8" height="4" rx="1" />
    <rect x="72" y="88" width="8" height="4" rx="1" />

    {/* accent lighting line */}
    <line x1="20" y1="85" x2="55" y2="85" />
  </>,

  /* ── RENT — French Château ── */
  <>
    {/* main central body */}
    <rect x="40" y="35" width="80" height="55" />

    {/* mansard roof - main */}
    <path d="M38 35 L38 22 L80 8 L122 22 L122 35" />
    <path d="M42 35 L42 24 L80 12 L118 24 L118 35" />

    {/* left tower */}
    <rect x="10" y="28" width="30" height="62" />
    <path d="M8 28 L8 15 L25 5 L42 15 L42 28" />
    <path d="M12 28 L12 18 L25 10 L38 18 L38 28" />

    {/* tower finial */}
    <line x1="25" y1="5" x2="25" y2="0" />
    <circle cx="25" cy="0" r="1.5" />

    {/* right tower */}
    <rect x="120" y="28" width="30" height="62" />
    <path d="M118 28 L118 15 L135 5 L152 15 L152 28" />
    <path d="M122 28 L122 18 L135 10 L148 18 L148 28" />

    {/* tower finial */}
    <line x1="135" y1="5" x2="135" y2="0" />
    <circle cx="135" cy="0" r="1.5" />

    {/* dormer windows */}
    <path d="M55 35 L55 25 L65 20 L75 25 L75 35" />
    <rect x="58" y="25" width="14" height="12" />
    <line x1="65" y1="25" x2="65" y2="37" />

    <path d="M85 35 L85 25 L95 20 L105 25 L105 35" />
    <rect x="88" y="25" width="14" height="12" />
    <line x1="95" y1="25" x2="95" y2="37" />

    {/* left tower windows */}
    <path d="M18 35 L18 48 A7 7 0 0 0 32 48 L32 35" />
    <path d="M18 55 L18 68 A7 7 0 0 0 32 68 L32 55" />
    <rect x="18" y="75" width="14" height="12" />
    <line x1="25" y1="75" x2="25" y2="87" />

    {/* right tower windows */}
    <path d="M128 35 L128 48 A7 7 0 0 0 142 48 L142 35" />
    <path d="M128 55 L128 68 A7 7 0 0 0 142 68 L142 55" />
    <rect x="128" y="75" width="14" height="12" />
    <line x1="135" y1="75" x2="135" y2="87" />

    {/* main floor windows - upper */}
    <rect x="48" y="42" width="12" height="16" />
    <line x1="54" y1="42" x2="54" y2="58" />
    <rect x="100" y="42" width="12" height="16" />
    <line x1="106" y1="42" x2="106" y2="58" />

    {/* main floor windows - lower */}
    <rect x="48" y="65" width="12" height="18" />
    <line x1="54" y1="65" x2="54" y2="83" />
    <rect x="100" y="65" width="12" height="18" />
    <line x1="106" y1="65" x2="106" y2="83" />

    {/* grand entrance portico */}
    <rect x="68" y="55" width="24" height="35" />
    <path d="M65 55 L80 42 L95 55" />

    {/* entrance columns */}
    <line x1="68" y1="55" x2="68" y2="90" />
    <line x1="74" y1="55" x2="74" y2="90" />
    <line x1="86" y1="55" x2="86" y2="90" />
    <line x1="92" y1="55" x2="92" y2="90" />

    {/* entrance doors */}
    <rect x="74" y="68" width="12" height="22" />
    <line x1="80" y1="68" x2="80" y2="90" />
    <circle cx="77" cy="80" r="1" />
    <circle cx="83" cy="80" r="1" />

    {/* transom above door */}
    <path d="M74 68 L80 62 L86 68" />

    {/* balcony */}
    <line x1="66" y1="55" x2="94" y2="55" />
    <line x1="68" y1="56" x2="68" y2="58" />
    <line x1="72" y1="56" x2="72" y2="58" />
    <line x1="76" y1="56" x2="76" y2="58" />
    <line x1="80" y1="56" x2="80" y2="58" />
    <line x1="84" y1="56" x2="84" y2="58" />
    <line x1="88" y1="56" x2="88" y2="58" />
    <line x1="92" y1="56" x2="92" y2="58" />

    {/* grand steps */}
    <path d="M62 90 L62 93 L98 93 L98 90" />
    <path d="M58 93 L58 96 L102 96 L102 93" />

    {/* ground line */}
    <line x1="0" y1="96" x2="58" y2="96" />
    <line x1="102" y1="96" x2="160" y2="96" />

    {/* formal garden elements */}
    <ellipse cx="30" cy="95" rx="8" ry="3" />
    <ellipse cx="130" cy="95" rx="8" ry="3" />

    {/* topiary */}
    <circle cx="5" cy="88" r="5" />
    <line x1="5" y1="93" x2="5" y2="96" />
    <circle cx="155" cy="88" r="5" />
    <line x1="155" y1="93" x2="155" y2="96" />
  </>,
];
type Props = {
  slides?: PSSlide[];
};

const PropertySlider: React.FC<Props> = ({ slides = DEFAULT_SLIDES }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [sectionVisible, setSectionVisible] = useState(false);
  const isAnimatingRef = useRef(false);
  const autoRef = useRef<number | null>(null);
  const activeIdxRef = useRef(0);

  const coverRefs = useRef<(HTMLImageElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const floatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const archRefs = useRef<(SVGSVGElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);

  const AUTO_DELAY = 6200;

  /* ── initial layout — everything starts hidden; ScrollTrigger fires entrance ── */
  useEffect(() => {
    // Hide accent panel
    const accent = accentRef.current;
    if (accent) gsap.set(accent, { x: -60, autoAlpha: 0 });

    slides.forEach((_, i) => {
      const cover = coverRefs.current[i];
      const content = contentRefs.current[i];
      const float = floatRefs.current[i];
      const arch = archRefs.current[i];

      if (cover) gsap.set(cover, { autoAlpha: 0 });
      if (float) gsap.set(float, { autoAlpha: 0, x: 60 });
      if (arch) gsap.set(arch, { opacity: 0, y: i === 0 ? 40 : 30 });

      if (i === 0) {
        // Keep content container visible but hide children for stagger
        if (content) {
          gsap.set(content, { autoAlpha: 1 });
          const kids = Array.from(content.children) as HTMLElement[];
          gsap.set(kids, { y: 48, autoAlpha: 0 });
        }
      } else {
        if (content) gsap.set(content, { autoAlpha: 0 });
      }
    });
  }, [slides]);

  /* ── scroll-triggered entrance ── */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: container,
          start: "top 80%",
          once: true,
        },
        onComplete: () => setSectionVisible(true),
      });

      // Accent panel: slide in from left
      const accent = accentRef.current;
      if (accent) {
        tl.fromTo(accent, { x: -60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9 }, 0);
      }

      // Cover image: fade in with subtle scale
      const cover0 = coverRefs.current[0];
      if (cover0) {
        tl.fromTo(
          cover0,
          { autoAlpha: 0, scale: 1.05 },
          { autoAlpha: 1, scale: 1, duration: 1.1, ease: "power2.out" },
          0.05,
        );
      }

      // Float frame: slide in from right
      const float0 = floatRefs.current[0];
      if (float0) {
        tl.fromTo(float0, { x: 80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9 }, 0.2);
      }

      // Arch mark: fade up
      const arch0 = archRefs.current[0];
      if (arch0) {
        tl.fromTo(arch0, { y: 40, opacity: 0 }, { y: 0, opacity: 0.1, duration: 1.0 }, 0.25);
      }

      // Content children: stagger up
      const c0 = contentRefs.current[0];
      if (c0) {
        const kids = Array.from(c0.children) as HTMLElement[];
        tl.fromTo(
          kids,
          { y: 48, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.85 },
          0.35,
        );
      }
    }, container);

    return () => ctx.revert();
  }, [slides]);

  /* ── progress bar reset helper ── */
  const resetProgress = useCallback(() => {
    const bar = progressRef.current;
    if (!bar) return;
    gsap.killTweensOf(bar);
    gsap.set(bar, { scaleX: 0 });
    gsap.to(bar, { scaleX: 1, duration: AUTO_DELAY / 1000, ease: "none" });
  }, []);

  /* ── go-to ── */
  const goTo = useCallback(
    (next: number) => {
      const prev = activeIdxRef.current;
      if (isAnimatingRef.current || next === prev) return;
      isAnimatingRef.current = true;
      activeIdxRef.current = next;

      const prevCover = coverRefs.current[prev];
      const nextCover = coverRefs.current[next];
      const prevContent = contentRefs.current[prev];
      const nextContent = contentRefs.current[next];
      const prevFloat = floatRefs.current[prev];
      const nextFloat = floatRefs.current[next];
      const prevArch = archRefs.current[prev];
      const nextArch = archRefs.current[next];

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          isAnimatingRef.current = false;
          setActiveIdx(next);
        },
      });

      /* out: content children */
      if (prevContent) {
        const kids = Array.from(prevContent.children) as HTMLElement[];
        tl.to(
          kids,
          {
            y: -28,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.38,
            ease: "power2.in",
          },
          0,
        );
      }

      /* out: arch svg */
      if (prevArch) {
        tl.to(
          prevArch,
          { y: -25, opacity: 0, duration: 0.38, ease: "power2.in" },
          0,
        );
      }

      /* out: float */
      if (prevFloat) {
        tl.to(
          prevFloat,
          { x: -50, autoAlpha: 0, duration: 0.38, ease: "power2.in" },
          0,
        );
      }

      /* covers cross-fade */
      if (prevCover) {
        tl.to(
          prevCover,
          { autoAlpha: 0, duration: 0.65, ease: "power2.inOut" },
          0.15,
        );
      }
      if (nextCover) {
        gsap.set(nextCover, { autoAlpha: 0 });
        tl.to(
          nextCover,
          { autoAlpha: 1, duration: 0.65, ease: "power2.inOut" },
          0.15,
        );
      }

      /* in: float */
      if (nextFloat) {
        gsap.set(nextFloat, { x: 60, autoAlpha: 0 });
        tl.to(nextFloat, { x: 0, autoAlpha: 1, duration: 0.65 }, 0.3);
      }

      /* in: arch svg */
      if (nextArch) {
        gsap.set(nextArch, { y: 40, opacity: 0 });
        tl.to(nextArch, { y: 0, opacity: 0.1, duration: 0.65 }, 0.38);
      }

      /* in: content children */
      if (nextContent) {
        gsap.set(nextContent, { autoAlpha: 1 });
        const kids = Array.from(nextContent.children) as HTMLElement[];
        gsap.set(kids, { y: 52, autoAlpha: 0 });
        tl.to(kids, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.62 }, 0.42);
      }

      resetProgress();
    },
    [resetProgress],
  );

  /* ── auto-advance — only after section enters viewport ── */
  useEffect(() => {
    if (!sectionVisible) return;
    resetProgress();
    if (autoRef.current) window.clearTimeout(autoRef.current);
    autoRef.current = window.setTimeout(() => {
      goTo((activeIdxRef.current + 1) % slides.length);
    }, AUTO_DELAY);
    return () => {
      if (autoRef.current) window.clearTimeout(autoRef.current);
    };
  }, [activeIdx, sectionVisible, goTo, slides.length, resetProgress]);

  /* ── derived ── */
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === slides.length - 1;
  const padded = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <div className="rg-ps" ref={containerRef}>
      {/* ── Left accent panel ── */}
      <div className="rg-ps__accent" ref={accentRef} aria-hidden="true">
        <div className="rg-ps__accentNoise" />

        {/* Stacked architectural SVG marks */}
        <div className="rg-ps__archWrap">
          {slides.map((_, i) => (
            <svg
              key={i}
              ref={(el) => {
                archRefs.current[i] = el;
              }}
              className="rg-ps__archMark"
              viewBox={ARCH_VIEWBOXES[i % ARCH_VIEWBOXES.length]}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {ARCH_SHAPES[i % ARCH_SHAPES.length]}
            </svg>
          ))}
        </div>

        <nav className="rg-ps__tabs" role="tablist" aria-label="Service tabs">
          {slides.map((s, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIdx}
              className={`rg-ps__tab ${i === activeIdx ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              type="button"
            >
              {s.tab}
            </button>
          ))}
        </nav>

        <div className="rg-ps__counter">
          <span className="rg-ps__counterCurrent">{padded(activeIdx)}</span>
          <span className="rg-ps__counterSep" />
          <span className="rg-ps__counterTotal">
            {padded(slides.length - 1)}
          </span>
        </div>
      </div>

      {/* ── Floating property frame ── */}
      <div className="rg-ps__floatWrap" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="rg-ps__floatFrame"
            ref={(el) => {
              floatRefs.current[i] = el;
            }}
          >
            <img
              src={slide.floatSrc}
              alt=""
              className="rg-ps__floatImg"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="rg-ps__floatBadge">{slide.tab}</div>
          </div>
        ))}
      </div>

      {/* ── Main card track ── */}
      <div className="rg-ps__track">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="rg-ps__slide"
            role="tabpanel"
            aria-hidden={i !== activeIdx}
          >
            <img
              ref={(el) => {
                coverRefs.current[i] = el;
              }}
              src={slide.coverSrc}
              alt=""
              className="rg-ps__cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="rg-ps__overlay" />

            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className="rg-ps__content"
            >
              <div className="rg-ps__meta">
                <span className="rg-ps__index">{padded(i)}</span>
                <span className="rg-ps__eyebrow">{slide.eyebrow}</span>
                <span className="rg-ps__tag">{slide.tab}</span>
              </div>
              <h3 className="rg-ps__headline">
                {slide.headline.split("\n").map((ln, j) => (
                  <span key={j} className="rg-ps__headlineLine">
                    {ln}
                  </span>
                ))}
              </h3>
              <p className="rg-ps__body">{slide.body}</p>
              <div className="rg-ps__ctaRow">
                <button className="rg-ps__cta" type="button">
                  {slide.cta}
                  <svg
                    className="rg-ps__ctaArrow"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M4 10h12M12 5l5 5-5 5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation — mobile only (desktop uses tabs) */}
        <button
          className={`rg-ps__navBtn rg-ps__navBtn--prev ${isFirst ? "is-disabled" : ""}`}
          onClick={() => goTo(activeIdx - 1)}
          disabled={isFirst}
          aria-label="Previous slide"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          className={`rg-ps__navBtn rg-ps__navBtn--next ${isLast ? "is-disabled" : ""}`}
          onClick={() => goTo(activeIdx + 1)}
          disabled={isLast}
          aria-label="Next slide"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              d="M9 18l6-6-6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="rg-ps__progress" aria-hidden="true">
          <span className="rg-ps__progressBar" ref={progressRef} />
        </div>
      </div>
    </div>
  );
};

export default PropertySlider;
