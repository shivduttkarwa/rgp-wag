import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "./PortfolioShowcase.css";
import "swiper/css";
import "swiper/css/pagination";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import type { PortfolioSection } from "@/types/homePage";

const publicUrl = import.meta.env.BASE_URL || "/";
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

gsap.registerPlugin(ScrollTrigger);

const resolveUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) return `${API_BASE}${url}`;
  const base = publicUrl.endsWith("/") ? publicUrl : `${publicUrl}/`;
  return `${base}${url}`;
};

const PortfolioShowcase: React.FC<{ data: PortfolioSection }> = ({
  data,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const featureSection = sectionRef.current;
    if (!featureSection) return;

    document.body.classList.add("portfolio-active");

    const parallaxImages = featureSection.querySelectorAll<HTMLImageElement>(
      ".project > figure > img[data-speed]",
    );

    let ticking = false;
    let lastScrollY = 0;

    function handleParallax() {
      if (!parallaxImages.length) return;
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 2) return;
      lastScrollY = currentScrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          const viewportHeight = window.innerHeight;
          parallaxImages.forEach((img) => {
            const rect = img.getBoundingClientRect();
            const imgCenter = rect.top + rect.height / 2;
            const distanceFromCenter = imgCenter - viewportHeight / 2;
            const speed = parseFloat(img.dataset.speed || "0.25");
            const translateY =
              (-distanceFromCenter / viewportHeight) * 100 * speed;
            img.style.transform = `translate3d(0, ${translateY}%, 0) scale(1.05)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleParallax, { passive: true });
    window.addEventListener("load", handleParallax);
    window.addEventListener("resize", handleParallax);
    handleParallax();

    const titleLines = titleRef.current?.querySelectorAll(".line");
    if (titleLines && titleLines.length > 0) {
      gsap.set(titleLines, { yPercent: 100 });
      gsap.to(titleLines, {
        yPercent: 0,
        duration: 1.8,
        stagger: 0.8,
        ease: "power1.out",
        scrollTrigger: {
          trigger: featureSection,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    }

    return () => {
      document.body.classList.remove("portfolio-active");
      window.removeEventListener("scroll", handleParallax);
      window.removeEventListener("load", handleParallax);
      window.removeEventListener("resize", handleParallax);
    };
  }, []);

  return (
    <section className="project-feature" ref={sectionRef}>
      <div className="pf-header">
        <span data-gsap="fade-up" className="rg-eyebrow">
          {data.eyebrow}
        </span>
        <h3 data-gsap="char-reveal" className="rg-section-title">
          {data.heading} <em>{data.heading_em}</em>
        </h3>
        <p data-gsap="fade-up" data-gsap-delay="0.2" className="rg-section-subtitle">
          {data.subtitle}
        </p>
      </div>

      <div className="projects-wrapper">
        {data.projects.map((project, index) => (
          <div className="project" key={project.title}>
            <figure className="project-bg" aria-hidden="true">
              <img src={resolveUrl(project.image?.url ?? project.image_url)} alt="" data-speed="0.25" />
            </figure>

            <div className="content">
              <div className="sticky">
                {/* ── Property Card ── */}
                <article className="pc-card">
                  {/* Top bar */}
                  <div className="pc-topbar">
                    <span className="pc-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pc-status">{project.status}</span>
                  </div>

                  {/* Thumb strip */}
                  <div className="pc-thumb">
                    <img src={resolveUrl(project.image?.url ?? project.image_url)} alt={project.title} />
                    <div className="pc-price-tag">{project.price}</div>
                  </div>

                  {/* Content */}
                  <div className="pc-content">
                    <div className="pc-location">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{project.location}</span>
                    </div>

                    <h2 className="pc-title" ref={titleRef}>
                      {project.title}
                    </h2>

                    <div className="pc-divider" />

                    <div className="pc-features">
                      <div className="pc-feat">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
                        >
                          <path d="M3 22V8l9-6 9 6v14H3z" />
                          <path d="M9 22V12h6v10" />
                        </svg>
                        <span className="pc-feat-val">{project.beds}</span>
                        <span className="pc-feat-label">Beds</span>
                      </div>
                      <div className="pc-feat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                          <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
                        </svg>
                        <span className="pc-feat-val">{project.baths}</span>
                        <span className="pc-feat-label">Baths</span>
                      </div>
                      <div className="pc-feat">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                        <span className="pc-feat-val">{project.area}</span>
                        <span className="pc-feat-label">Sq Ft</span>
                      </div>
                    </div>

                    <Link
                      to={project.property_slug ? `/properties/${project.property_slug}` : "/properties"}
                      className="pc-view-btn"
                    >
                      <span>View Property</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div className="pc-corner" aria-hidden="true" />
                </article>

                <div className="image-wrapper">
                  <figure>
                    <img src={resolveUrl(project.image?.url ?? project.image_url)} alt={`${project.title} interior`} />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mobile Swiper (hidden on desktop) ── */}
      <div className="pf-mobile-swiper">
        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={1.08}
          grabCursor={true}
          speed={420}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            480: { slidesPerView: 1.15, spaceBetween: 20 },
          }}
          className="pf-swiper"
        >
          {data.projects.map((project, index) => (
            <SwiperSlide key={project.title}>
              <article className="pc-card pf-slide-card">
                <div className="pc-topbar">
                  <span className="pc-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pc-status">{project.status}</span>
                </div>
                <div className="pc-thumb">
                  <img src={resolveUrl(project.image?.url ?? project.image_url)} alt={project.title} />
                  <div className="pc-price-tag">{project.price}</div>
                </div>
                <div className="pc-content">
                  <div className="pc-location">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{project.location}</span>
                  </div>
                  <h2 className="pc-title">{project.title}</h2>
                  <div className="pc-divider" />
                  <div className="pc-features">
                    <div className="pc-feat">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3 22V8l9-6 9 6v14H3z" />
                        <path d="M9 22V12h6v10" />
                      </svg>
                      <span className="pc-feat-val">{project.beds}</span>
                      <span className="pc-feat-label">Beds</span>
                    </div>
                    <div className="pc-feat">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" />
                        <path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" />
                      </svg>
                      <span className="pc-feat-val">{project.baths}</span>
                      <span className="pc-feat-label">Baths</span>
                    </div>
                    <div className="pc-feat">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                      <span className="pc-feat-val">{project.area}</span>
                      <span className="pc-feat-label">Sq Ft</span>
                    </div>
                  </div>
                  <Link
                    to={project.property_slug ? `/properties/${project.property_slug}` : "/properties"}
                    className="pc-view-btn"
                  >
                    <span>View Property</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="pc-corner" aria-hidden="true" />
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default PortfolioShowcase;
