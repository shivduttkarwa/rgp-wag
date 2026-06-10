import React, { useEffect, useRef } from "react";
import InternalPageHero from "@/sections/InternalPageHero";
import RGPSplitSlider from "../components/reusable/SplitSlider";
import type { SlideContent } from "../components/reusable/SplitSlider";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import RgButton from "@/components/reusable/RgButton";
import "./TestimonialPage.css";
import { useTestimonialsPage } from "@/hooks/useTestimonialsPage";
import type {
  CmsFeaturedTestimonial,
  CmsTestimonial,
} from "@/types/testimonialsPage";
import { resolveMediaUrl } from "@/lib/api/config";
import RgpCta from "@/components/reusable/RgpCta";
import EoiCta from "@/components/reusable/eoi-cta";

interface Testimonial {
  id: number;
  name: string;
  avatar: string;
  content: string;
  rating: number;
  location: string;
}

function cmsToTestimonial(t: CmsTestimonial): Testimonial {
  return {
    id: t.id,
    name: t.client_name,
    avatar: resolveMediaUrl(t.avatar_image?.url ?? t.avatar_url ?? ""),
    content: t.quote,
    rating: t.rating,
    location: t.location,
  };
}

function cmsFeaturedToSlide(item: CmsFeaturedTestimonial): SlideContent {
  return {
    kicker: item.kicker,
    titleLines: item.title_lines,
    description: item.description,
    linkText: item.link_text,
    linkUrl: item.link_url ?? undefined,
    image: resolveMediaUrl(item.image),
    theme: item.theme,
  };
}

const SectionHeading = ({
  eyebrow,
  heading,
  subtitle,
}: {
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
}) => {
  if (!eyebrow && !heading && !subtitle) return null;

  return (
    <div className="t-section-heading">
      <header className="t-section-heading__header">
        {eyebrow ? (
          <span
            className="t-section-heading__eyebrow"
            data-gsap="fade-in"
            data-gsap-start="top 100%"
          >
            {eyebrow}
          </span>
        ) : null}
        {heading ? (
          <h2
            className="t-section-heading__title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {heading}
          </h2>
        ) : null}
        {subtitle ? (
          <p
            className="t-section-heading__subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.2"
          >
            {subtitle}
          </p>
        ) : null}
      </header>
    </div>
  );
};

const VoiceMosaic: React.FC<{ items: Testimonial[] }> = ({ items }) => {
  if (!items.length) return null;

  return (
    <section className="tp-mosaic">
      <div className="tp-mosaic__grid">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`tp-mosaic__card tp-mosaic__card--${(index % 9) + 1}`}
          >
            <div className="tp-mosaic__card-glow" />
            <div className="tp-mosaic__corner" aria-hidden="true" />
            <div className="tp-mosaic__card-header">
              {item.avatar ? <img src={item.avatar} alt={item.name} /> : null}
              <div>
                <h4>{item.name}</h4>
                <p>{item.location}</p>
              </div>
              {item.rating ? (
                <div className="tp-mosaic__card-rating">
                  {item.rating.toFixed(1)}
                </div>
              ) : null}
            </div>
            <blockquote>"{item.content}"</blockquote>
          </article>
        ))}
      </div>
    </section>
  );
};

const TickerWall: React.FC<{ items: Testimonial[] }> = ({ items }) => {
  if (!items.length) return null;

  return (
    <section className="tp-ticker">
      <div className="tp-ticker__container">
        <div className="tp-ticker__wall">
          {[0, 1, 2].map((column) => (
            <div
              key={column}
              className={`tp-ticker__col${
                column === 1 ? " tp-ticker__col--rev" : ""
              }`}
              style={{ "--ts": `${32 + column * 6}s` } as React.CSSProperties}
            >
              <div className="tp-ticker__inner">
                {[...items, ...items].map((item, index) => (
                  <article
                    key={`${column}-${item.id}-${index}`}
                    className="tp-ticker__card"
                  >
                    <div className="tp-ticker__card-accent" />
                    <div className="tp-ticker__card-head">
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.name} />
                      ) : null}
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.location}</p>
                      </div>
                    </div>
                    <p className="tp-ticker__card-text">"{item.content}"</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="tp-ticker__fade-top" />
        <div className="tp-ticker__fade-bottom" />
      </div>
    </section>
  );
};

interface FinalCTAProps {
  heading: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}

const FinalCTA: React.FC<FinalCTAProps> = ({
  heading,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}) => (
  <section className="tp-cta">
    <div className="tp-cta__inner">
      <div className="tp-cta__panel">
        {heading ? (
          <h2
            className="tp-cta__heading"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {heading}
          </h2>
        ) : null}
        {body ? (
          <p className="tp-cta__body" data-gsap="fade-up" data-gsap-delay="0.15">
            {body}
          </p>
        ) : null}
        <div className="tp-cta__actions">
          {primaryLabel ? (
            <RgButton
              href={primaryHref}
              variant="gold"
              label={primaryLabel}
              data-gsap="btn-clip-reveal"
              data-gsap-delay="0.2"
            />
          ) : null}
          {secondaryLabel ? (
            <RgButton
              href={secondaryHref}
              variant="outline"
              label={secondaryLabel}
              data-gsap="btn-clip-reveal"
              data-gsap-delay="0.32"
            />
          ) : null}
        </div>
      </div>
    </div>
  </section>
);

const TestimonialPage: React.FC<{ ready?: boolean }> = ({ ready = false }) => {
  const { data } = useTestimonialsPage();
  const pageRef = useRef<HTMLDivElement>(null);
  const { sections } = data;

  const featuredSlides: SlideContent[] =
    sections.featured_testimonials?.items?.map(cmsFeaturedToSlide) ?? [];
  const textGridItems =
    sections.text_testimonials_grid?.items?.map(cmsToTestimonial) ?? [];
  const tickerItems = sections.ticker?.items?.map(cmsToTestimonial) ?? [];

  useEffect(() => {
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
  }, [data.updated_at]);

  return (
    <div ref={pageRef}>
      <main className="testimonial-page">
        {sections.hero ? (
          <InternalPageHero ready={ready} hero={sections.hero} />
        ) : null}

        {sections.featured_testimonials ? (
          <>
            <SectionHeading
              eyebrow={sections.featured_testimonials.eyebrow}
              heading={sections.featured_testimonials.heading}
              subtitle={sections.featured_testimonials.subtitle}
            />
            <RGPSplitSlider slides={featuredSlides} />
          </>
        ) : null}

        {sections.text_testimonials_grid ? (
          <>
            <SectionHeading
              eyebrow={sections.text_testimonials_grid.eyebrow}
              heading={sections.text_testimonials_grid.heading}
              subtitle={sections.text_testimonials_grid.subtitle}
            />
            <VoiceMosaic items={textGridItems} />
          </>
        ) : null}

        {sections.ticker ? <TickerWall items={tickerItems} /> : null}

        {sections.final_cta ? (
          <FinalCTA
            heading={sections.final_cta.heading}
            body={sections.final_cta.body}
            primaryLabel={sections.final_cta.primary.label}
            primaryHref={sections.final_cta.primary.href}
            secondaryLabel={sections.final_cta.secondary.label}
            secondaryHref={sections.final_cta.secondary.href}
          />
        ) : null}
      </main>

      {sections.cta ? (
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
      ) : null}
      {sections.eoi_cta ? (
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
      ) : null}
    </div>
  );
};

export default TestimonialPage;
