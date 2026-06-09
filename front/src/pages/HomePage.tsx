import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import HeroSearchPanel from "../components/HeroSearchPanel";
import Intro from "../sections/Intro";
import PortfolioShowcase from "../sections/PortfolioShowcase";
import PropertyListingSection from "@/sections/PropertyListingSection";
import ServiceSelection from "@/sections/ServiceSelection";
import PhilosophyPillars from "@/sections/Philosophy";
import RgpCta from "@/components/reusable/RgpCta";
import EoiCta from "@/components/reusable/eoi-cta";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import { renderHeroAccentTokens } from "@/lib/heroTokens";
import { useHomePage } from "@/hooks/useHomePage";
import { Building2 } from "lucide-react";

const isExternalHref = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href);

const toRgpLink = (label: string, href: string) => {
  if (isExternalHref(href)) return { label, href };
  return { label, to: href };
};

export default function HomePage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { sections, status } = useHomePage();

  useEffect(() => {
    if (status === "loading") return;

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
  }, [status]);

  const hero = sections.hero;
  const heroTabs = hero?.search_tabs?.filter((tab) => tab.label && tab.href) ?? [];
  const legacyCta = hero?.cta;
  const showLegacyCta = heroTabs.length === 0 && Boolean(legacyCta?.label);
  const services = sections.services;
  const eoiCta = sections.eoi_cta;
  const ctaSection = sections.cta;
  const ctaBackgroundImage =
    ctaSection?.background_image?.url ?? ctaSection?.background_image_url ?? "images/hero1.jpg";
  const ctaVideoPoster =
    ctaSection?.video_poster_image?.url ??
    ctaSection?.video_poster_image_url ??
    ctaBackgroundImage;
  const ctaVideo = ctaSection?.use_video
    ? (ctaSection.background_video_url || undefined)
    : undefined;

  const primaryCta = toRgpLink(
    ctaSection?.primary.label || "Talk to an Expert",
    ctaSection?.primary.href || "/contact",
  );
  const secondaryCta = toRgpLink(
    ctaSection?.secondary.label || "0450 009 291",
    ctaSection?.secondary.href || "tel:+61450009291",
  );

  return (
    <div ref={pageRef}>
      <HeroSection
        ready={ready}
        titleLine1={renderHeroAccentTokens(hero?.title_line_1 ?? "Your [gold]Dream[/gold] Home")}
        titleLine2={renderHeroAccentTokens(hero?.title_line_2 ?? "[amber]Perfectly[/amber] Delivered")}
        subtitle={hero?.subtitle}
        ctaLabel={legacyCta?.label ?? "Explore Properties"}
        showCta={showLegacyCta}
        ctaOnClick={() => {
          const href = legacyCta?.href || "/properties";
          if (isExternalHref(href)) {
            window.location.assign(href);
            return;
          }
          navigate(href);
        }}
        showVideo={hero?.show_video ?? true}
        bgImage={(hero?.background_image?.url ?? hero?.background_image_url) || undefined}
        bgPoster={(hero?.background_image?.url ?? hero?.background_image_url) || undefined}
        bgVideo={(hero?.background_video ?? hero?.background_video_url) || undefined}
        panel={heroTabs.length > 0 ? <HeroSearchPanel tabs={heroTabs} /> : undefined}
      />

      {sections.intro ? <Intro data={sections.intro} /> : null}

      {sections.property_listing ? <PropertyListingSection data={sections.property_listing} /> : null}

      {eoiCta ? (
        <EoiCta
          badgeIcon={<Building2 size={20} />}
          badgeText={eoiCta.badge_text}
          title={eoiCta.title}
          text={eoiCta.text}
          buttonLabel={eoiCta.button_label}
          buttonTo={eoiCta.button_href}
          bgImage={eoiCta.background_image?.url ?? eoiCta.background_image_url}
          mobileBgImage={
            eoiCta.mobile_background_image?.url ?? eoiCta.mobile_background_image_url
          }
          minHeight={eoiCta.min_height}
          mobileMinHeight={eoiCta.mobile_min_height}
        />
      ) : null}

      {services ? (
        <ServiceSelection data={services} />
      ) : null}

      {ctaSection ? (
        <RgpCta
          eyebrow={ctaSection.eyebrow}
          title={ctaSection.title}
          titleEm={ctaSection.title_em}
          text={ctaSection.text}
          bgImage={ctaBackgroundImage}
          bgVideo={ctaVideo}
          posterImage={ctaVideoPoster}
          minHeight={ctaSection.min_height}
          primary={primaryCta}
          secondary={secondaryCta}
          stats={[
            { value: "5+", label: "Years Experience" },
            { value: "100+", label: "Happy Clients" },
            { value: "24/7", label: "Support Available" },
          ]}
        />
      ) : null}

      {sections.video_testimonials ? <PhilosophyPillars data={sections.video_testimonials} /> : null}

      {sections.portfolio ? <PortfolioShowcase data={sections.portfolio} /> : null}
    </div>
  );
}
