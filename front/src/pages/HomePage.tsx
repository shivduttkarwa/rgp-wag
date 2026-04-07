import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import HeroSearchPanel from "../components/HeroSearchPanel";
import Intro from "../sections/Intro";
import PortfolioShowcase from "../sections/PortfolioShowcase";
import PropertyListingSection from "@/sections/PropertyListingSection";
import ServiceSelection from "@/sections/ServiceSelection";
import PhilosophyPillars from "@/sections/Philosophy";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import { renderHeroAccentTokens } from "@/lib/heroTokens";
import { useHomePage } from "@/hooks/useHomePage";

export default function HomePage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { sections } = useHomePage();

  useEffect(() => {
    const guards = [
      "clipRevealInit", "clipRevealRtlInit", "clipRevealTopInit",
      "clipRevealLeftInit", "clipRevealRightInit", "wordRevealInit",
      "wordWriteInit", "clipSmoothInit", "clipSmoothDownInit", "charRevealInit",
    ];
    guards.forEach((key) => {
      pageRef.current
        ?.querySelectorAll<HTMLElement>(`[data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}]`)
        .forEach((el) => delete el.dataset[key]);
    });
    const cleanup = initGsapSwitchAnimations(pageRef.current);
    return cleanup;
  }, []);

  const hero = sections.hero!;
  const heroTabs = hero.search_tabs?.filter((tab) => tab.label && tab.href) ?? [];
  const legacyCta = hero.cta;
  const showLegacyCta = heroTabs.length === 0 && Boolean(legacyCta?.label);

  return (
    <div ref={pageRef}>
      {/* ── Hero ── */}
      <HeroSection
        ready={ready}
        titleLine1={renderHeroAccentTokens(hero.title_line_1)}
        titleLine2={renderHeroAccentTokens(hero.title_line_2)}
        subtitle={hero.subtitle}
        ctaLabel={legacyCta?.label ?? ""}
        showCta={showLegacyCta}
        ctaOnClick={() => {
          const href = legacyCta?.href || "/properties";
          if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
            window.location.assign(href);
          } else {
            navigate(href);
          }
        }}
        showVideo={hero.show_video}
        bgImage={hero.background_image?.url ?? hero.background_image_url}
        bgPoster={hero.background_image?.url ?? hero.background_image_url}
        bgVideo={hero.background_video_url || undefined}
        panel={heroTabs.length > 0 ? <HeroSearchPanel tabs={heroTabs} /> : undefined}
      />

      {/* ── Intro / Founder ── */}
      {sections.intro && <Intro data={sections.intro} />}

      {/* ── Property Listings ── */}
      {sections.property_listing && <PropertyListingSection data={sections.property_listing} />}

      {/* ── Services ── */}
      {sections.services && <ServiceSelection data={sections.services} />}

      {/* ── Video Testimonials ── */}
      {sections.video_testimonials && (
        <PhilosophyPillars data={sections.video_testimonials} />
      )}

      {/* ── Portfolio Showcase ── */}
      {sections.portfolio && <PortfolioShowcase data={sections.portfolio} />}
    </div>
  );
}
