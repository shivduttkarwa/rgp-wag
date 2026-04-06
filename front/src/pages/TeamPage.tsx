import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import BtnSecondary from "../components/BtnSecondary";
import Team from "../sections/TeamV2";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import "./TeamPage.css";


const VALUES = [
  {
    number: "01",
    keyword: "Trust",
    title: "Integrity First",
    body: "Every recommendation we make is backed by honest data and transparent advice — no hidden agendas, no inflated figures.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"/>
        <polyline points="9,12 11,14 15,10"/>
      </svg>
    ),
  },
  {
    number: "02",
    keyword: "People",
    title: "Client-Centric",
    body: "We listen before we speak. Understanding your goals, timeline, and concerns shapes every decision we take on your behalf.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
  {
    number: "03",
    keyword: "Detail",
    title: "Precision & Detail",
    body: "From market appraisals to contract negotiations, we execute with meticulous attention to the details that move outcomes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/>
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
  {
    number: "04",
    keyword: "Vision",
    title: "Long-term Thinking",
    body: "We're not here for one transaction. We're building relationships that serve your property journey for decades.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
  },
];

export default function TeamPage({ ready = false }: { ready?: boolean }) {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <>
      <HeroSection
        ready={ready}
        showVideo={false}
        showCta={false}
        panel={
          <BtnSecondary
            label="Book a Consultation"
            onClick={() => navigate("/contact")}
          />
        }
        bgImage="images/about-hero.jpg"
        titleLine1={<>Meet Our</>}
        titleLine2={
          <>
            Expert <span className="rg-gold">Team</span>
          </>
        }
        subtitle="A curated ensemble of creative minds and industry veterans shaping the future of luxury real estate."
      />

      <main className="team-page" ref={pageRef}>
        {/* ── Expanding cards ── */}
        <Team />
       

        {/* ── Values ── */}
        <section className="tp-values">
          <div className="tp-container">

            {/* Header — split row */}
            <div className="tp-values__header">
              <div className="tp-values__header-left">
                <span className="tp-eyebrow" data-gsap="fade-up">What Drives Us</span>
                <h2 className="tp-heading" data-gsap="char-reveal">
                  Our Core <em>Values</em>
                </h2>
              </div>
              <p className="tp-values__desc" data-gsap="fade-up" data-gsap-delay="0.12">
                The principles behind every recommendation, every relationship, and every result we deliver.
              </p>
            </div>

            {/* 2×2 bento grid */}
            <div className="tp-values__grid">
              {VALUES.map((v, i) => (
                <article
                  key={v.number}
                  className="tp-vc"
                  data-gsap="clip-smooth"
                  data-gsap-duration="0.75"
                  data-gsap-start="top 92%"
                  data-gsap-delay={String(i * 0.08)}
                >
                  {/* Ghost watermark number */}
                  <span className="tp-vc__ghost" aria-hidden="true">{v.number}</span>

                  {/* Icon */}
                  <div className="tp-vc__icon">{v.icon}</div>

                  {/* Content */}
                  <div className="tp-vc__content">
                    <h3 className="tp-vc__title">{v.title}</h3>
                    <p className="tp-vc__body">{v.body}</p>
                  </div>

                  {/* Footer */}
                  <div className="tp-vc__foot">
                    <span className="tp-vc__kw">{v.keyword}</span>
                    <span className="tp-vc__num">{v.number}</span>
                  </div>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* ── Join us CTA ── */}
        <section className="tp-join">
          <div className="tp-container">
            <div className="tp-join__inner">
              <div className="tp-join__text">
                <span
                  className="tp-eyebrow"
                  data-gsap="fade-up"
                >
                  Careers
                </span>
                <h2
                  className="tp-heading"
                  data-gsap="char-reveal"
                  data-gsap-start="top 85%"
                >
                  Interested in <em>Joining</em>
                  <br />the Team?
                </h2>
                <p
                  className="tp-join__body"
                  data-gsap="fade-up"
                  data-gsap-delay="0.12"
                >
                  We're always looking for exceptional talent — people who
                  combine market intelligence with genuine care for their
                  clients. If that sounds like you, we'd love to talk.
                </p>
                <div
                  className="tp-join__actions"
                  data-gsap="fade-up"
                  data-gsap-delay="0.2"
                >
                  <Link to="/contact" className="tp-btn-primary">
                    Get in Touch
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </Link>
                  <Link to="/about" className="tp-btn-ghost">
                    Learn About Us
                  </Link>
                </div>
              </div>

              <div className="tp-join__image">
                <div
                  className="tp-join__img-wrap"
                  data-gsap="clip-reveal-right"
                  data-gsap-start="top 75%"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}images/about-hero.jpg`}
                    alt="Our office environment"
                    loading="lazy"
                  />
                  <div className="tp-join__img-badge">
                    <span className="tp-join__badge-num">5+</span>
                    <span className="tp-join__badge-label">Years of Excellence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
