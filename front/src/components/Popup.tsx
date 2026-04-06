import { useEffect, useRef } from "react";
import gsap from "gsap";
import BtnPrimary from "./BtnPrimary";
import "./Popup.css";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface ShapePoints {
  topX: number;
  cp1x: number;
  cp1y: number;
  midX: number;
  midY: number;
  cp2x: number;
  cp2y: number;
  botX: number;
}

/* ═══════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════ */
function flat(baseX: number): ShapePoints {
  return {
    topX: baseX,
    cp1x: baseX,
    cp1y: 250,
    midX: baseX,
    midY: 500,
    cp2x: baseX,
    cp2y: 750,
    botX: baseX,
  };
}

function buildPath(p: ShapePoints): string {
  return `M 0 0
    L ${p.topX} 0
    Q ${p.cp1x} ${p.cp1y} ${p.midX} ${p.midY}
    Q ${p.cp2x} ${p.cp2y} ${p.botX} 1000
    L 0 1000 Z`;
}

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
interface PopupProps {
  onComplete?: () => void;
}

export default function Popup({ onComplete }: PopupProps) {
  const svgPathRef = useRef<SVGPathElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const svgPath = svgPathRef.current;
    const popup = popupRef.current;
    const logo = logoRef.current;
    const card = cardRef.current;
    const desc = descRef.current;
    const actions = actionsRef.current;
    const badge = badgeRef.current;

    if (!svgPath || !popup || !logo || !card || !desc || !actions || !badge)
      return;

    const pts = flat(-300);

    /* ── apply current pts to SVG ── */
    const applyPath = () => {
      svgPath.setAttribute("d", buildPath(pts));
    };

    /* ── initial states ── */
    gsap.set(logo, { opacity: 0, x: -60 });
    gsap.set(card, {
      clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
      opacity: 1,
    });
    gsap.set(desc, { opacity: 0 });
    gsap.set(actions, { opacity: 0 });
    gsap.set(badge, { opacity: 0 });

    applyPath();

    /* ── entry timeline (SVG + content) ── */
    const entryTL = gsap.timeline({
      defaults: { ease: "power3.out" },
    });

    // SVG arc sweep in
    entryTL.to(
      pts,
      {
        topX: 630,
        cp1x: 710,
        cp1y: 250,
        midX: 550,
        midY: 500,
        cp2x: 390,
        cp2y: 750,
        botX: 470,
        duration: 1,
        ease: "power3.out",
        onUpdate: applyPath,
      },
      0.3,
    );

    // Logo: fade in from left
    entryTL.to(
      logo,
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      1.2,
    );

    // Card/Image: clip reveal from left to right
    entryTL.to(
      card,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.96,
        ease: "power2.inOut",
      },
      1.35,
    );

    // Description: fade in
    entryTL.to(
      desc,
      {
        opacity: 1,
        duration: 0.64,
        ease: "power2.out",
      },
      1.5,
    );

    // Actions/CTA: fade in
    entryTL.to(
      actions,
      {
        opacity: 1,
        duration: 0.56,
        ease: "power2.out",
      },
      1.575,
    );

    // Badge
    entryTL.to(badge, { opacity: 1, duration: 0.6, ease: "power2.out" }, 1.85);

    /* ── exit timeline (reverse animations) ── */
    let exitTL: gsap.core.Timeline | null = null;

    const handleClose = () => {
      if (exitTL) return; // Prevent multiple triggers

      const gone = flat(-300);

      exitTL = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // Logo: fade out and move left
      exitTL.to(
        logo,
        {
          opacity: 0,
          x: -60,
          duration: 0.4,
          ease: "power2.in",
        },
        0,
      );

      // Card: clip un-reveal (right to left)
      exitTL.to(
        card,
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          duration: 0.4,
          ease: "power2.in",
        },
        0,
      );

      // Description: fade out
      exitTL.to(
        desc,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0,
      );

      // Actions: fade out
      exitTL.to(
        actions,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0,
      );

      // Badge: fade out
      exitTL.to(
        badge,
        {
          opacity: 0,
          scale: 0.7,
          duration: 0.3,
          ease: "power2.in",
        },
        0,
      );

      // SVG arc sweep out
      exitTL.to(
        pts,
        {
          ...gone,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: applyPath,
        },
        0.2,
      );

      // Fade out entire popup
      exitTL.to(
        popup,
        {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0.5,
      );
    };

    // Add click handler to badge
    badge.addEventListener("click", handleClose);

    /* ── cleanup ── */
    return () => {
      entryTL.kill();
      if (exitTL) exitTL.kill();
      badge.removeEventListener("click", handleClose);
    };
  }, [onComplete]);

  /* ═══════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════ */
  return (
    <div className="rg-popup" ref={popupRef}>
      <div className="rg-popup__overlay">
        <svg
          className="rg-popup__shape"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path ref={svgPathRef} d="" />
        </svg>

        <div className="rg-popup__content">
          <div className="rg-popup__logo" ref={logoRef}>
            <img
              src={`${import.meta.env.BASE_URL || "/"}images/RGP-logo.png`}
              alt="Real Gold Properties"
              className="rg-popup__logoMark"
            />
          </div>

          <div className="rg-popup__card" ref={cardRef}>
            <img
              className="rg-popup__cardImg"
              src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=80&auto=format&fit=crop"
              alt="Luxury property"
            />
          </div>

          <p className="rg-popup__desc" ref={descRef}>
            Curating exceptional properties that embody luxury, sophistication,
            and timeless value — your vision, our expertise.
          </p>

          <div className="rg-popup__actions" ref={actionsRef}>
            <BtnPrimary label="Schedule a Private Viewing" />
          </div>
        </div>
      </div>

      <button
        className="rg-popup__badge"
        ref={badgeRef}
        type="button"
        aria-label="Close and explore"
      >
        <span className="rg-popup__badgeInner">EXPLORE</span>
      </button>
    </div>
  );
}
