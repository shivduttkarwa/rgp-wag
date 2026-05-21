import { useState, type ReactNode } from "react";
import RgButton from "@/components/reusable/RgButton";
import assetUrl from "@/lib/assetUrl";
import "./RgpCta.css";

export type RgpCtaStat = {
  value: ReactNode;
  label: ReactNode;
};

export type RgpCtaLink = {
  label: ReactNode;
  to?: string;
  href?: string;
};

export type RgpCtaProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  titleEm?: ReactNode;
  text: ReactNode;
  primary: RgpCtaLink;
  secondary?: RgpCtaLink;
  stats?: RgpCtaStat[];
  bgImage?: string;
  bgVideo?: string;
  posterImage?: string;
  minHeight?: string;
  className?: string;
};

export default function RgpCta({
  eyebrow,
  title,
  titleEm,
  text,
  primary,
  secondary,
  stats = [],
  bgImage = "images/hero1.jpg",
  bgVideo,
  posterImage,
  minHeight = "100vh",
  className = "",
}: RgpCtaProps) {
  const [videoReady, setVideoReady] = useState(false);

  const poster = posterImage ?? bgImage;
  const posterSrc = assetUrl(typeof poster === "string" ? poster : "");
  const videoSrc = assetUrl(bgVideo);
  const style = {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ["--rgp-cta-min-h" as any]: minHeight,
  };

  return (
    <section
      className={[
        "rgp-cta",
        bgVideo ? "rgp-cta--has-video" : "",
        videoReady ? "rgp-cta--video-ready" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {posterSrc ? (
        <img className="rgp-cta__poster" src={posterSrc} alt="" aria-hidden="true" />
      ) : null}

      {bgVideo ? (
        <video
          className="rgp-cta__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc || undefined}
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          <source src={videoSrc} />
        </video>
      ) : null}
      <div className="rgp-cta__container">
        <div className="rgp-cta__content">
          <span className="rgp-cta__eyebrow" data-gsap="fade-up">
            {eyebrow}
          </span>

          <h3 className="rgp-cta__title" data-gsap="char-reveal" data-gsap-start="top 85%">
            {title} {titleEm ? <em>{titleEm}</em> : null}
          </h3>

          <p className="rgp-cta__text" data-gsap="fade-up" data-gsap-delay="0.15">
            {text}
          </p>

          <div className="rgp-cta__actions">
            {primary.to ? (
              <RgButton
                variant="gold"
                to={primary.to}
                label={primary.label}
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
              />
            ) : (
              <RgButton
                variant="gold"
                href={primary.href ?? "#"}
                label={primary.label}
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
              />
            )}

            {secondary ? (
              secondary.to ? (
                <RgButton
                  variant="outline"
                  to={secondary.to}
                  label={secondary.label}
                  data-gsap="btn-clip-reveal"
                  data-gsap-delay="0.2"
                />
              ) : (
                <RgButton
                  variant="outline"
                  href={secondary.href ?? "#"}
                  label={secondary.label}
                  data-gsap="btn-clip-reveal"
                  data-gsap-delay="0.2"
                />
              )
            ) : null}
          </div>

          {stats.length ? (
            <div data-gsap="zoom-in" data-gsap-stagger="0.3 " className="rgp-cta__trust">
              {stats.map((s, idx) => (
                <div key={idx} className="rgp-cta__trust-item">
                  <span className="rgp-cta__trust-value">{s.value}</span>
                  <span className="rgp-cta__trust-label">{s.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

