// HomeTestimonials (Philosophy.tsx)
import { useRef, useState, useEffect } from "react";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Philosophy.css";

type Testimonial = {
  kicker: string;
  title: string;
  video: string;
  poster: string;
  tintVar: "gold" | "amber" | "crimson";
};

const TESTIMONIALS: Testimonial[] = [
  {
    kicker: "SUNNYBANK · SOLD",
    title: "SARAH M.",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/dbf16c23-6134-4df6-a509-bd2a6b79ab37/chatgpt-image-3-apr-2025-16-33-58.webp",
    tintVar: "gold",
  },
  {
    kicker: "UNDERWOOD · PURCHASED",
    title: "JAMES & LISA",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/d80b404a-7e8e-40ee-a08c-cbab3f8a7ad3/chatgpt-image-3-apr-2025-16-23-38.webp",
    tintVar: "amber",
  },
  {
    kicker: "EIGHT MILE PLAINS · APPRAISAL",
    title: "DAVID K.",
    video: `${base}vids/rgp-video.mp4`,
    poster:
      "https://files.staging.peachworlds.com/website/504aad69-04e9-4c61-8e60-4bf340ec746f/chatgpt-image-3-apr-2025-16-23-32.webp",
    tintVar: "crimson",
  },
];

function TestiCard({
  t,
  activeId,
  setActiveId,
}: {
  t: Testimonial;
  activeId: string | null;
  setActiveId: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fullPlay, setFullPlay] = useState(false);

  // Mobile: autoplay muted on mount
  useEffect(() => {
    const isMobile = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    if (isMobile && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const handleMouseEnter = () => {
    if (fullPlay) return;
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (fullPlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = false; // imperative — React's muted prop doesn't sync reliably
    setFullPlay(true);
    setActiveId(t.title);
    v.play().catch(() => {});
  };

  useEffect(() => {
    if (activeId === t.title) return;
    if (!fullPlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    v.muted = true;
    setFullPlay(false);
  }, [activeId, fullPlay, t.title]);

  return (
    <article
      className="rg-philo__card"
      data-tint={t.tintVar}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rg-philo__media">
        <video
          ref={videoRef}
          className="rg-philo__img"
          src={t.video}
          poster={t.poster}
          muted
          playsInline
          loop
          preload="none"
          controls={fullPlay}
        />
      </div>

      {!fullPlay && (
        <>
          <div className="rg-philo__overlay" aria-hidden="true" />
          <div className="rg-philo__pill">
            <div className="rg-philo__pillKicker">{t.kicker}</div>
            <div className="rg-philo__pillTitle">{t.title}</div>
          </div>
          <button
            className="rg-philo__play-btn"
            onClick={handlePlayClick}
            aria-label={`Play ${t.title} testimonial`}
          >
            <svg viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="23"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M19 16l14 8-14 8V16z" fill="currentColor" />
            </svg>
          </button>
        </>
      )}
    </article>
  );
}

export default function PhilosophyPillars() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section className="rg-philo" aria-label="Client Testimonials">
      <div className="rg-philo__wrap">
        <header className="rg-philo__head">
          <p data-gsap="fade-up" className="rg-philo__label">
            Testimonials
          </p>
          <h2
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
            className="rg-philo__title"
          >
            What Our <em>Clients</em> Say
          </h2>
        </header>

        <div className="rg-philo__divider" role="separator" />

        {/* Desktop grid */}
        <div
          data-gsap="clip-smooth-down"
          data-gsap-stagger="0.14"
          data-gsap-delay="0.1"
          className="rg-philo__grid"
        >
          {TESTIMONIALS.map((t) => (
            <TestiCard
              key={t.title}
              t={t}
              activeId={activeId}
              setActiveId={setActiveId}
            />
          ))}
        </div>

        {/* Mobile swiper */}
        <div className="rg-philo__swiper-wrap">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1.08}
            grabCursor
            speed={420}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{ 480: { slidesPerView: 1.2, spaceBetween: 20 } }}
          >
            {TESTIMONIALS.map((t, i) => (
              <SwiperSlide key={t.title}>
                <div
                  className="rg-philo__card-wrap"
                  data-gsap="clip-reveal-right"
                  data-gsap-delay={`${i * 0.15}`}
                  data-gsap-start="top 70%"
                >
                  <TestiCard
                    t={t}
                    activeId={activeId}
                    setActiveId={setActiveId}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* CTA */}
        <div className="rg-philo__cta-row">
          <Link
            to="/testimonials"
            className="rg-philo__cta-btn"
            data-gsap="btn-clip-reveal"
          >
            <span>Read All Reviews</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
