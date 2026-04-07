import { type ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import BtnSecondary from "../components/BtnSecondary";
import "./HeroSection.css";

// ─── URL helpers ─────────────────────────────────────────────────────────────

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

/**
 * Resolve any URL to a fully usable src:
 *  - Already absolute (http/https) → as-is
 *  - Starts with /media/ or /static/ → Django-served, prepend API_BASE
 *  - Otherwise → relative to Vite public/, prepend publicUrl
 */
function resolveMediaUrl(url: string, publicUrl: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) return `${API_BASE}${url}`;
  return `${publicUrl}${url}`;
}

// ─── Vimeo helpers ────────────────────────────────────────────────────────────

function extractVimeoId(url: string): string | null {
  const match = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/,
  );
  return match ? match[1] : null;
}

function buildVimeoEmbedUrl(id: string): string {
  return `https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1&autopause=0`;
}

function isVimeoUrl(url: string): boolean {
  return /vimeo\.com/.test(url);
}

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
};

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
export default function HeroSection({
  ready = false,
  titleLine1 = (
    <>
      Your <span className="rg-gold">Dream</span> Home
    </>
  ),
  titleLine2 = (
    <>
      <span className="rg-amber">Perfectly</span> Delivered
    </>
  ),
  subtitle =
    "350+ premium properties delivered — luxury villas, penthouses & exclusive estates crafted for those who demand the extraordinary.",
  ctaLabel = "Explore Properties",
  ctaOnClick,
  showCta = true,
  showVideo = true,
  bgImage = "images/hero-rpg-brisbane.jpg",
  bgVideo = "vids/hero-rgp.mp4",
  bgPoster,
  footer,
  panel,
}: HeroSectionProps) {
  const publicUrl = import.meta.env.BASE_URL || "/";
  const hasVideo = Boolean(showVideo && bgVideo);
  const bgRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const titleOneRef = useRef<HTMLDivElement>(null);
  const titleTwoRef = useRef<HTMLDivElement>(null);
  const revealSubRef = useRef<HTMLDivElement>(null);
  const revealCtaRef = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Prevent stale "ready" state from hiding the poster when switching to image-only hero data.
    if (!hasVideo) setVideoReady(false);
  }, [hasVideo, bgVideo, bgImage, bgPoster]);

  useEffect(() => {
    if (!hasVideo) return;

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
  }, [hasVideo, bgVideo]);

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
      if (panel) {
        gsap.set(revealCta, { clipPath: "inset(0 0 100% 0)", opacity: 1, willChange: "clip-path" });
      } else {
        gsap.set(revealCta, { x: -60, opacity: 0, scale: 0.9 });
      }
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

    gsap.set([titleOne, titleTwo], { y: 40, opacity: 0 });

    const tl = gsap.timeline();
    tl.to(titleOne, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
    });
    tl.to(
      titleTwo,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      0.15,
    );
    tl.to(
      revealSub,
      { x: 0, opacity: 1, duration: 0.9, ease: "power4.out" },
      0.9,
    );
    if (revealCta) {
      if (panel) {
        tl.to(
          revealCta,
          { clipPath: "inset(0 0 0% 0)", duration: 1.0, ease: "power3.inOut" },
          1.1,
        );
      } else {
        tl.to(
          revealCta,
          { x: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power4.out" },
          1,
        );
      }
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
        {(() => {
          const resolvedBgImage = resolveMediaUrl(bgImage ?? "", publicUrl);
          const resolvedPoster  = bgPoster
            ? resolveMediaUrl(bgPoster, publicUrl)
            : resolvedBgImage;

          const vimeoId = bgVideo && isVimeoUrl(bgVideo)
            ? extractVimeoId(bgVideo)
            : null;

          return (
            <div
              className={`rgp-hero__bg ${hasVideo && videoReady ? "rgp-hero__bg--ready" : ""}`}
              ref={bgRef}
              aria-hidden="true"
            >
              {/* Poster / static image (always rendered as fallback) */}
              <img
                className="rgp-hero__bg-poster"
                src={resolvedPoster}
                alt=""
                loading="eager"
                fetchPriority="high"
              />

              {hasVideo && (
                vimeoId ? (
                  /* ── Vimeo background iframe ── */
                  <iframe
                    className="rgp-hero__bg-video rgp-hero__bg-video--vimeo"
                    src={buildVimeoEmbedUrl(vimeoId)}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    onLoad={() => setVideoReady(true)}
                  />
                ) : (
                  /* ── Direct video file ── */
                  <video
                    className="rgp-hero__bg-video"
                    ref={videoRef}
                    src={resolveMediaUrl(bgVideo, publicUrl)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    disablePictureInPicture
                    preload="auto"
                    poster={resolvedPoster}
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
                )
              )}
            </div>
          );
        })()}

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
              <BtnSecondary label={ctaLabel} onClick={ctaOnClick} />
            </div>
          ) : null}
        </div>

        {/* ── FOOTER ── */}
        {footer && <div className="rgp-hero__footer">{footer}</div>}
      </section>
    </div>
  );
}
