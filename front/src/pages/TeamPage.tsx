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
        {/* ── Expanding cards ── */}
        {sections.team_section && (
          <Team section={sections.team_section} members={sections.team_section.members} />
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
          bgImage={sections.cta.background_image?.url ?? sections.cta.background_image_url}
          bgVideo={sections.cta.background_video_url}
          posterImage={sections.cta.video_poster_image?.url ?? sections.cta.video_poster_image_url}
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
          bgImage={sections.eoi_cta.background_image?.url ?? sections.eoi_cta.background_image_url}
          mobileBgImage={sections.eoi_cta.mobile_background_image?.url ?? sections.eoi_cta.mobile_background_image_url}
          minHeight={sections.eoi_cta.min_height}
          mobileMinHeight={sections.eoi_cta.mobile_min_height}
        />
      )}
    </>
  );
}
