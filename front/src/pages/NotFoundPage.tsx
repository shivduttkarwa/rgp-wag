import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import RgButton from "@/components/reusable/RgButton";
import "./NotFoundPage.css";

const SVG_W = 340;
const SVG_H = 300;

function ArchWatermark() {
  const ref = useRef<SVGSVGElement>(null);
  const pos = useRef({ x: 120, y: 160 });
  const vel = useRef({ x: 0.45, y: 0.32 });
  const raf = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tick = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const p = pos.current;
      const v = vel.current;

      p.x += v.x;
      p.y += v.y;

      if (p.x <= 0)          { v.x = Math.abs(v.x);  p.x = 0; }
      if (p.x >= W - SVG_W)  { v.x = -Math.abs(v.x); p.x = W - SVG_W; }
      if (p.y <= 0)          { v.y = Math.abs(v.y);  p.y = 0; }
      if (p.y >= H - SVG_H)  { v.y = -Math.abs(v.y); p.y = H - SVG_H; }

      el.style.transform = `translate(${p.x}px, ${p.y}px)`;
      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <svg
      ref={ref}
      className="nf-arch"
      width={SVG_W}
      height={SVG_H}
      viewBox="0 0 340 300"
      fill="none"
      aria-hidden="true"
    >
      {/* Ground line */}
      <line x1="20" y1="280" x2="320" y2="280" stroke="currentColor" strokeWidth="1.2" />

      {/* Main building body */}
      <rect x="80" y="160" width="180" height="120" stroke="currentColor" strokeWidth="1.2" />

      {/* Roof */}
      <polyline points="60,160 170,60 280,160" stroke="currentColor" strokeWidth="1.2" />

      {/* Chimney */}
      <rect x="210" y="80" width="20" height="40" stroke="currentColor" strokeWidth="1" />

      {/* Front door */}
      <rect x="148" y="210" width="44" height="70" stroke="currentColor" strokeWidth="1" />
      {/* Door arch */}
      <path d="M148,210 Q170,188 192,210" stroke="currentColor" strokeWidth="1" />
      {/* Door knob */}
      <circle cx="188" cy="247" r="2.5" stroke="currentColor" strokeWidth="1" />

      {/* Left window */}
      <rect x="96" y="185" width="42" height="36" stroke="currentColor" strokeWidth="1" />
      <line x1="117" y1="185" x2="117" y2="221" stroke="currentColor" strokeWidth="0.7" />
      <line x1="96"  y1="203" x2="138" y2="203" stroke="currentColor" strokeWidth="0.7" />

      {/* Right window */}
      <rect x="202" y="185" width="42" height="36" stroke="currentColor" strokeWidth="1" />
      <line x1="223" y1="185" x2="223" y2="221" stroke="currentColor" strokeWidth="0.7" />
      <line x1="202" y1="203" x2="244" y2="203" stroke="currentColor" strokeWidth="0.7" />

      {/* Columns / porch */}
      <line x1="148" y1="280" x2="148" y2="240" stroke="currentColor" strokeWidth="1" />
      <line x1="192" y1="280" x2="192" y2="240" stroke="currentColor" strokeWidth="1" />
      <line x1="140" y1="240" x2="200" y2="240" stroke="currentColor" strokeWidth="1" />

      {/* Roof ridge cap */}
      <line x1="170" y1="60" x2="170" y2="80" stroke="currentColor" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Attic window */}
      <rect x="150" y="115" width="40" height="32" stroke="currentColor" strokeWidth="0.9" />
      <path d="M150,115 Q170,100 190,115" stroke="currentColor" strokeWidth="0.9" />
      <line x1="170" y1="100" x2="170" y2="147" stroke="currentColor" strokeWidth="0.6" />

      {/* Dimension ticks left */}
      <line x1="60" y1="160" x2="50" y2="160" stroke="currentColor" strokeWidth="0.7" />
      <line x1="60" y1="280" x2="50" y2="280" stroke="currentColor" strokeWidth="0.7" />
      <line x1="55" y1="160" x2="55" y2="280" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Dimension ticks top */}
      <line x1="80"  y1="155" x2="80"  y2="145" stroke="currentColor" strokeWidth="0.7" />
      <line x1="260" y1="155" x2="260" y2="145" stroke="currentColor" strokeWidth="0.7" />
      <line x1="80"  y1="150" x2="260" y2="150" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Corner cross-hairs — blueprint feel */}
      <line x1="30" y1="20" x2="50" y2="20" stroke="currentColor" strokeWidth="0.6" />
      <line x1="40" y1="10" x2="40" y2="30" stroke="currentColor" strokeWidth="0.6" />
      <line x1="290" y1="20" x2="310" y2="20" stroke="currentColor" strokeWidth="0.6" />
      <line x1="300" y1="10" x2="300" y2="30" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

export default function NotFoundPage() {
  return (
    <main className="nf-root">
      <div className="nf-bg" aria-hidden="true">
        <div className="nf-glow nf-glow--1" />
        <div className="nf-glow nf-glow--2" />
        <div className="nf-grid" />
      </div>

      <ArchWatermark />

      <div className="nf-inner">
        <p className="nf-eyebrow">Real Gold Properties</p>

        <div className="nf-code" aria-hidden="true">
          <span>4</span>
          <span className="nf-code__zero">0</span>
          <span>4</span>
        </div>

        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-sub">
          The page you're looking for has been moved, deleted, or never existed.
          Let us help you find what you need.
        </p>

        <div className="nf-actions">
          <RgButton to="/" label="Back to Home" variant="gold" withArrow />
          <RgButton to="/properties" label="View Properties" variant="outline" withArrow className="nf-btn-outline" />
        </div>

        <div className="nf-links">
          <Link to="/about">About</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact">Contact</Link>
          <span aria-hidden="true">·</span>
          <Link to="/team">Our Team</Link>
          <span aria-hidden="true">·</span>
          <Link to="/expressions-of-interest">EOI</Link>
        </div>
      </div>
    </main>
  );
}
