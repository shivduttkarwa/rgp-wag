import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "./Menu";
import RgButton from "./reusable/RgButton";
import gsap from "gsap";
import { MAIN_NAV_ITEMS } from "./navigationItems";
import "./Header.css";

export default function Header({ ready = false }: { ready?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headerBgRef = useRef<HTMLDivElement>(null);
  const mobileMenuEffectInit = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollHideEnabledRef = useRef(false);
  const location = useLocation();
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

  // Enable scroll-hide only after the preloader has fully exited and the browser's
  // scroll restoration has settled. Before this point, scroll events are only used
  // to keep lastScrollYRef in sync, never to hide/show the header.
  useEffect(() => {
    if (!ready) return;
    // Preloader exit animation takes ~1 s after onComplete fires (which sets ready=true).
    // Adding 500 ms buffer → 1.5 s total gives scroll restoration time to settle.
    const t = window.setTimeout(() => {
      scrollHideEnabledRef.current = true;
    }, 1500);
    return () => window.clearTimeout(t);
  }, [ready]);

  // Scroll-hide / scroll-reveal behaviour
  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // While the preloader is still active (or settling), keep lastScrollY
      // in sync but don't execute any hide / show logic.
      if (!scrollHideEnabledRef.current) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const isScrollingUp = currentScrollY < lastScrollYRef.current;

      if (headerRef.current) {
        if (isScrollingUp && currentScrollY > 100) {
          gsap.to(headerRef.current, { y: 0, duration: 0.4, ease: "power3.out", overwrite: true });
          if (headerBgRef.current) {
            gsap.to(headerBgRef.current, {
              opacity: 1, scaleY: 1, duration: 0.25, ease: "power2.out", overwrite: true,
            });
          }
        } else if (currentScrollY > 120) {
          gsap.to(headerRef.current, { y: "-100%", duration: 0.4, ease: "power3.out", overwrite: true });
        }

        if (currentScrollY <= 100 && headerBgRef.current) {
          gsap.to(headerBgRef.current, {
            opacity: 0, scaleY: 1, duration: 0.25, ease: "power2.out", overwrite: true,
          });
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


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
            <RgButton
              variant="gold"
              to="/contact"
              label="Book a Consultation"
              className="rg-header__cta"
            />

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
