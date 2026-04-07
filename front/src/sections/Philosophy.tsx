import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { VideoTestimonialsSection, VideoTestimonialItem } from "@/types/homePage";
import "swiper/css";
import "swiper/css/pagination";
import "./Philosophy.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

const resolveUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) return `${API_BASE}${url}`;
  return `${base}${url}`;
};

function TestiCard({
  t,
  activeId,
  setActiveId,
}: {
  t: VideoTestimonialItem;
  activeId: string | null;
  setActiveId: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fullPlay, setFullPlay] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
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
    v.muted = false;
    setFullPlay(true);
    setActiveId(t.name);
    v.play().catch(() => {});
  };

  useEffect(() => {
    if (activeId === t.name || !fullPlay) return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    v.muted = true;
    setFullPlay(false);
  }, [activeId, fullPlay, t.name]);

  return (
    <article
      className="rg-philo__card"
      data-tint={t.tint}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="rg-philo__media">
        <video
          ref={videoRef}
          className="rg-philo__img"
          src={resolveUrl(t.video_url)}
          poster={resolveUrl(t.poster_image?.url ?? t.poster_url)}
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
            <div className="rg-philo__pillTitle">{t.name}</div>
          </div>
          <button
            className="rg-philo__play-btn"
            onClick={handlePlayClick}
            aria-label={`Play ${t.name} testimonial`}
          >
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="23" stroke="currentColor" strokeWidth="1.5" />
              <path d="M19 16l14 8-14 8V16z" fill="currentColor" />
            </svg>
          </button>
        </>
      )}
    </article>
  );
}

export default function PhilosophyPillars({ data }: { data: VideoTestimonialsSection }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!data.items.length) return null;

  return (
    <section className="rg-philo" aria-label="Client Testimonials">
      <div className="rg-philo__wrap">
        <header className="rg-philo__head">
          <p data-gsap="fade-up" className="rg-philo__label">
            {data.section_label}
          </p>
          <h2
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
            className="rg-philo__title"
          >
            {data.heading} <em>{data.heading_em}</em>
          </h2>
        </header>

        <div className="rg-philo__divider" role="separator" />

        <div
          data-gsap="clip-smooth-down"
          data-gsap-stagger="0.14"
          data-gsap-delay="0.1"
          className="rg-philo__grid"
        >
          {data.items.map((t) => (
            <TestiCard key={t.name} t={t} activeId={activeId} setActiveId={setActiveId} />
          ))}
        </div>

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
            {data.items.map((t, i) => (
              <SwiperSlide key={t.name}>
                <div
                  className="rg-philo__card-wrap"
                  data-gsap="clip-reveal-right"
                  data-gsap-delay={`${i * 0.15}`}
                  data-gsap-start="top 70%"
                >
                  <TestiCard t={t} activeId={activeId} setActiveId={setActiveId} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="rg-philo__cta-row">
          <Link to="/testimonials" className="rg-philo__cta-btn" data-gsap="btn-clip-reveal">
            <span>Read All Reviews</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
