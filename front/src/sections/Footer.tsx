// Footer.tsx
import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  ready?: boolean;
}

const Footer = ({ ready = false }: FooterProps) => {
  const location = useLocation();
  const footerRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  const handleSamePage = (to: string) => (e: React.MouseEvent) => {
    if (location.pathname === to) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Hide letters before first paint — no flicker
  useLayoutEffect(() => {
    const letters = watermarkRef.current?.querySelectorAll<HTMLElement>(
      ".rg-footer__watermark-letter",
    );
    if (letters?.length) gsap.set(letters, { yPercent: 110, opacity: 0 });
  }, []);

  // Only set up ScrollTrigger once the preloader is done and the full
  // page layout (lazy routes) has painted — otherwise the footer is
  // near the top of an almost-empty page and the trigger fires while hidden.
  useEffect(() => {
    if (!ready) return;

    const watermark = watermarkRef.current;
    if (!watermark) return;

    const letters = watermark.querySelectorAll<HTMLElement>(
      ".rg-footer__watermark-letter",
    );
    if (!letters.length) return;

    // Small delay to let lazy-loaded page content fully render and
    // give ScrollTrigger accurate scroll dimensions.
    const timerId = setTimeout(() => {
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 60%",
          end: "bottom bottom",
          scrub: 1,
          onEnter: () => watermark.classList.add("is-visible"),
          onLeaveBack: () => watermark.classList.remove("is-visible"),
        },
      });

      tl.to(letters, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.06,
        duration: 1,
        ease: "none",
      });
    }, 150);

    return () => {
      clearTimeout(timerId);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]);

  const watermarkLetters = ["R", "E", "A", "L", " ", "G", "O", "L", "D"];

  return (
    <footer className="rg-footer" ref={footerRef}>
      <div className="rg-footer__border" />

      {/* Main Footer Grid */}
      <div className="rg-footer__main">
        {/* Brand */}
        <div className="rg-footer__brand">
          <Link to="/" className="rg-footer__logo" onClick={handleSamePage("/")}>
            <img
              src={`${import.meta.env.BASE_URL}images/RGP-logo.png`}
              alt="Real Gold Properties"
              className="rg-footer__logo-img"
            />
          </Link>

          <p className="rg-footer__brand-desc">
            Elevating real estate experiences since 2012. Connecting discerning
            buyers with extraordinary properties across Queensland.
          </p>

          {/* Trust badges removed */}
        </div>

        {/* Properties */}
        <nav className="rg-footer__col">
          <h4>Properties</h4>
          <ul className="rg-footer__links">
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Luxury Villas</Link>
            </li>
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Apartments</Link>
            </li>
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Penthouses</Link>
            </li>
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Commercial</Link>
            </li>
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Off-Plan</Link>
            </li>
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Townhouses</Link>
            </li>
          </ul>
        </nav>

        {/* Company */}
        <nav className="rg-footer__col rg-footer__col--company">
          <h4>Company</h4>
          <ul className="rg-footer__links">
            <li>
              <Link to="/" onClick={handleSamePage("/")}>Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={handleSamePage("/about")}>About</Link>
            </li>
            <li>
              <Link to="/properties" onClick={handleSamePage("/properties")}>Properties</Link>
            </li>
            <li>
              <Link to="/testimonials" onClick={handleSamePage("/testimonials")}>Testimonials</Link>
            </li>
            <li>
              <Link to="/team" onClick={handleSamePage("/team")}>Team</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Contact</Link>
            </li>
          </ul>
        </nav>

        {/* Services */}
        <nav className="rg-footer__col">
          <h4>Services</h4>
          <ul className="rg-footer__links">
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Buy Property</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Sell Property</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Property Management</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Investment Advisory</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Mortgage Help</Link>
            </li>
            <li>
              <Link to="/contact" onClick={handleSamePage("/contact")}>Valuation</Link>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <div className="rg-footer__contact">
          <h4>Get in Touch</h4>

          <a href="tel:+61450009291" className="rg-footer__contact-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            0450 009 291
          </a>

          <a
            href="mailto:admin@realgoldproperties.com.au"
            className="rg-footer__contact-item"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            admin@realgoldproperties.com.au
          </a>

          <div className="rg-footer__contact-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            PO Box 4024, Forest Lake QLD 4078
          </div>

          <div className="rg-footer__socials">
            <a href="#" className="rg-footer__social" aria-label="Instagram">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/realgoldproperties/"
              className="rg-footer__social"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a href="#" className="rg-footer__social" aria-label="LinkedIn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/channel/UCYR_dNuG3WPJhg7AZAhkkvg"
              className="rg-footer__social"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            <a href="#" className="rg-footer__social" aria-label="WhatsApp">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="rg-footer__divider">
        <div className="rg-footer__divider-line" />
      </div>

      {/* Bottom Bar */}
      <div className="rg-footer__bottom">
        <p className="rg-footer__copyright">
          © 2026 Real Gold Properties. All rights reserved.
        </p>

        <ul className="rg-footer__legal">
          <li>
            <Link to="/privacy" onClick={handleSamePage("/privacy")}>Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms" onClick={handleSamePage("/terms")}>Collection Notice for Privacy Purposes and Consent</Link>
          </li>
        </ul>
      </div>

      {/* Big Watermark Text */}
      <div className="rg-footer__watermark" ref={watermarkRef}>
        <div className="rg-footer__watermark-text">
          {watermarkLetters.map((letter, index) =>
            letter === " " ? (
              <span key={index} className="rg-footer__watermark-space" />
            ) : (
              <span
                key={index}
                className="rg-footer__watermark-letter"
                data-letter={letter}
                style={{ "--index": index } as React.CSSProperties}
              >
                {letter}
              </span>
            ),
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
