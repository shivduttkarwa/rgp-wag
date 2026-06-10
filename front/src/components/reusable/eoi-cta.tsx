import type { ReactNode } from "react";
import RgButton from "@/components/reusable/RgButton";
import assetUrl from "@/lib/assetUrl";
import "./eoi-cta.css";

export type EoiCtaProps = {
  badgeIcon?: ReactNode;
  badgeText?: ReactNode;
  title: ReactNode;
  text: ReactNode;
  buttonLabel: ReactNode;
  buttonTo: string;
  bgImage?: string;
  mobileBgImage?: string;
  minHeight?: string;
  mobileMinHeight?: string;
  className?: string;
};

export default function EoiCta({
  badgeIcon,
  badgeText,
  title,
  text,
  buttonLabel,
  buttonTo,
  bgImage,
  mobileBgImage,
  minHeight = "100vh",
  mobileMinHeight = "70vh",
  className = "",
}: EoiCtaProps) {
  const bgSrc = assetUrl(typeof bgImage === "string" ? bgImage : "");
  const mobileBgSrc = assetUrl(typeof mobileBgImage === "string" ? mobileBgImage : "");

  const style = {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ["--eoi-min-h" as any]: minHeight,
    ["--eoi-min-h-m" as any]: mobileMinHeight,
  };

  return (
    <section
      className={["eoi-cta", className].filter(Boolean).join(" ")}
      style={style}
    >
      {bgSrc ? (
        <picture className="eoi-cta__poster" aria-hidden="true">
          {mobileBgSrc ? (
            <source media="(max-width: 480px)" srcSet={mobileBgSrc} />
          ) : null}
          <img src={bgSrc} alt="" />
        </picture>
      ) : null}

      <div className="eoi-cta__inner">
        <div className="eoi-cta__copy">
          {badgeText || badgeIcon ? (
            <div className="eoi-cta__badge" data-gsap="fade-up">
              {badgeIcon ? <span className="eoi-cta__badge-icon">{badgeIcon}</span> : null}
              {badgeText ? <span>{badgeText}</span> : null}
            </div>
          ) : null}
          <h3 className="eoi-cta__title" data-gsap="char-reveal" data-gsap-start="top 85%">{title}</h3>
          <p className="eoi-cta__text" data-gsap="fade-up" data-gsap-delay="0.12">{text}</p>
        </div>

        {buttonLabel ? (
          <div data-gsap="fade-up" data-gsap-delay="0.22">
            <RgButton
              variant="gold"
              to={buttonTo}
              label={buttonLabel}
              className="eoi-cta__button"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

