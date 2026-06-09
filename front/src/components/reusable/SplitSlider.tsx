import React, { useEffect, useRef, useState, useCallback } from "react";
import Swiper from "swiper";
import { Parallax } from "swiper/modules";
import { gsap } from "gsap";
import "swiper/css";
import "./SplitSlider.css";

// Types
export interface SlideContent {
  kicker: string;
  titleLines: string[];
  description: string;
  linkText: string;
  linkUrl?: string; // omit for review/author attribution (no link rendered)
  image: string;
  theme:
    | "theme-1"
    | "theme-2"
    | "theme-3"
    | "theme-4"
    | "theme-5"
    | "theme-6"
    | "theme-7"
    | "theme-8"
    | "theme-9"
    | "theme-10";
}

interface SplitSliderProps {
  slides?: SlideContent[];
  className?: string;
}

// Arrow Icon Component
const ArrowIcon: React.FC<{ direction?: "left" | "right" }> = ({
  direction = "right",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`rgp-slider__btn-icon ${direction === "left" ? "rgp-slider__btn-icon--left" : ""}`}
  >
    <path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Link Arrow Icon
const LinkArrowIcon: React.FC = () => (
  <svg
    viewBox="0 0 21 16"
    xmlns="http://www.w3.org/2000/svg"
    className="rgp-slider__link-icon"
  >
    <path d="M20.7071 8.70711C21.0976 8.31658 21.0976 7.68342 20.7071 7.29289L14.3431 0.928932C13.9526 0.538408 13.3195 0.538408 12.9289 0.928932C12.5384 1.31946 12.5384 1.95262 12.9289 2.34315L18.5858 8L12.9289 13.6569C12.5384 14.0474 12.5384 14.6805 12.9289 15.0711C13.3195 15.4616 13.9526 15.4616 14.3431 15.0711L20.7071 8.70711ZM0 9H20V7H0V9Z" />
  </svg>
);

const SplitSlider: React.FC<SplitSliderProps> = ({
  slides = [],
  className = "",
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const picSwiperRef = useRef<Swiper | null>(null);
  const picSwiperContainerRef = useRef<HTMLDivElement>(null);
  const textSlidesRef = useRef<(HTMLDivElement | null)[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTheme, setActiveTheme] = useState(slides[0]?.theme || "theme-1");

  const totalSlides = slides.length;

  // Initialize Swiper
  useEffect(() => {
    if (!totalSlides || !picSwiperContainerRef.current) return;

    picSwiperRef.current = new Swiper(picSwiperContainerRef.current, {
      modules: [Parallax],
      direction: "vertical",
      speed: 900,
      parallax: true,
      slidesPerView: 1,
      allowTouchMove: false,
      watchSlidesProgress: true,
    });

    return () => {
      picSwiperRef.current?.destroy();
    };
  }, [totalSlides]);

  // Go to slide function
  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      if (index < 0 || index >= totalSlides) return;
      if (index === currentIndex) return;

      setIsAnimating(true);

      const direction = index > currentIndex ? 1 : -1;
      const currentSlide = textSlidesRef.current[currentIndex];
      const nextSlide = textSlidesRef.current[index];

      if (!currentSlide || !nextSlide) return;

      // Update theme
      const newTheme = slides[index].theme;
      setActiveTheme(newTheme);

      // Animate image slider
      picSwiperRef.current?.slideTo(index);

      // Get animation items
      const currentItems = currentSlide.querySelectorAll(
        ".rgp-slider__anim-item",
      );
      const nextItems = nextSlide.querySelectorAll(".rgp-slider__anim-item");

      // Create timeline
      const tl = gsap.timeline({
        onComplete: () => {
          currentSlide.classList.remove("is-active");
          nextSlide.classList.add("is-active");
          setCurrentIndex(index);
          setIsAnimating(false);
        },
      });

      // Show next slide container
      gsap.set(nextSlide, {
        opacity: 1,
        visibility: "visible",
        pointerEvents: "auto",
      });

      // Set initial state for incoming items
      gsap.set(nextItems, {
        y: direction * 60,
        opacity: 0,
      });

      // Animate OUT current items
      tl.to(currentItems, {
        y: direction * -50,
        opacity: 0,
        duration: 0.5,
        stagger: {
          each: 0.05,
          from: direction > 0 ? "start" : "end",
        },
        ease: "power3.in",
      });

      // Animate IN next items
      tl.to(
        nextItems,
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: {
            each: 0.08,
            from: direction > 0 ? "start" : "end",
          },
          ease: "power3.out",
        },
        "-=0.2",
      );

      // Hide current slide after animation
      tl.set(
        currentSlide,
        {
          opacity: 0,
          visibility: "hidden",
          pointerEvents: "none",
        },
        "-=0.4",
      );
    },
    [currentIndex, isAnimating, totalSlides, slides],
  );

  // Navigation handlers
  const handlePrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const handleNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        goToSlide(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        goToSlide(currentIndex - 1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, goToSlide]);

  if (!slides.length) return null;

  return (
    <section
      ref={sectionRef}
      className={`rgp-slider rgp-slider--${activeTheme} ${className}`}
    >
      <div className="rgp-slider__row">
        {/* LEFT: Image Slider */}
        <div className="rgp-slider__media">
          <div
            className="swiper rgp-slider__media-swiper"
            ref={picSwiperContainerRef}
          >
            <div className="swiper-wrapper">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="swiper-slide rgp-slider__media-slide"
                  {...(index === 0 ? { "data-gsap": "clip-smooth-down", "data-gsap-start": "top 70%" } : {})}
                >
                  <img
                    className="rgp-slider__media-img"
                    data-swiper-parallax-y="80%"
                    src={slide.image}
                    alt={slide.titleLines.join(" ")}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Text Content */}
        <div className="rgp-slider__content">
          <div className="rgp-slider__content-inner">
            {slides.map((slide, index) => (
              <div
                key={index}
                ref={(el) => {
                  textSlidesRef.current[index] = el;
                }}
                className={`rgp-slider__text-slide ${index === 0 ? "is-active" : ""}`}
                data-theme={slide.theme}
              >
                <div className="rgp-slider__text-card">
                  <h3
                    className="rgp-slider__kicker rgp-slider__anim-item"
                    {...(index === 0 ? { "data-gsap": "fade-up", "data-gsap-start": "top 70%", "data-gsap-delay": "0" } : {})}
                  >
                    {slide.kicker}
                  </h3>
                  <h2 className="rgp-slider__title">
                    {slide.titleLines.map((line, lineIndex) => (
                      <span key={lineIndex} className="rgp-slider__title-line">
                        <span
                          className="rgp-slider__title-inner rgp-slider__anim-item"
                          {...(index === 0 ? { "data-gsap": "fade-up", "data-gsap-start": "top 70%", "data-gsap-delay": `${0.1 + lineIndex * 0.1}` } : {})}
                        >
                          {line}
                        </span>
                      </span>
                    ))}
                  </h2>
                  <div className="rgp-slider__desc-wrap">
                    <p
                      className="rgp-slider__desc rgp-slider__anim-item"
                      {...(index === 0 ? { "data-gsap": "fade-up", "data-gsap-start": "top 70%", "data-gsap-delay": "0.4" } : {})}
                    >
                      {slide.description}
                    </p>
                  </div>
                  <div className="rgp-slider__link-wrap">
                    {slide.linkUrl ? (
                      <a
                        href={slide.linkUrl}
                        className="rgp-slider__link rgp-slider__anim-item"
                        {...(index === 0 ? { "data-gsap": "fade-up", "data-gsap-start": "top 70%", "data-gsap-delay": "0.5" } : {})}
                      >
                        <LinkArrowIcon />
                        <span>{slide.linkText}</span>
                      </a>
                    ) : (
                      <span
                        className="rgp-slider__author rgp-slider__anim-item"
                        {...(index === 0 ? { "data-gsap": "fade-up", "data-gsap-start": "top 70%", "data-gsap-delay": "0.5" } : {})}
                      >
                        {slide.linkText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Bottom of Content */}
          <div className="rgp-slider__nav">
            <button
              className={`rgp-slider__btn rgp-slider__btn--prev ${currentIndex === 0 ? "is-disabled" : ""}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <ArrowIcon direction="left" />
            </button>

            <div className="rgp-slider__counter">
              <span className="rgp-slider__counter-current">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="rgp-slider__counter-sep">/</span>
              <span className="rgp-slider__counter-total">
                {String(totalSlides).padStart(2, "0")}
              </span>
            </div>

            <button
              className={`rgp-slider__btn rgp-slider__btn--next ${currentIndex === totalSlides - 1 ? "is-disabled" : ""}`}
              onClick={handleNext}
              disabled={currentIndex === totalSlides - 1}
              aria-label="Next slide"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitSlider;
