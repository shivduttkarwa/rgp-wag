import { useEffect, useRef, useState } from "react";
import InternalPageHero from "@/sections/InternalPageHero";
import RgButton from "@/components/reusable/RgButton";
import { renderHeroAccentTokens } from "@/lib/heroTokens";

import "./AboutPage.css";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAboutPage } from "@/hooks/useAboutPage";
import assetUrl from "@/lib/assetUrl";
import RgpCta from "@/components/reusable/RgpCta";
import EoiCta from "@/components/reusable/eoi-cta";

export default function AboutPage({ ready = false }: { ready?: boolean }) {
  const { data } = useAboutPage();
  const { sections } = data;
  const pageRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLHeadingElement | null>(null);
  const splitVideoRef = useRef<HTMLVideoElement | null>(null);
  const [splitFullPlay, setSplitFullPlay] = useState(false);

  useEffect(() => {
    const video = splitVideoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    const tryPlay = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay can be blocked on some devices.
      }
    };
    void tryPlay();
  }, []);

  const handleSplitPlayClick = () => {
    const video = splitVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    setSplitFullPlay(true);
    video.play().catch(() => {});
  };

  useEffect(() => {
    // Clear one-time init guards so StrictMode's double-invoke doesn't skip animations
    const guards = [
      "clipRevealInit",
      "clipRevealRtlInit",
      "clipRevealTopInit",
      "clipRevealLeftInit",
      "clipRevealRightInit",
      "wordRevealInit",
      "wordWriteInit",
      "clipSmoothInit",
      "clipSmoothDownInit",
      "charRevealInit",
    ];
    guards.forEach((key) => {
      pageRef.current
        ?.querySelectorAll<HTMLElement>(
          `[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}]`,
        )
        .forEach((el) => delete el.dataset[key]);
    });

    const cleanup = initGsapSwitchAnimations(pageRef.current);
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    if (!sections.intro?.statement) return;
    gsap.registerPlugin(ScrollTrigger);
    const el = introRef.current;
    if (!el || el.dataset.wordReveal === "true") return;
    el.dataset.wordReveal = "true";

    // Walk nodes recursively, wrapping each word in overflow:hidden + inner
    // span for the clip-up reveal — preserves child elements like gold-word spans.
    const processNode = (node: Node, parent: HTMLElement) => {
      if (node.nodeType === Node.TEXT_NODE) {
        (node.textContent || "").split(/(\s+)/).forEach((part) => {
          if (/^\s+$/.test(part)) {
            parent.appendChild(document.createTextNode(part));
          } else if (part) {
            const outer = document.createElement("span");
            outer.style.cssText =
              "display:inline-block;overflow:hidden;vertical-align:bottom;line-height:inherit";
            const inner = document.createElement("span");
            inner.className = "iw-inner";
            inner.style.display = "inline-block";
            inner.textContent = part;
            outer.appendChild(inner);
            parent.appendChild(outer);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as HTMLElement;
        const clone = document.createElement(elem.tagName.toLowerCase());
        Array.from(elem.attributes).forEach((a) =>
          clone.setAttribute(a.name, a.value),
        );
        Array.from(elem.childNodes).forEach((child) =>
          processNode(child, clone),
        );
        parent.appendChild(clone);
      }
    };

    const original = Array.from(el.childNodes);
    el.innerHTML = "";
    const tmp = document.createElement("div");
    original.forEach((n) => processNode(n, tmp));
    while (tmp.firstChild) el.appendChild(tmp.firstChild);

    const inners = Array.from(el.querySelectorAll<HTMLElement>(".iw-inner"));
    if (!inners.length) return;

    gsap.set(inners, { y: "110%", autoAlpha: 0 });
    gsap.to(inners, {
      y: "0%",
      autoAlpha: 1,
      duration: 0.65,
      ease: "power2.out",
      stagger: 0.055,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, [sections.intro?.statement]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {sections.hero && <InternalPageHero ready={ready} hero={sections.hero} />}
      <main className="about-page" ref={pageRef}>
        {/* 2) STATEMENT */}
        {sections.intro && (
          <section className="section section-spacious">
            <div className="container center stack">
              <h2 className="intro-statement lead" ref={introRef}>
                {renderHeroAccentTokens(sections.intro.statement)}
              </h2>
            </div>
          </section>
        )}

        {/* 3) GREEN SPLIT */}
        {sections.split && (
          <section className="split-green">
            <div className="container">
              <div className="wrap">
                <div className="img-card">
                  <div
                    className={`split-img-clip ${splitFullPlay ? "is-playing" : ""}`}
                    data-gsap="clip-reveal-left"
                    data-gsap-start="top 70%"
                    data-gsap-delay="0.05"
                    data-gsap-mobile="clip-smooth-down"
                    data-gsap-mobile-cards-start="top 70%"
                  >
                    {sections.split.video_url ? (
                      <video
                        ref={splitVideoRef}
                        className="split-video"
                        src={assetUrl(sections.split.video_url)}
                        muted
                        playsInline
                        loop={!splitFullPlay}
                        preload="metadata"
                        controls={splitFullPlay}
                      />
                    ) : null}
                    {sections.split.video_url && !splitFullPlay ? (
                      <button
                        type="button"
                        className="split-play-btn"
                        onClick={handleSplitPlayClick}
                        aria-label="Play property video"
                      >
                        <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
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
                    ) : null}
                  </div>
                </div>
                <div className="stack">
                  <h3 className="h-serif" data-gsap="char-reveal" data-gsap-start="top 90%">
                    {sections.split.heading}
                  </h3>
                  <p className="split-desc" data-gsap="fade-up" data-gsap-start="top 90%" data-gsap-delay="0.15">
                    {sections.split.p1}
                  </p>
                  <p className="split-desc" data-gsap="fade-up" data-gsap-start="top 90%" data-gsap-delay="0.25">
                    {sections.split.p2}
                  </p>
                  <ul className="rahul-points" data-gsap="fade-up" data-gsap-delay="0.32">
                    {sections.split.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="split-cta">
                    <RgButton
                      to={sections.split.cta_href}
                      variant="outline"
                      label={sections.split.cta_label}
                      data-gsap="btn-clip-reveal"
                      data-gsap-delay="0.2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4) TURN-KEY */}
        {sections.overlay && (
          <section className="img-overlay">
            {sections.overlay.image_url ? (
              <img alt="" src={assetUrl(sections.overlay.image_url)} />
            ) : null}
            <div className="overlay-card" data-gsap="clip-reveal-left">
              <h3 className="h-serif">{sections.overlay.heading}</h3>
              <p>{sections.overlay.text}</p>
              <ul className="overlay-list">
                {sections.overlay.steps.map((step, i) => (
                  <li key={i}>
                    <span className="step">{String(i + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 5) AVAILABILITY */}
        {sections.avail && (
          <section className="avail">
            <div className="grid">
              <div
                className="photo"
                data-gsap="clip-reveal-left"
                data-gsap-mobile="clip-smooth-down"
              >
                {sections.avail.image_url ? (
                  <img alt="" src={assetUrl(sections.avail.image_url)} />
                ) : null}
              </div>
              <div className="panel">
                <div className="eyebrow">{sections.avail.eyebrow}</div>
                <h3 className="h-serif" data-gsap="char-reveal" data-gsap-start="top 85%">
                  {sections.avail.heading}
                </h3>
                <p data-gsap="fade-up" data-gsap-delay="0.15">{sections.avail.text}</p>
                <div className="avail-cta">
                  <RgButton
                    to={sections.avail.cta_href}
                    variant="outline"
                    label={sections.avail.cta_label}
                    className="avail-cta__btn"
                    data-gsap="btn-clip-reveal"
                    data-gsap-delay="0.2"
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      {sections.cta && (
        <RgpCta
          eyebrow={sections.cta.eyebrow}
          title={sections.cta.title}
          titleEm={sections.cta.title_em}
          text={sections.cta.text}
          primary={{ label: sections.cta.primary.label, to: sections.cta.primary.href }}
          secondary={{ label: sections.cta.secondary.label, to: sections.cta.secondary.href }}
          bgImage={sections.cta.background_image?.url}
          bgVideo={sections.cta.background_type === "video" ? sections.cta.background_video || undefined : undefined}
          posterImage={sections.cta.video_poster_image?.url}
          minHeight={sections.cta.min_height}
        />
      )}
      {sections.eoi_cta && (
        <EoiCta
          badgeText={sections.eoi_cta.badge_text}
          title={sections.eoi_cta.title}
          text={sections.eoi_cta.text}
          buttonLabel={sections.eoi_cta.button_label}
          buttonTo={sections.eoi_cta.button_href}
          bgImage={sections.eoi_cta.background_image?.url}
          mobileBgImage={sections.eoi_cta.mobile_background_image?.url}
          minHeight={sections.eoi_cta.min_height}
          mobileMinHeight={sections.eoi_cta.mobile_min_height}
        />
      )}
    </>
  );
}
