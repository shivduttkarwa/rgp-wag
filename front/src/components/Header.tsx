import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "./Menu";
import gsap from "gsap";
import { MAIN_NAV_ITEMS } from "./navigationItems";
import "./Header.css";

export default function Header({ ready = false }: { ready?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headerBgRef = useRef<HTMLDivElement>(null);
  const mobileMenuEffectInit = useRef(false);
  const location = useLocation();
  const publicUrl = import.meta.env.BASE_URL || "/";
  const logoSrc = `${import.meta.env.BASE_URL}images/RGP-logo.png`;

  const setHeaderVisible = (visible: boolean, immediate = false) => {
    if (!headerRef.current) return;
    gsap.to(headerRef.current, {
      y: visible ? 0 : "-100%",
      duration: immediate ? 0.18 : 0.28,
      ease: "power3.out",
      overwrite: true,
    });
  };

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Scroll-hide / scroll-reveal behaviour
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      if (headerRef.current) {
        if (isScrollingUp && currentScrollY > 100) {
          gsap.to(headerRef.current, { y: 0, duration: 0.4, ease: "power3.out" });
          if (headerBgRef.current) {
            gsap.to(headerBgRef.current, {
              opacity: 1, scaleY: 1, duration: 0.25, ease: "power2.out", overwrite: true,
            });
          }
        } else if (currentScrollY > 120) {
          gsap.to(headerRef.current, { y: "-100%", duration: 0.4, ease: "power3.out" });
        }

        if (currentScrollY <= 100 && headerBgRef.current) {
          gsap.to(headerBgRef.current, {
            opacity: 0, scaleY: 1, duration: 0.25, ease: "power2.out", overwrite: true,
          });
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set initial y position based on route
  useEffect(() => {
    if (!headerRef.current) return;
    if (location.pathname !== "/" && location.pathname !== publicUrl) {
      gsap.set(headerRef.current, { y: 0 });
    }
  }, [location.pathname, publicUrl]);

  // Fade header bg out when mobile menu opens, restore on close
  useEffect(() => {
    if (!headerBgRef.current) return;
    if (!mobileMenuEffectInit.current) {
      mobileMenuEffectInit.current = true;
      return;
    }

    if (mobileOpen) {
      gsap.to(headerBgRef.current, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: true });
      setHeaderVisible(true);
    } else {
      const shouldShow = window.scrollY > 100;
      gsap.to(headerBgRef.current, { opacity: shouldShow ? 1 : 0, duration: 0.3, ease: "power2.out", overwrite: true });
      setHeaderVisible(true);
    }
  }, [mobileOpen]);

  // Slide header in after hero finishes on homepage
  useEffect(() => {
    if (!ready || !headerRef.current) return;
    if (location.pathname !== "/" && location.pathname !== publicUrl) return;
    gsap.to(headerRef.current, {
      y: 0,
      duration: 0.55,
      ease: "power3.out",
      delay: 0.95,
    });
  }, [ready, location.pathname, publicUrl]);

  return (
    <>
      <header ref={headerRef} className="rg-header" aria-label="Site header">
        <div ref={headerBgRef} className="rg-header__bg" />

        <div className="rg-header__inner">
          {/* Logo */}
          <Link to="/" className="rg-header__logo" aria-label="Real Gold Properties">
            <img src={logoSrc} alt="Real Gold Properties" />
          </Link>

          {/* Desktop nav */}
          <nav className="rg-header__nav" aria-label="Main navigation">
            {MAIN_NAV_ITEMS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`rg-header__nav-link${location.pathname === to ? " is-active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA + mobile hamburger */}
          <div className="rg-header__actions">
            <Link to="/contact" className="rg-header__cta">
              <span>Book a Consultation</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>

            <button
              className={`rg-hamburger${mobileOpen ? " active" : ""}`}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((p) => !p)}
            >
              <span className="rg-hamburger__line" />
              <span className="rg-hamburger__line" />
              <span className="rg-hamburger__line" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <Menu
        isOpen={mobileOpen}
        onOpenChange={setMobileOpen}
        onHeaderHiddenChange={(hidden) => {
          if (!mobileOpen) return;
          setHeaderVisible(!hidden, true);
        }}
        showButton={false}
      />
    </>
  );
}
