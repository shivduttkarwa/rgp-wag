import { Link } from "react-router-dom";
import RgButton from "@/components/reusable/RgButton";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <main className="nf-root">
      <div className="nf-bg" aria-hidden="true">
        <div className="nf-bg__circle nf-bg__circle--1" />
        <div className="nf-bg__circle nf-bg__circle--2" />
      </div>

      <div className="nf-inner">
        <div className="nf-code" aria-hidden="true">
          <span className="nf-code__4">4</span>
          <span className="nf-code__0">0</span>
          <span className="nf-code__4">4</span>
        </div>

        <div className="nf-divider" aria-hidden="true" />

        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-sub">
          The page you're looking for has been moved, deleted, or never existed.
          <br />
          Let us help you find what you need.
        </p>

        <div className="nf-actions">
          <RgButton to="/" label="Back to Home" variant="blue" withArrow={false} />
          <RgButton to="/properties" label="View Properties" variant="outline" withArrow={false} />
        </div>

        <div className="nf-links">
          <Link to="/about">About Us</Link>
          <span aria-hidden="true">·</span>
          <Link to="/contact">Contact</Link>
          <span aria-hidden="true">·</span>
          <Link to="/expressions-of-interest">EOI</Link>
        </div>
      </div>
    </main>
  );
}
