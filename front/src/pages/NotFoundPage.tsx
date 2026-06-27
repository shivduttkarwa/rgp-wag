import { Link } from "react-router-dom";
import RgButton from "@/components/reusable/RgButton";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <main className="nf-root">
      {/* Decorative background */}
      <div className="nf-bg" aria-hidden="true">
        <div className="nf-glow nf-glow--1" />
        <div className="nf-glow nf-glow--2" />
        <div className="nf-grid" />
      </div>

      <div className="nf-inner">
        <p className="nf-eyebrow">Real Gold Properties</p>

        <div className="nf-code" aria-hidden="true">
          <span>4</span>
          <span className="nf-code__zero">0</span>
          <span>4</span>
        </div>

        <div className="nf-divider" aria-hidden="true" />

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
