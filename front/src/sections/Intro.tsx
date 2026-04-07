import { Link } from "react-router-dom";
import type { IntroSection } from "@/types/homePage";
import "./Intro.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const base = import.meta.env.BASE_URL?.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const resolveUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) return `${API_BASE}${url}`;
  return `${base}${url}`;
};

const Intro = ({ data }: { data: IntroSection }) => {
  return (
    <section className="intro">
      <div className="intro-content">
        <span className="intro-label" data-gsap="fade-up">
          {data.label}
        </span>

        <h1
          className="intro-headline"
          data-gsap="char-reveal"
          data-gsap-start="top 85%"
        >
          {data.headline_line1}
          <br />
          {data.headline_line2}
          <span className="founder">{data.founder_name}</span>
        </h1>

        <p className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
          {data.body}
        </p>

        <div className="intro-cta-group">
          <Link
            to={data.primary_cta.href}
            className="intro-cta intro-cta--primary"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          >
            <span>{data.primary_cta.label}</span>
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>

          {data.secondary_cta.label && (
            <Link
              to={data.secondary_cta.href}
              className="intro-cta intro-cta--ghost"
              data-gsap="btn-clip-reveal"
              data-gsap-delay="0.3"
            >
              <span>{data.secondary_cta.label}</span>
            </Link>
          )}
        </div>
      </div>

      <div
        className="intro-image"
        data-gsap="clip-reveal-right"
        data-gsap-start="top 60%"
      >
        <img src={resolveUrl(data.image?.url ?? data.image_url)} alt={data.founder_name} />
        <div className="intro-img-gradient" />
        <div className="intro-img-corner intro-img-corner--tl" />
        <div className="intro-img-corner intro-img-corner--br" />
      </div>
    </section>
  );
};

export default Intro;
