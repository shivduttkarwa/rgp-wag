import React, { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import OverLayMenu from "./OverLayMenu";
import { SiteSettings } from "../../services/api";
import HomeLogo from "../UI/HomeLogo";

interface HeaderProps {
  settings: SiteSettings | null;
}

const Header: React.FC<HeaderProps> = ({ settings }) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerBgRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const publicUrl = import.meta.env.BASE_URL || "/";

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      if (headerRef.current) {
        if (isScrollingUp && currentScrollY > 100) {
          // Show header when scrolling up
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          });
          // Show background
          if (headerBgRef.current) {
            gsap.to(headerBgRef.current, {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        } else if (currentScrollY > 200) {
          // Hide header when scrolling down (after 200px)
          gsap.to(headerRef.current, {
            y: "-100%",
            duration: 0.4,
            ease: "power3.out",
          });
        }

        // Hide background when at top
        if (currentScrollY <= 100 && headerBgRef.current) {
          gsap.to(headerBgRef.current, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!headerRef.current) return;

    // Only animate on homepage
    if (location.pathname === "/" || location.pathname === publicUrl) {
      // Header starts hidden above viewport, slides down after hero video expands
      // New timing: texts (simultaneous) + video expand (1.5s) = ~3.5s total
      gsap.to(headerRef.current, {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 4.0, // Slide in after video expands
      });
    } else {
      // On other pages, header is immediately visible
      gsap.set(headerRef.current, { y: 0 });
    }
  }, [location.pathname, publicUrl]);

  return (
    <header
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transform: "translateY(-100%)",
        transition: "none",
      }}
    >
      {/* Background that appears on scroll up */}
      <div
        ref={headerBgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          opacity: 0,
          zIndex: -1,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          height: "84px",
        }}
      >
        {/* Logo - Left Side */}
        <div
          onClick={() => navigate("/")}
          className="header-logo-container"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <HomeLogo
            className="header-logo"
            style={{
              height: "80px",
              width: "auto",
              transform: "scale(2)",
              transformOrigin: "left center",
            }}
          />
        </div>

        {/* Hamburger Menu - Right Side */}
        <div className="header-hamburger-container">
          <style>
            {`
              #toggle-btn.olm-btn {
                transform: scale(0.72) translateY(-54px) !important;
              }
              
              /* Mobile Styles */
              @media (max-width: 768px) {
                .header-logo {
                  transform: scale(1.6) !important;
                  transform-origin: left center !important;
                }
                
                .header-logo-container {
                  position: absolute !important;
                  left: 6px !important; /* Pushed right by 20px (was -14px, so -14px + 20px = 6px) */
                  top: 50% !important;
                  transform: translateY(-50%) !important;
                }
                
                #toggle-btn.olm-btn {
                  transform: scale(0.94) translateY(-10px) !important;
                }
              }
              
              /* Large screens 1600px and above - increase logo size by 15% */
              @media (min-width: 1600px) {
                .header-logo {
                  transform: scale(2.3) translateY(7px) !important; /* Pushed down by 7px */
                  transform-origin: left center !important;
                }
                
                #toggle-btn.olm-btn {
                  transform: scale(0.828) translateY(-34px) !important; /* Pushed further down by 10px (was -44px, so -44px + 10px = -34px) */
                }
                
                header {
                  height: 104px !important; /* Increased by 20px (was 84px) */
                }
              }
            `}
          </style>
          <OverLayMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
