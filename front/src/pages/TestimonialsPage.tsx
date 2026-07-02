import React, { useEffect, useRef, useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionBadge from "@/components/reusable/SectionBadge";
import InternalPageHero from "@/sections/InternalPageHero";
import RGPSplitSlider from "../components/reusable/SplitSlider";
import type { SlideContent } from "../components/reusable/SplitSlider";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import CmsButton from "@/components/reusable/CmsButton";
import type { ButtonBlockData } from "@/types/shared";
import "./TestimonialPage.css";
import { useTestimonialsPage } from "@/hooks/useTestimonialsPage";
import { renderHeroAccentTokens } from "@/lib/heroTokens";
import CmsEditBar from "@/components/reusable/CmsEditBar";
import PageSkeleton from "@/components/reusable/PageSkeleton";
import PageError from "@/components/reusable/PageError";
import PageSeo from "@/components/reusable/PageSeo";
import type { CmsFeaturedTestimonial, CmsTestimonial } from "@/types/testimonialsPage";
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

// ─── Section Heading ──────────────────────────────────────────────────────────

const SectionHeading = ({
  eyebrow,
  heading,
  subtitle,
  icon: Icon,
}: {
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
  icon?: LucideIcon;
}) => {
  if (!eyebrow && !heading && !subtitle) return null;
  return (
    <div className="t-section-heading">
      <header className="t-section-heading__header">
        {eyebrow && Icon ? (
          <SectionBadge text={eyebrow} icon={Icon} />
        ) : eyebrow ? (
          <SectionBadge text={eyebrow} icon={Star} />
        ) : null}
        {heading ? (
          <h2 className="t-section-heading__title" data-gsap="char-reveal" data-gsap-start="top 85%">
            {renderHeroAccentTokens(heading)}
          </h2>
        ) : null}
        {subtitle ? (
          <p className="t-section-heading__subtitle" data-gsap="fade-up" data-gsap-delay="0.2">
            {subtitle}
          </p>
        ) : null}
      </header>
    </div>
  );
};

// ─── Stories Grid (Stories From Our Clients) ──────────────────────────────────

const PAGE_SIZE = 9;

const StoriesGrid: React.FC<{
  items: Testimonial[];
  eyebrow?: string;
  heading?: string;
  subtitle?: string;
}> = ({ items, eyebrow, heading, subtitle }) => {
  const [visible, setVisible] = useState(PAGE_SIZE);
  if (!items.length) return null;

  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <section className="tp-stories">
      <div className="tp-stories__wrap">
        <SectionHeading eyebrow={eyebrow} heading={heading} subtitle={subtitle} icon={MessageSquare} />

        <div className="tp-stories__grid">
          {shown.map((item) => (
            <article key={item.id} className="tp-story-card">
              <div className="tp-story-card__top">
                <span className="tp-story-card__qmark" aria-hidden="true">"</span>
                {item.rating > 0 && (
                  <div className="tp-story-card__stars" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i < item.rating ? "currentColor" : "none"}
                        strokeWidth={i < item.rating ? 0 : 1.5}
                      />
                    ))}
                  </div>
                )}
              </div>

              <blockquote className="tp-story-card__quote">{item.content}</blockquote>

              <div className="tp-story-card__author">
                {item.avatar ? (
                  <img src={item.avatar} alt={item.name} className="tp-story-card__avatar" />
                ) : (
                  <div className="tp-story-card__avatar-init" aria-hidden="true">
                    {item.name.charAt(0)}
                  </div>
                )}
                <div className="tp-story-card__meta">
                  <strong>{item.name}</strong>
                  {item.location && <span>{item.location}</span>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="tp-stories__more">
            <button
              className="tp-stories__load-btn"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Load More Stories
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ─── Final CTA ────────────────────────────────────────────────────────────────

interface FinalCTAProps {
  heading: string;
  body: string;
  primary?: ButtonBlockData;
  secondary?: ButtonBlockData;
}

const FinalCTA: React.FC<FinalCTAProps> = ({ heading, body, primary, secondary }) => (
  <section className="tp-cta">
    <div className="tp-cta__inner">
      <div className="tp-cta__panel">
        {heading ? (
          <h2 className="tp-cta__heading" data-gsap="char-reveal" data-gsap-start="top 85%">
            {heading}
          </h2>
        ) : null}
        {body ? (
          <p className="tp-cta__body" data-gsap="fade-up" data-gsap-delay="0.15">
            {body}
          </p>
        ) : null}
        <div className="tp-cta__actions">
          {primary?.label && primary?.href ? (
            <CmsButton button={primary} data-gsap="btn-clip-reveal" data-gsap-delay="0.2" />
          ) : null}
          {secondary?.label && secondary?.href ? (
            <CmsButton button={secondary} data-gsap="btn-clip-reveal" data-gsap-delay="0.32" />
          ) : null}
        </div>
      </div>
    </div>
  </section>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const TestimonialPage: React.FC<{ ready?: boolean }> = ({ ready = false }) => {
  const { data, status } = useTestimonialsPage();
  const pageRef = useRef<HTMLDivElement>(null);
  const { sections } = data;

  const featuredSlides: SlideContent[] =
    sections.featured_testimonials?.items?.map(cmsFeaturedToSlide) ?? [];
  const storyItems =
    sections.text_testimonials_grid?.items?.map(cmsToTestimonial) ?? [];

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
  }, [data.updated_at]);

  if (status === "loading") return <PageSkeleton />;
  if (status === "error") return <PageError />;

  return (
    <div ref={pageRef}>
      <PageSeo
        title="Client Reviews"
        description="Read what our clients say about Real Gold Properties — honest reviews from satisfied buyers, sellers and investors across Brisbane & Gold Coast."
        path="/testimonials"
        image="/images/testi-hero.jpg"
      />
      <CmsEditBar pageId={data.id} />
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
              icon={Star}
            />
            <RGPSplitSlider slides={featuredSlides} />
          </>
        ) : null}

        {sections.text_testimonials_grid ? (
          <StoriesGrid
            items={storyItems}
            eyebrow={sections.text_testimonials_grid.eyebrow}
            heading={sections.text_testimonials_grid.heading}
            subtitle={sections.text_testimonials_grid.subtitle}
          />
        ) : null}

        {sections.final_cta ? (
          <FinalCTA
            heading={sections.final_cta.heading}
            body={sections.final_cta.body}
            primary={sections.final_cta.primary}
            secondary={sections.final_cta.secondary}
          />
        ) : null}
      </main>

      {sections.cta ? (
        <RgpCta
          eyebrow={sections.cta.eyebrow}
          title={sections.cta.title}
          titleEm={sections.cta.title_em}
          text={sections.cta.text}
          primary={sections.cta.primary}
          secondary={sections.cta.secondary}
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
          button={sections.eoi_cta.button}
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
