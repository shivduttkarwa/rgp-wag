import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import RgButton from "@/components/reusable/RgButton";
import assetUrl from "@/lib/assetUrl";
import "./HeroSection.css";

type HeroSectionProps = {
  ready?: boolean;
  titleLine1?: ReactNode;
  titleLine2?: ReactNode;
  subtitle?: ReactNode;
  ctaLabel?: string;
  ctaOnClick?: () => void;
  showCta?: boolean;
  showVideo?: boolean;
  bgImage?: string;
  bgVideo?: string;
  bgPoster?: string;
  footer?: ReactNode;
  panel?: ReactNode;
  scrollDown?: boolean;
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
export default function HeroSection({
  ready = false,
  titleLine1,
  titleLine2,
  subtitle,
  ctaLabel = "Explore Properties",
  ctaOnClick,
  showCta = true,
  showVideo = true,
  bgImage,
  bgVideo,
  bgPoster,
  footer,
  panel,
  scrollDown = false,
}: HeroSectionProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const titleOneRef = useRef<HTMLDivElement>(null);
  const titleTwoRef = useRef<HTMLDivElement>(null);
  const revealSubRef = useRef<HTMLDivElement>(null);
  const revealCtaRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const posterSrc = assetUrl(bgPoster || bgImage);
  const videoSrc = assetUrl(bgVideo);

  useEffect(() => {
    if (titleOneRef.current) titleOneRef.current.dataset.charSplit = "false";
    if (titleTwoRef.current) titleTwoRef.current.dataset.charSplit = "false";
  }, [titleLine1, titleLine2]);

  useEffect(() => {
    const video = videoRef.current;
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
        // Autoplay can still be blocked on some devices; fallback keeps poster.
      }
    };

    void tryPlay();
    const handlePlaying = () => setVideoReady(true);
    video.addEventListener("playing", handlePlaying);
    return () => {
      video.removeEventListener("playing", handlePlaying);
    };
  }, []);

  // Set initial states on mount — bg fully visible, only content hidden
  useLayoutEffect(() => {
    const bg = bgRef.current;
    const vignette = vignetteRef.current;
    const titleOne = titleOneRef.current;
    const titleTwo = titleTwoRef.current;
    const revealSub = revealSubRef.current;
    const revealCta = revealCtaRef.current;

    if (!bg || !vignette || !titleOne || !titleTwo || !revealSub) return;

    gsap.set(bg, { opacity: 1, scale: 1 });
    gsap.set(vignette, { opacity: 0.5 });
    gsap.set([titleOne, titleTwo], { y: 50, opacity: 0 });
    gsap.set([revealSub], { x: -60, opacity: 0 });
    if (revealCta) {
      gsap.set(revealCta, {
        clipPath: "inset(0 0 100% 0)",
        opacity: 1,
        willChange: "clip-path",
      });
    }
  }, []);

  // Animate titles + subtitle + CTA after ready
  useLayoutEffect(() => {
    if (!ready) return;

    const titleOne = titleOneRef.current;
    const titleTwo = titleTwoRef.current;
    const revealSub = revealSubRef.current;
    const revealCta = revealCtaRef.current;

    if (!titleOne || !titleTwo || !revealSub) return;

    const splitToChars = (el: HTMLElement) => {
      if (el.dataset.charSplit === "true") {
        return Array.from(el.querySelectorAll<HTMLElement>(".hero-char"));
      }
      el.dataset.charSplit = "true";

      const allChars: HTMLElement[] = [];
      const processText = (text: string, container: HTMLElement) => {
        const parts = text.split(/(\s+)/);
        parts.forEach((part) => {
          if (/^\s+$/.test(part)) {
            container.appendChild(document.createTextNode(part));
          } else if (part) {
            const wordWrap = document.createElement("span");
            wordWrap.className = "hero-word";
            wordWrap.style.cssText =
              "display:inline-block;overflow:hidden;vertical-align:top";
            part.split("").forEach((ch) => {
              const charSpan = document.createElement("span");
              charSpan.className = "hero-char";
              charSpan.style.display = "inline-block";
              charSpan.textContent = ch;
              wordWrap.appendChild(charSpan);
              allChars.push(charSpan);
            });
            container.appendChild(wordWrap);
          }
        });
      };

      const originalNodes = Array.from(el.childNodes);
      el.innerHTML = "";
      originalNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          processText(node.textContent || "", el);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const wrapper = document.createElement(
            (node as Element).nodeName.toLowerCase(),
          );
          Array.from((node as Element).attributes).forEach((attr) =>
            wrapper.setAttribute(attr.name, attr.value),
          );
          processText(node.textContent || "", wrapper);
          el.appendChild(wrapper);
        }
      });

      return allChars;
    };

    const titleOneChars = splitToChars(titleOne);
    const titleTwoChars = splitToChars(titleTwo);

    gsap.set([...titleOneChars, ...titleTwoChars], { y: 40, opacity: 0 });
    gsap.set([titleOne, titleTwo], { opacity: 1 });

    const tl = gsap.timeline();
    tl.to(titleOneChars, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: "back.out(1.4)",
      stagger: 0.03,
    });
    tl.to(
      titleTwoChars,
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "back.out(1.4)",
        stagger: 0.03,
      },
      0.25,
    );
    tl.to(
      revealSub,
      { x: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
      0.9,
    );
    if (revealCta) {
      tl.to(
        revealCta,
        { clipPath: "inset(0 0 0% 0)", duration: 1.0, ease: "power3.inOut" },
        1.1,
      );
    }

    return () => {
      tl.kill();
    };
  }, [ready]);

  /* ═══════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════ */
  return (
    <div className="rgp-hero-wrap">
      <section className="rgp-hero">
        {/* ── BACKGROUND ── */}
        <div
          className={`rgp-hero__bg ${videoReady ? "rgp-hero__bg--ready" : ""}`}
          ref={bgRef}
          aria-hidden="true"
        >
          <img
            className="rgp-hero__bg-poster"
            src={posterSrc}
            alt=""
            loading="eager"
            fetchPriority="high"
          />
          {showVideo && (
            <video
              className="rgp-hero__bg-video"
              ref={videoRef}
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              preload="auto"
              poster={posterSrc}
              onLoadedMetadata={() => {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => setVideoReady(true));
                });
              }}
              onCanPlay={() => {
                setVideoReady(true);
                void videoRef.current?.play();
              }}
            />
          )}
        </div>

        {/* ── VIGNETTE ── */}
        <div
          className="rgp-hero__vignette"
          ref={vignetteRef}
          aria-hidden="true"
        />

        {/* ── CONTENT ── */}
        <div className="rgp-hero__content">
          <div className="rgp-hero__title">
            <div className="rgp-hero__title-line">
              <div className="rgp-hero__title-text" ref={titleOneRef}>
                {titleLine1}
              </div>
            </div>
            <div className="rgp-hero__title-line">
              <div className="rgp-hero__title-text" ref={titleTwoRef}>
                {titleLine2}
              </div>
            </div>
          </div>

          <div className="rgp-hero__subtitle" ref={revealSubRef}>
            {subtitle}
          </div>

          {panel ? (
            <div className="rgp-hero__cta rgp-hero__cta--panel" ref={revealCtaRef}>
              {panel}
            </div>
          ) : showCta ? (
            <div className="rgp-hero__cta" ref={revealCtaRef}>
              <RgButton
                variant="gold"
                onClick={ctaOnClick}
                label={ctaLabel}
                arrowSize={16}
              />
            </div>
          ) : null}
        </div>

        {/* ── SCROLL DOWN ── */}
        {scrollDown && (
          <button
            className="rgp-hero__scroll-down"
            aria-label="Scroll down"
            onClick={() => {
              const wrap = document.querySelector(".rgp-hero-wrap");
              const next = wrap?.nextElementSibling as HTMLElement | null;
              next?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="rgp-hero__scroll-down__ring">
              <div className="rgp-hero__scroll-down__chevrons">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <span className="rgp-hero__scroll-down__label">Scroll</span>
          </button>
        )}

        {/* ── FOOTER ── */}
        {footer && <div className="rgp-hero__footer">{footer}</div>}
      </section>
    </div>
  );
}
