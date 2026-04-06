import { Link } from "react-router-dom";
import "./Intro.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const Intro = () => {
  return (
    <section className="intro">
      {/* Left: Content */}
      <div className="intro-content">
        <span className="intro-label" data-gsap="fade-up">
          About the Founder
        </span>

        <h1
          className="intro-headline"
          data-gsap="char-reveal"
          data-gsap-start="top 85%"
        >
          Building Wealth
          <br />
          Through Property,
          <span className="founder">— Rahul Singh</span>
        </h1>

        <p className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
          Real Gold Properties is a vision turned reality — a private equity
          approach to multi-family real estate. Founded by Rahul Singh, we focus
          on disciplined acquisitions that deliver consistent returns.
        </p>

        <div className="intro-cta-group">
          <Link
            to="/contact"
            className="intro-cta intro-cta--primary"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          >
            <span>Book a Free Appraisal</span>
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            to="/about"
            className="intro-cta intro-cta--ghost"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.3"
          >
            <span>Meet Rahul</span>
          </Link>
        </div>
      </div>

      {/* Right: Image */}
      <div
        className="intro-image"
        data-gsap="clip-reveal-right"
        data-gsap-start="top 60%"
      >
        <img
          src={`${base}images/rahul-singh.jpg`}
          alt="Rahul Singh — Real Gold Properties"
        />

        {/* Bottom gradient */}
        <div className="intro-img-gradient" />

        {/* Corner brackets */}
        <div className="intro-img-corner intro-img-corner--tl" />
        <div className="intro-img-corner intro-img-corner--br" />
      </div>
    </section>
  );
};

export default Intro;
