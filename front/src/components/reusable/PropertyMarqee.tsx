import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { PropertyCard } from "./PropertyCard";
import { allProperties } from "../../data/listingProperties";
import "../../sections/PropertyListingsection.css";
import "./PropertyMarqee.css";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function PropertyMarquee() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const SPEED_PX_PER_SEC = 42;
  const GAP_PX_FALLBACK = 18;

  // Duplicate for seamless loop
  const doubled = useMemo(() => [...allProperties, ...allProperties], []);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const getGap = () => {
      const cs = window.getComputedStyle(track);
      const g = parseFloat((cs.columnGap || cs.gap || "") as string);
      return Number.isFinite(g) ? g : GAP_PX_FALLBACK;
    };

    const getSetWidth = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const count = allProperties.length;
      const gap = getGap();
      let w = 0;
      for (let i = 0; i < count; i++) {
        const el = children[i];
        if (!el) break;
        w += el.getBoundingClientRect().width;
        if (i < count - 1) w += gap;
      }
      return w;
    };

    let x = 0;
    let speed = SPEED_PX_PER_SEC;
    let isDown = false;
    let startX = 0;
    let startOffset = 0;
    let lastMoveTime = 0;
    let lastMoveX = 0;
    let velocity = 0;
    let startY = 0;
    let hasIntent = false;
    const INTENT_PX = 6;

    const shouldAutoMove = () => !isDown;

    const getClient = (e: PointerEvent | TouchEvent) => {
      const t = (e as TouchEvent).touches && (e as TouchEvent).touches[0];
      return t
        ? { x: t.clientX, y: t.clientY }
        : { x: (e as PointerEvent).clientX, y: (e as PointerEvent).clientY };
    };

    const onDown = (e: PointerEvent | TouchEvent) => {
      const { x: clientX, y: clientY } = getClient(e);
      startX = clientX;
      startY = clientY;
      startOffset = x;
      velocity = 0;
      lastMoveTime = performance.now();
      lastMoveX = clientX;
      const isMouse =
        "pointerType" in e && (e as PointerEvent).pointerType === "mouse";
      if (isMouse) {
        hasIntent = true;
        isDown = true;
        viewport.classList.add("rgMarquee_dragging");
      } else {
        hasIntent = false;
        isDown = false;
      }
    };

    const onMove = (e: PointerEvent | TouchEvent) => {
      const isMouse =
        "pointerType" in e && (e as PointerEvent).pointerType === "mouse";
      if (isMouse && !(e as PointerEvent).buttons) return;
      const { x: clientX, y: clientY } = getClient(e);
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!hasIntent) {
        if (Math.abs(dx) > Math.abs(dy) + INTENT_PX) {
          hasIntent = true;
          isDown = true;
          viewport.classList.add("rgMarquee_dragging");
        } else if (Math.abs(dy) > Math.abs(dx) + INTENT_PX) {
          return;
        } else {
          return;
        }
      }
      if (!isDown) return;

      x = startOffset + dx;
      const now = performance.now();
      const dt = Math.max(16, now - lastMoveTime);
      velocity = (clientX - lastMoveX) / dt;
      lastMoveTime = now;
      lastMoveX = clientX;
      if ("preventDefault" in e) e.preventDefault();
    };

    const onUp = () => {
      if (!isDown) {
        viewport.classList.remove("rgMarquee_dragging");
        return;
      }
      isDown = false;
      hasIntent = false;
      viewport.classList.remove("rgMarquee_dragging");

      let throwSpeed = clamp(velocity * 1000, -2200, 2200);
      let inertia = throwSpeed;
      const decay = 0.92;
      const drift = () => {
        if (Math.abs(inertia) < 10) return;
        x += inertia * (16 / 1000);
        inertia *= decay;
        requestAnimationFrame(drift);
      };
      requestAnimationFrame(drift);
    };

    viewport.addEventListener("pointerdown", onDown as any, { passive: false });
    window.addEventListener("pointermove", onMove as any, { passive: false });
    window.addEventListener("pointerup", onUp);
    viewport.addEventListener("touchstart", onDown as any, { passive: false });
    window.addEventListener("touchmove", onMove as any, { passive: false });
    window.addEventListener("touchend", onUp);

    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      if (shouldAutoMove()) {
        speed = SPEED_PX_PER_SEC;
        x -= speed * dt;
      }

      const setW = getSetWidth();
      if (setW > 0) {
        if (x <= -setW) x += setW;
        if (x >= 0) x -= setW;
      }

      track.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const setW = getSetWidth();
      if (setW > 0) {
        while (x <= -setW) x += setW;
        while (x >= 0) x -= setW;
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointerdown", onDown as any);
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("pointerup", onUp);
      viewport.removeEventListener("touchstart", onDown as any);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [GAP_PX_FALLBACK, SPEED_PX_PER_SEC]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const cursor = cursorRef.current;
    if (!viewport || !cursor) return;

    const onEnter = () => {
      cursor.style.opacity = "1";
    };
    const onLeave = () => {
      cursor.style.opacity = "0";
    };
    const onOver = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest("a, button, .card-btn")) {
        cursor.style.opacity = "0";
      }
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest("a, button, .card-btn")) {
        cursor.style.opacity = "1";
      }
    };
    const onMove = (e: PointerEvent) => {
      const rect = viewport.getBoundingClientRect();
      cursor.style.setProperty("--x", `${e.clientX - rect.left}px`);
      cursor.style.setProperty("--y", `${e.clientY - rect.top}px`);
    };

    viewport.addEventListener("pointerenter", onEnter);
    viewport.addEventListener("pointerleave", onLeave);
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerover", onOver);
    viewport.addEventListener("pointerout", onOut);

    return () => {
      viewport.removeEventListener("pointerenter", onEnter);
      viewport.removeEventListener("pointerleave", onLeave);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerover", onOver);
      viewport.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <section className="rgMarquee property-section">
      <div className="wrap">
        <header className="section-header">
          <div data-gsap="fade-up" className="section-badge">
            <span>Featured Portfolio</span>
          </div>
          <h2
            className="section-title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            Explore <em>Signature Homes</em>
          </h2>
          <p
            className="section-subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.2"
          >
            A curated selection of standout residences from across our portfolio
            — updated regularly.
          </p>
        </header>
      </div>

      <div className="rgMarquee__rail" aria-label="Property marquee slider">
        <div className="rgMarquee__cursor" ref={cursorRef} aria-hidden="true">
          <span className="cursor-text">Drag</span>
        </div>
        <div
          className="rgMarquee__fade rgMarquee__fade--l"
          aria-hidden="true"
        />
        <div
          className="rgMarquee__fade rgMarquee__fade--r"
          aria-hidden="true"
        />

        <div className="rgMarquee__viewport" ref={viewportRef}>
          <div className="rgMarquee__track" ref={trackRef}>
            {doubled.map((p, idx) => (
              <div className="property-card-wrap" key={`${p.id}-${idx}`}>
                <PropertyCard property={p} cardIndex={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rgMarquee__cta">
        <Link
          to="/properties"
          className="rgMarquee__cta-btn"
          data-gsap="btn-clip-reveal"
        >
          <span>View All Properties</span>
        </Link>
      </div>
    </section>
  );
}
