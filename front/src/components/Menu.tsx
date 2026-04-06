import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Phone, Share2 } from "lucide-react";
import { MAIN_NAV_ITEMS } from "./navigationItems";
import "./Menu.css";

interface MenuProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onHeaderHiddenChange?: (hidden: boolean) => void;
  showButton?: boolean;
}

export default function Menu({
  isOpen,
  onOpenChange,
  onHeaderHiddenChange,
  showButton = true,
}: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const overlayRef = useRef<HTMLElement>(null);
  const isControlled = typeof isOpen === "boolean";
  const open = isControlled ? isOpen : internalOpen;
  const navigate = useNavigate();

  const items = useMemo(
    () => [...MAIN_NAV_ITEMS],
    [],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter((item) =>
        item.label.toLowerCase().includes(normalizedQuery),
      )
    : [];

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const toggleMenu = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (open) {
      body.classList.add("menu-open");
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      body.classList.remove("menu-open");
      html.style.overflow = "";
      body.style.overflow = "";
    }
    return () => {
      body.classList.remove("menu-open");
      html.style.overflow = "";
      body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    onHeaderHiddenChange?.(false);

    if (!open) {
      overlay.scrollTop = 0;
      return;
    }

    const isMobileMenu = window.matchMedia?.("(max-width: 900px)").matches;
    if (!isMobileMenu) return;

    overlay.scrollTop = 0;

    let lastScrollTop = 0;
    let headerHidden = false;
    let hiddenAnchorScrollTop = 0;

    const updateHeader = (hidden: boolean, currentScrollTop: number) => {
      if (headerHidden === hidden) return;
      headerHidden = hidden;
      if (hidden) {
        hiddenAnchorScrollTop = currentScrollTop;
      }
      onHeaderHiddenChange?.(hidden);
    };

    const handleOverlayScroll = () => {
      const currentScrollTop = overlay.scrollTop;
      const delta = currentScrollTop - lastScrollTop;

      if (currentScrollTop <= 8) {
        updateHeader(false, currentScrollTop);
        lastScrollTop = currentScrollTop;
        return;
      }

      if (!headerHidden) {
        if (delta > 4 && currentScrollTop > 24) {
          updateHeader(true, currentScrollTop);
        }
      } else {
        if (delta > 0) {
          hiddenAnchorScrollTop = Math.max(hiddenAnchorScrollTop, currentScrollTop);
        }

        const movedUpEnough = hiddenAnchorScrollTop - currentScrollTop >= 56;
        if (movedUpEnough) {
          updateHeader(false, currentScrollTop);
        }
      }

      lastScrollTop = currentScrollTop;
    };

    overlay.addEventListener("scroll", handleOverlayScroll, { passive: true });
    return () => {
      overlay.removeEventListener("scroll", handleOverlayScroll);
      onHeaderHiddenChange?.(false);
    };
  }, [open, onHeaderHiddenChange]);

  return (
    <>
      {/* Hamburger Button */}
      {showButton && (
        <button
          className={`hamburger ${open ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <div className="hamburger-box">
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </button>
      )}

      {/* Overlay Menu */}
      <nav ref={overlayRef} className={`overlay-menu ${open ? "active" : ""}`}>
        {/* Animated Background Panels */}
        <div className="menu-bg">
          <div className="menu-bg-panel"></div>
          <div className="menu-bg-panel"></div>
          <div className="menu-bg-panel"></div>
          <div className="menu-bg-panel"></div>
        </div>

        <div className="menu-content">
          {/* Navigation */}
          <div className="menu-main">
            <ul className="menu-nav">
              {items.map(({ label, to }) => (
                <li className="menu-item" key={to}>
                  <Link to={to} className="menu-link" onClick={closeMenu}>
                    <span className="menu-text">{label}</span>
                    <svg
                      className="menu-arrow"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aside Info */}
          <aside className="menu-aside">
            <div className="menu-search">
              <span className="menu-search-label">Search</span>
              <div className="menu-search-input">
                <svg
                  className="menu-search-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4 4" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && filteredItems[0]) {
                      navigate(filteredItems[0].to);
                      closeMenu();
                    }
                  }}
                  placeholder="Find a page..."
                  aria-label="Search menu"
                />
              </div>
              <div className="menu-search-popular">
                {["Listings", "Buy", "Sell", "Rentals"].map((label) => {
                  const match = items.find(
                    (item) => item.label.toLowerCase() === label.toLowerCase(),
                  );
                  return (
                    <button
                      key={label}
                      type="button"
                      className="menu-search-chip"
                      onClick={() => {
                        if (match) {
                          navigate(match.to);
                          closeMenu();
                        } else {
                          setQuery(label);
                        }
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div
                className={`menu-search-suggestions ${
                  query.length > 0 ? "is-active" : ""
                }`}
              >
                {query.length > 0 ? (
                  filteredItems.length === 0 ? (
                    <button
                      type="button"
                      className="menu-search-item"
                      disabled
                    >
                      No results
                    </button>
                  ) : (
                    filteredItems.slice(0, 4).map((item) => (
                      <button
                        key={item.to}
                        type="button"
                        className="menu-search-item"
                        onClick={() => {
                          navigate(item.to);
                          closeMenu();
                        }}
                      >
                        {item.label}
                      </button>
                    ))
                  )
                ) : null}
              </div>
            </div>

            <div className="menu-info-row">
              <div className="menu-info-block">
                <div className="menu-info-label"><MapPin size={13} />Location</div>
                <p className="menu-info-text">
                  PO Box 4024
                  <br />
                  Forest Lake QLD 4078
                </p>
              </div>

              <div className="menu-info-block">
                <div className="menu-info-label"><Phone size={13} />Contact</div>
                <p className="menu-info-text">
                  <a href="mailto:admin@realgoldproperties.com.au">
                    admin@realgoldproperties.com.au
                  </a>
                  <br />
                  <a href="tel:+61450009291">0450 009 291</a>
                </p>
              </div>
            </div>

            <div className="menu-socialWrap">
              <div className="menu-socialLabel"><Share2 size={13} />Social</div>
              <div className="menu-social">
              <a href="#" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/realgoldproperties/"
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
                <span>Facebook</span>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.youtube.com/channel/UCYR_dNuG3WPJhg7AZAhkkvg"
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
                <span>YouTube</span>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>WhatsApp</span>
              </a>
              </div>
            </div>
            <div className="menu-cta">
              <a className="menu-ctaPrimary" href="/contact">
                Book a Consultation
              </a>
              <a className="menu-ctaSecondary" href="/services">
                View Services
              </a>
            </div>
          </aside>
        </div>

      </nav>
    </>
  );
}
