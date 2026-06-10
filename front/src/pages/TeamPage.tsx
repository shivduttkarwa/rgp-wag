import { useEffect, useRef } from "react";
import InternalPageHero from "@/sections/InternalPageHero";
import Team from "../sections/TeamV2";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import { useTeamPage } from "@/hooks/useTeamPage";
import RgpCta from "@/components/reusable/RgpCta";
import EoiCta from "@/components/reusable/eoi-cta";
import "./TeamPage.css";

export default function TeamPage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const { data, status } = useTeamPage();
  const { sections } = data;

  useEffect(() => {
    if (status === "loading") return;
    const guards = [
      "clipRevealInit", "clipRevealRtlInit", "clipRevealTopInit",
      "clipRevealLeftInit", "clipRevealRightInit", "wordRevealInit",
      "wordWriteInit", "clipSmoothInit", "clipSmoothDownInit", "charRevealInit",
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
  }, [status, data.updated_at]);

  return (
    <>
      {sections.hero && <InternalPageHero ready={ready} hero={sections.hero} />}

      <main className="team-page" ref={pageRef}>
        {sections.team_section && (
          <Team section={sections.team_section} members={sections.team_section.members} />
        )}

        {sections.core_values && sections.core_values.values.length > 0 && (
          <section className="tp-core-values">
            <div className="tp-core-values__inner">
              {(sections.core_values.eyebrow || sections.core_values.heading) && (
                <div className="tp-core-values__header">
                  {sections.core_values.eyebrow && (
                    <span className="tp-core-values__eyebrow" data-gsap="fade-up">
                      {sections.core_values.eyebrow}
                    </span>
                  )}
                  {sections.core_values.heading && (
                    <h2 className="tp-core-values__heading" data-gsap="char-reveal" data-gsap-start="top 85%">
                      {sections.core_values.heading}{" "}
                      {sections.core_values.heading_em && (
                        <em>{sections.core_values.heading_em}</em>
                      )}
                    </h2>
                  )}
                  {sections.core_values.subtitle && (
                    <p className="tp-core-values__subtitle" data-gsap="fade-up" data-gsap-delay="0.15">
                      {sections.core_values.subtitle}
                    </p>
                  )}
                </div>
              )}
              <div className="tp-core-values__grid">
                {sections.core_values.values.map((val, i) => (
                  <article
                    key={i}
                    className="tp-core-values__card"
                    data-gsap="fade-up"
                    data-gsap-delay={`${i * 0.08}`}
                  >
                    <span className="tp-core-values__num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="tp-core-values__card-title">{val.title}</h3>
                    <p className="tp-core-values__card-desc">{val.description}</p>
                  </article>
                ))}
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
