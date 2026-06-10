import type { ReactNode } from "react";
import CmsButton from "@/components/reusable/CmsButton";
import type { ButtonBlockData } from "@/types/shared";
import assetUrl from "@/lib/assetUrl";
import "./eoi-cta.css";

export type EoiCtaProps = {
  badgeIcon?: ReactNode;
  badgeText?: ReactNode;
  title: ReactNode;
  text: ReactNode;
  button?: ButtonBlockData;
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
  button,
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

        {button?.label && button?.href ? (
          <div data-gsap="fade-up" data-gsap-delay="0.22">
            <CmsButton button={button} className="eoi-cta__button" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

