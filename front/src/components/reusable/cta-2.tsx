import { useState, type ReactNode } from "react";
import RgButton from "@/components/reusable/RgButton";
import assetUrl from "@/lib/assetUrl";
import "./cta-2.css";

export type Cta2Stat = {
  value: ReactNode;
  label: ReactNode;
};

export type Cta2Commitment = {
  title: ReactNode;
};

export type Cta2Link = {
  label: ReactNode;
  to?: string;
  href?: string;
};

export type Cta2Props = {
  eyebrow: ReactNode;
  title: ReactNode;
  titleEm?: ReactNode;
  text: ReactNode;
  primary?: Cta2Link;
  secondary?: Cta2Link;
  commitments?: Cta2Commitment[];
  bgImage?: string;
  bgVideo?: string;
  posterImage?: string;
  minHeight?: string;
  className?: string;
};

export default function Cta2({
  eyebrow,
  title,
  titleEm,
  text,
  primary,
  secondary,
  commitments = [],
  bgImage,
  bgVideo,
  posterImage,
  minHeight = "100vh",
  className = "",
}: Cta2Props) {
  const [videoReady, setVideoReady] = useState(false);

  const poster = posterImage ?? bgImage;
  const posterSrc = assetUrl(typeof poster === "string" ? poster : "");
  const videoSrc = assetUrl(bgVideo);
  const style = {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ["--cta2-min-h" as any]: minHeight,
  };

  return (
    <section
      className={[
        "cta2",
        bgVideo ? "cta2--has-video" : "",
        videoReady ? "cta2--video-ready" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {posterSrc ? (
        <img className="cta2__poster" src={posterSrc} alt="" aria-hidden="true" />
      ) : null}

      {bgVideo ? (
        <video
          className="cta2__video"
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
      <div className="cta2__container">
        <div className="cta2__grid">
          <div className="cta2__copy">
            <span className="cta2__eyebrow">{eyebrow}</span>

            <h3 className="cta2__title">
              {title} {titleEm ? <em>{titleEm}</em> : null}
            </h3>

            <p className="cta2__text">{text}</p>

            <div className="cta2__actions">
              {primary?.label ? (
                primary.to ? (
                  <RgButton
                    variant="gold"
                    to={primary.to}
                    label={primary.label}
                  />
                ) : (
                  <RgButton
                    variant="gold"
                    href={primary.href ?? ""}
                    label={primary.label}
                  />
                )
              ) : null}

              {secondary?.label ? (
                secondary.to ? (
                  <RgButton
                    variant="outline"
                    to={secondary.to}
                    label={secondary.label}
                  />
                ) : (
                  <RgButton
                    variant="outline"
                    href={secondary.href ?? ""}
                    label={secondary.label}
                  />
                )
              ) : null}
            </div>
          </div>

          {commitments.length ? (
            <div className="cta2__commitments">
              {commitments.map((c, idx) => (
                <div key={idx} className="cta2__commitment">
                  <span className="cta2__commitment-title">{c.title}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
