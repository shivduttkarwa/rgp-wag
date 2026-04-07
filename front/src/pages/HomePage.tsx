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
import { useHomeHeroContent } from "@/hooks/useHomeHeroContent";
export default function HomePage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: heroContent } = useHomeHeroContent();

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
    return cleanup;
  }, []);

  return (
    <div ref={pageRef}>
      <HeroSection
        ready={ready}
        titleLine1={renderHeroAccentTokens(heroContent.titleLine1)}
        titleLine2={renderHeroAccentTokens(heroContent.titleLine2)}
        subtitle={heroContent.subtitle}
        ctaLabel={heroContent.cta.label}
        ctaOnClick={() => {
          if (/^[a-z][a-z0-9+.-]*:/i.test(heroContent.cta.href)) {
            window.location.assign(heroContent.cta.href);
            return;
          }

          navigate(heroContent.cta.href || "/properties");
        }}
        showCta={Boolean(heroContent.cta.label)}
        showVideo={heroContent.background.showVideo}
        bgImage={heroContent.background.imageUrl}
        bgPoster={heroContent.background.posterUrl ?? heroContent.background.imageUrl}
        bgVideo={heroContent.background.videoUrl ?? undefined}
        panel={<HeroSearchPanel />}
      />

      <Intro />

      <PropertyListingSection />

      <ServiceSelection />
      <PhilosophyPillars />

      <PortfolioShowcase />
    </div>
  );
}
