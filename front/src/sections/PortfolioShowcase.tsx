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

const publicUrl = import.meta.env.BASE_URL || "/";

gsap.registerPlugin(ScrollTrigger);

const getImagePath = (imageName: string) =>
  publicUrl.endsWith("/")
    ? `${publicUrl}images/${imageName}`
    : `${publicUrl}/images/${imageName}`;

export interface ShowcaseProject {
  id: string;
  title: string;
  location: string;
  price: string;
  status: string;
  thumb: string;
  bg: string;
  beds: number;
  baths: number;
  area: string;
}

interface PortfolioShowcaseProps {
  projects?: ShowcaseProject[];
  heading?: string;
}

const defaultProjects: ShowcaseProject[] = [
  {
    id: "hawcliffe-manor",
    title: "Hawcliffe Manor",
    location: "Toorak, VIC",
    price: "$4,250,000",
    status: "For Sale",
    thumb: getImagePath("ps1 (1).jpg"),
    bg: getImagePath("ps1 (1).jpg"),
    beds: 5,
    baths: 4,
    area: "3,800",
  },
  {
    id: "northshore-penthouse",
    title: "Northshore Penthouse",
    location: "North Sydney, NSW",
    price: "$3,100,000",
    status: "For Sale",
    thumb: getImagePath("ps1 (2).jpg"),
    bg: getImagePath("ps1 (2).jpg"),
    beds: 3,
    baths: 2,
    area: "2,100",
  },
  {
    id: "garden-terrace",
    title: "The Garden Terrace",
    location: "Brighton, VIC",
    price: "$2,750,000",
    status: "New Listing",
    thumb: getImagePath("ps1 (3).jpg"),
    bg: getImagePath("ps1 (3).jpg"),
    beds: 4,
    baths: 3,
    area: "2,400",
  },
  {
    id: "evoke-residences",
    title: "Evoke Residences",
    location: "South Yarra, VIC",
    price: "$1,850,000",
    status: "For Sale",
    thumb: getImagePath("ps1 (4).jpg"),
    bg: getImagePath("ps1 (4).jpg"),
    beds: 2,
    baths: 2,
    area: "1,200",
  },
  {
    id: "heritage-estate",
    title: "Heritage Estate",
    location: "Vaucluse, NSW",
    price: "$6,800,000",
    status: "Exclusive",
    thumb: getImagePath("ps1 (5).jpg"),
    bg: getImagePath("ps1 (5).jpg"),
    beds: 6,
    baths: 5,
    area: "4,500",
  },
];

const PortfolioShowcase: React.FC<PortfolioShowcaseProps> = ({
  projects = defaultProjects,
  heading: _heading = "Featured Properties",
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
          REAL GOLD PROPERTIES
        </span>
        <h3 data-gsap="char-reveal" className="rg-section-title">
          Featured <em>Properties</em>
        </h3>
        <p
          data-gsap="fade-up"
          data-gsap-delay="0.2"
          className="rg-section-subtitle"
        >
          Handpicked residences across Australia's most coveted neighbourhoods —
          every listing curated for quality, location, and lasting value.
        </p>
      </div>

      <div className="projects-wrapper">
        {projects.map((project, index) => (
          <div className="project" key={project.title}>
            {/* ── Parallax background image ── */}
            <figure className="project-bg" aria-hidden="true">
              <img src={project.bg} alt="" data-speed="0.25" />
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
                    <img src={project.thumb} alt={project.title} />
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          aria-hidden="true"
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
                          aria-hidden="true"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                        <span className="pc-feat-val">{project.area}</span>
                        <span className="pc-feat-label">Sq Ft</span>
                      </div>
                    </div>

                    <Link
                      to={`/properties/${project.id}`}
                      className="pc-view-btn"
                    >
                      <span>View Property</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>

                  {/* Decorative corner */}
                  <div className="pc-corner" aria-hidden="true" />
                </article>

                {/* ── Thumbnail ── */}
                <div className="image-wrapper">
                  <figure>
                    <img
                      src={project.thumb}
                      alt={`${project.title} interior`}
                    />
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
          {projects.map((project, index) => (
            <SwiperSlide key={project.id}>
              <article className="pc-card pf-slide-card">
                <div className="pc-topbar">
                  <span className="pc-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pc-status">{project.status}</span>
                </div>
                <div className="pc-thumb">
                  <img src={project.thumb} alt={project.title} />
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
                    to={`/properties/${project.id}`}
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
