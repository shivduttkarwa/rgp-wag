import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./About.css";
import PropertySlider from "./PropertySlider";

type AboutProps = {
  introKicker?: string;
  introHeadline?: string;

  splitKicker?: string;
  splitTitle?: string;
  splitBody?: string;
  splitImageSlides?: string[];
};

type AutoSliderProps = {
  images: string[];
  alt: string;
  imgClassName?: string;
  heightClassName?: string;
};

const AutoSlider: React.FC<AutoSliderProps> = ({
  images,
  alt,
  imgClassName = "",
  heightClassName = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const prevIndexRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const timerRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsActive(true);
      },
      { root: null, threshold: 0.35 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) return;

    slidesRef.current.forEach((slide, idx) => {
      if (!slide) return;
      gsap.set(slide, {
        xPercent: idx === 0 ? 0 : 100,
        autoAlpha: idx === 0 ? 1 : 0,
        zIndex: idx === 0 ? 2 : 1,
      });

      const img = imagesRef.current[idx];
      if (img) gsap.set(img, { xPercent: 0 });
    });
  }, [images]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (!isActive) return;

    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      directionRef.current = 1;
      setIndex((prev) => (prev + 1) % images.length);
    }, 5200);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, images, isActive]);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    if (!isActive) return;

    const prevIndex = prevIndexRef.current;
    if (prevIndex === index) return;

    const prevSlide = slidesRef.current[prevIndex];
    const nextSlide = slidesRef.current[index];
    if (!prevSlide || !nextSlide) return;

    const dir = directionRef.current;
    const enterFrom = dir === 1 ? 100 : -100;
    const exitTo = dir === 1 ? -15 : 15;
    gsap.set(nextSlide, { autoAlpha: 1, xPercent: enterFrom, zIndex: 3 });
    gsap.set(prevSlide, { autoAlpha: 1, zIndex: 2 });

    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: "power3.out" },
    });

    tl.to(nextSlide, { xPercent: 0 }, 0);
    tl.to(prevSlide, { xPercent: exitTo, duration: 0.8, ease: "power2.out" }, 0);

    tl.set(prevSlide, { xPercent: 0, zIndex: 1 });

    prevIndexRef.current = index;
  }, [index, isActive, images]);

  return (
    <div
      className={`rg-about__slider ${heightClassName}`}
      aria-live="off"
      ref={containerRef}
    >
      {images.map((src, idx) => (
        <div
          key={`${src}-${idx}`}
          className="rg-about__slide"
          ref={(el) => {
            if (el) slidesRef.current[idx] = el;
          }}
          aria-hidden={idx !== index}
        >
          <img
            ref={(el) => {
              if (el) imagesRef.current[idx] = el;
            }}
            className={`rg-about__slideImg ${imgClassName}`}
            src={src}
            alt={alt}
            loading={idx === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="rg-about__sliderPagination" role="tablist">
        {images.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            className={`rg-about__sliderDot ${idx === index ? "is-active" : ""}`}
            aria-label={`Go to slide ${idx + 1}`}
            aria-pressed={idx === index}
            onClick={() => {
              directionRef.current = idx >= index ? 1 : -1;
              setIndex(idx);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const About: React.FC<AboutProps> = ({
  introKicker = "REAL GOLD PROPERTIES",
  introHeadline = "A modern real estate partner — buying, selling, and renting with local expertise and genuine care.",

  splitKicker = "LOCAL ADVANTAGE",
  splitTitle = "A TEAM THAT KNOWS THE MARKET.\nA PROCESS THAT FEELS EASY.",
  splitBody = "We blend sharp pricing strategy with high-touch support — so sellers feel confident, buyers feel informed, and renters feel taken care of. Clear timelines, quick updates, and zero confusion.",
  splitImageSlides = [
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=85",
  ],
}) => {
  return (
    <section className="rg-about" aria-label="About Real Gold Properties">
      {/* 1) Big centered intro statement */}
      <div className="rg-about__intro">
        <div className="rg-about__kicker" data-gsap="fade-up">
          {introKicker}
        </div>
        <h2
          className="rg-about__headline"
          data-gsap="word-write"
          data-gsap-delay="0.1"
        >
          {introHeadline}
        </h2>
      </div>

      {/* 2) Full-width property slider (replaces two-column feature) */}
      <PropertySlider />

      {/* 3) Single split: left image, right content */}
      <div className="rg-about__split rg-about__watermark--arch">
        <div className="rg-about__splitInner">
          <figure
            className="rg-about__splitFigure"
            data-gsap="clip-smooth-down"
            data-gsap-start="top 95%"
          >
            <AutoSlider
              images={splitImageSlides}
              alt="Neighbourhood lifestyle"
              imgClassName="rg-about__splitImg"
              heightClassName="rg-about__splitImg"
            />
          </figure>

          <div className="rg-about__splitCopy">
            <div className="rg-about__eyebrow" data-gsap="fade-up">
              {splitKicker}
            </div>

            <h3
              className="rg-about__splitTitle"
              data-gsap="fade-up"
              data-gsap-delay="0.1"
            >
              {splitTitle.split("\n").map((line, idx) => (
                <span key={idx} className="rg-about__splitLine">
                  {line}
                </span>
              ))}
            </h3>

            <p
              className="rg-about__body"
              data-gsap="fade-up"
              data-gsap-delay="0.2"
            >
              {splitBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
