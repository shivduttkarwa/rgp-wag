// WhyUs.tsx
import { useEffect, useMemo, useRef } from "react";
import "./WhyUs.css";

type Benefit = {
  no: string;
  title: string;
  detail: string;
};

const BG_IMAGE =
  "https://framerusercontent.com/images/ZG8Kj2L7025QYTBlntUGwUw1U.png";

export default function WhyUs() {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tipTitleRef = useRef<HTMLDivElement | null>(null);
  const tipBodyRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const activeRef = useRef<HTMLElement | null>(null);

  // current + target positions
  const cx = useRef(0);
  const cy = useRef(0);
  const tx = useRef(0);
  const ty = useRef(0);

  const raf = useRef<number | null>(null);

  // tooltip size cache
  const tW = useRef(320);
  const tH = useRef(140);

  const benefits: Benefit[] = useMemo(
    () => [
      {
        no: "01",
        title: "Professionalism",
        detail:
          "We deliver high-quality service with clear processes, reliable timelines, and respect for every client’s goals.",
      },
      {
        no: "02",
        title: "Transparency",
        detail:
          "Honest communication at every step—clear advice, open feedback, and no surprises.",
      },
      {
        no: "03",
        title: "Negotiation Strength",
        detail:
          "We advocate for your outcome with confident, informed negotiation that protects value and builds trust.",
      },
      {
        no: "04",
        title: "Results Driven",
        detail:
          "Our goal is to help you achieve the best possible result for your property journey.",
      },
    ],
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const tooltip = tooltipRef.current;
    const tipTitle = tipTitleRef.current;
    const tipBody = tipBodyRef.current;

    if (!section || !tooltip || !tipTitle || !tipBody) return;

    const measureTooltip = () => {
      const prevOpacity = tooltip.style.opacity;
      const prevTransform = tooltip.style.transform;
      const prevVisibility = tooltip.style.visibility;

      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "1";
      tooltip.style.transform = "translate3d(0px,0px,0px) scale(1)";

      const r = tooltip.getBoundingClientRect();
      tW.current = r.width || tW.current;
      tH.current = r.height || tH.current;

      tooltip.style.visibility = prevVisibility;
      tooltip.style.opacity = prevOpacity;
      tooltip.style.transform = prevTransform;
    };

    const clampToViewport = (x: number, y: number) => {
      const pad = 14;
      const offset = 18;

      let px = x + offset;
      let py = y + offset;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (px + tW.current + pad > vw) px = x - tW.current - offset;
      if (py + tH.current + pad > vh) py = y - tH.current - offset;

      px = Math.max(pad, Math.min(vw - tW.current - pad, px));
      py = Math.max(pad, Math.min(vh - tH.current - pad, py));

      return { px, py };
    };

    const tick = () => {
      // ease current towards target
      cx.current += (tx.current - cx.current) * 0.18;
      cy.current += (ty.current - cy.current) * 0.18;

      tooltip.style.transform = `translate3d(${cx.current}px, ${cy.current}px, 0) scale(1)`;
      raf.current = window.requestAnimationFrame(tick);
    };

    const startFollow = () => {
      if (raf.current != null) return;
      raf.current = window.requestAnimationFrame(tick);
    };

    const stopFollow = () => {
      if (raf.current == null) return;
      window.cancelAnimationFrame(raf.current);
      raf.current = null;
    };

    const show = (el: HTMLElement, clientX: number, clientY: number) => {
      activeRef.current = el;

      const title = el.getAttribute("data-title") || "Details";
      const body = el.getAttribute("data-detail") || "";

      tipTitle.textContent = title;
      tipBody.textContent = body;

      tooltip.classList.add("is-visible");
      tooltip.setAttribute("aria-hidden", "false");

      measureTooltip();

      const { px, py } = clampToViewport(clientX, clientY);

      // start from cursor position so no snap
      cx.current = px;
      cy.current = py;
      tx.current = px;
      ty.current = py;

      tooltip.style.transform = `translate3d(${cx.current}px, ${cy.current}px, 0) scale(1)`;
      startFollow();
    };

    const hide = () => {
      activeRef.current = null;
      tooltip.classList.remove("is-visible");
      tooltip.setAttribute("aria-hidden", "true");
      stopFollow();
      // keep tooltip where it is while fading out (no teleport)
    };

    const onMove = (e: MouseEvent) => {
      if (!activeRef.current) return;
      const { px, py } = clampToViewport(e.clientX, e.clientY);
      tx.current = px;
      ty.current = py;
    };

    const onSectionLeave = (e: MouseEvent) => {
      if (!section.contains(e.relatedTarget as Node)) {
        hide();
      }
    };

    const onScroll = () => {
      hide();
    };

    const onEnter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const me = e as MouseEvent;
      show(el, me.clientX, me.clientY);
    };

    const onItemMove = (e: Event) => {
      if (!activeRef.current) return;
      const me = e as MouseEvent;
      const { px, py } = clampToViewport(me.clientX, me.clientY);
      tx.current = px;
      ty.current = py;
    };

    const onLeave = () => {
      window.setTimeout(() => {
        if (!document.querySelector(".whyus__item:hover")) hide();
      }, 50);
    };

    const onFocus = (e: FocusEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const mx = r.left + r.width * 0.55;
      const my = r.top + r.height * 0.35;
      show(el, mx, my);
    };

    const onBlur = () => {
      window.setTimeout(() => {
        const ae = document.activeElement as HTMLElement | null;
        if (!ae || !ae.classList.contains("whyus__item")) hide();
      }, 0);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };

    // attach events to items
    const itemEls = Array.from(
      document.querySelectorAll<HTMLElement>(".whyus__item"),
    );

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", measureTooltip);
    window.addEventListener("scroll", onScroll, { passive: true });
    section.addEventListener("mouseleave", onSectionLeave);

    itemEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mousemove", onItemMove);
      el.addEventListener("mouseleave", onLeave);
      el.addEventListener("focus", onFocus);
      el.addEventListener("blur", onBlur);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", measureTooltip);
      window.removeEventListener("scroll", onScroll);
      section.removeEventListener("mouseleave", onSectionLeave);

      itemEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mousemove", onItemMove);
        el.removeEventListener("mouseleave", onLeave);
        el.removeEventListener("focus", onFocus);
        el.removeEventListener("blur", onBlur);
      });

      stopFollow();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="whyus"
      id="benefits"
      aria-label="Why Us section"
    >
      <div
        className="whyus__bg"
        aria-hidden="true"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      <div className="whyus__overlay" aria-hidden="true" />

      <div className="whyus__wrap">
        <div className="whyus__label" aria-hidden="false" data-gsap="fade-up">
          <span className="whyus__labelText">Why Us</span>
        </div>

        <div className="whyus__content">
          <h2
            className="whyus__title"
            data-gsap="fade-up"
            data-gsap-delay="0.1"
          >
            Choose Us and <em>Experience</em>
            <br />
            <em>Extraordinary</em> Advantages
          </h2>

          <ol
            className="whyus__list"
            aria-label="Benefits list"
            data-gsap="fade-up"
            data-gsap-stagger="0.1"
            data-gsap-delay="0.15"
          >
            {benefits.map((b) => (
              <li
                key={b.no}
                className="whyus__item"
                tabIndex={0}
                data-title={b.title}
                data-detail={b.detail}
              >
                <div className="whyus__row">
                  <div className="whyus__left">
                    <span className="whyus__num">{b.no}</span>
                    <span className="whyus__name">{b.title}</span>
                  </div>

                  <div className="whyus__right">
                    <span className="whyus__dotBtn" aria-hidden="true">
                      <span className="whyus__dot" />
                      <span className="whyus__icon" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          focusable="false"
                          aria-hidden="true"
                        >
                          <path d="M9 18h12v-2H9v2zM3 6v2h18V6H3zm6 7h12v-2H9v2z"></path>
                        </svg>
                      </span>
                    </span>
                  </div>
                </div>

                <div className="whyus__line" aria-hidden="true">
                  <span className="whyus__lineFill" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Cursor-follow popup */}
      <div
        className="whyus__tooltip"
        id="whyUsTooltip"
        ref={tooltipRef}
        role="dialog"
        aria-hidden="true"
      >
        <div className="whyus__tooltipInner">
          <div className="whyus__tooltipKicker">Details</div>
          <div className="whyus__tooltipTitle" ref={tipTitleRef}>
            Title
          </div>
          <div className="whyus__tooltipBody" ref={tipBodyRef}>
            Body
          </div>
        </div>
      </div>
    </section>
  );
}
