import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import type { VideoTestimonialsSection } from "@/types/homePage";
import assetUrl from "@/lib/assetUrl";
import "swiper/css";
import "swiper/css/pagination";
import "./Philosophy.css";
import RgButton from "@/components/reusable/RgButton";

type Testimonial = {
  kicker: string;
  title: string;
  video: string;
  poster: string;
  tintVar: "gold" | "amber" | "crimson";
};

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

  // Muted autoplay preview — only re-runs when the video source changes, never
  // when fullPlay changes (avoids overwriting the muted=false set by handlePlayClick)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const startMutedPreview = () => video.play().catch(() => {});
    startMutedPreview();
    video.addEventListener("canplay", startMutedPreview);

    return () => {
      video.removeEventListener("canplay", startMutedPreview);
    };
  }, [t.video]);

  // Reset this card when another card becomes active
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (activeId === t.title) return;

    video.pause();
    video.currentTime = 0;
    video.muted = true;
    setFullPlay(false);
    video.play().catch(() => {});
  }, [activeId, t.title]);

  const handleMouseEnter = () => {
    if (fullPlay) return;
    videoRef.current?.play().catch(() => {});
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    setActiveId(t.title);
    video.pause();
    video.currentTime = 0;
    video.muted = false;
    setFullPlay(true);
    video.play().catch(() => {});
  };

  return (
    <article
      className="rg-philo__card"
      data-tint={t.tintVar}
      onMouseEnter={handleMouseEnter}
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
          preload="metadata"
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

export default function PhilosophyPillars({ data }: { data?: VideoTestimonialsSection }) {
  const section = data;
  const [activeId, setActiveId] = useState<string | null>(null);
  const desktopSwiperRef = useRef<SwiperType | null>(null);
  const [swiperIndex, setSwiperIndex] = useState(0);
  const totalSwiperSlides = testimonials.length;

  if (!section?.items.length) return null;

  const testimonials =
    section.items.map((item) => ({
      kicker: item.kicker,
      title: item.name,
      video: assetUrl(item.video_url),
      poster: assetUrl(item.poster_image?.url ?? item.poster_url),
      tintVar: item.tint,
    }));
  const useDesktopSlider = testimonials.length > 3;

  return (
    <section className="rg-philo" aria-label="Client Testimonials">
      <div className="rg-philo__wrap">
        <header className="rg-philo__head">
          <p data-gsap="fade-up" className="rg-philo__label">
            {section.section_label}
          </p>
          <h2
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
            className="rg-philo__title"
          >
            {section.heading} <em>{section.heading_em}</em>
          </h2>
        </header>

        <div className="rg-philo__divider" role="separator" />

        {useDesktopSlider ? (
          <div className="rg-philo__desktop-swiper">
            <div className="rg-philo__desktop-controls">
              <div className="rg-philo__desktop-spacer" aria-hidden="true" />
              <div className="rg-philo__desktop-nav">
                <button
                  type="button"
                  className={`rg-philo__nav-btn${swiperIndex === 0 ? " rg-philo__nav-btn--disabled" : ""}`}
                  aria-label="Previous testimonial"
                  disabled={swiperIndex === 0}
                  onClick={() => desktopSwiperRef.current?.slidePrev()}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M14.5 5.5L8 12l6.5 6.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`rg-philo__nav-btn${swiperIndex >= totalSwiperSlides - 3 ? " rg-philo__nav-btn--disabled" : ""}`}
                  aria-label="Next testimonial"
                  disabled={swiperIndex >= totalSwiperSlides - 3}
                  onClick={() => desktopSwiperRef.current?.slideNext()}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M9.5 5.5L16 12l-6.5 6.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <Swiper
              modules={[Pagination]}
              spaceBetween={20}
              slidesPerView={3}
              speed={420}
              onSwiper={(swiper) => {
                desktopSwiperRef.current = swiper;
              }}
              onActiveIndexChange={(swiper) => setSwiperIndex(swiper.activeIndex)}
              pagination={{
                clickable: true,
                el: ".rg-philo__desktop-pagination",
              }}
              breakpoints={{
                981: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 3, spaceBetween: 28 },
              }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={`${t.title}-${i}`}>
                  <div
                    className="rg-philo__card-wrap"
                    data-gsap="clip-reveal-right"
                    data-gsap-delay={`${i * 0.08}`}
                    data-gsap-start="top 75%"
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
            <div className="rg-philo__desktop-pagination" />
          </div>
        ) : (
          <div
            data-gsap="clip-smooth-down"
            data-gsap-stagger="0.14"
            data-gsap-delay="0.1"
            className="rg-philo__grid"
          >
            {testimonials.map((t, i) => (
              <TestiCard
                key={`${t.title}-${i}`}
                t={t}
                activeId={activeId}
                setActiveId={setActiveId}
              />
            ))}
          </div>
        )}

        <div className="rg-philo__swiper-wrap">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1.08}
            speed={420}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{ 480: { slidesPerView: 1.2, spaceBetween: 20 } }}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={`${t.title}-${i}`}>
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

        <div className="rg-philo__cta-row">
          <RgButton
            variant="blue"
            to="/testimonials"
            label="Read All Reviews"
            arrowSize={16}
            data-gsap="btn-clip-reveal"
          />
        </div>
      </div>
    </section>
  );
}

