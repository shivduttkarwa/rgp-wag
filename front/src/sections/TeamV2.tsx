import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import assetUrl from "@/lib/assetUrl";
import { renderHeroAccentTokens } from "@/lib/heroTokens";
import type { TeamMemberData, TeamSectionData } from "@/types/teamPage";
import "./TeamV2.css";

gsap.registerPlugin(ScrollTrigger);

type TeamV2Props = {
  section: TeamSectionData;
  members: TeamMemberData[];
};

export default function TeamV2({ section, members }: TeamV2Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".tv2-card");
    if (!cards.length) return;

    gsap.set(cards, { clipPath: "inset(100% 0 0 0)", willChange: "clip-path" });

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    if (isMobile) {
      cards.forEach((card) => {
        const t = ScrollTrigger.create({
          trigger: card,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              clipPath: "inset(0% 0 0 0)",
              duration: 0.75,
              ease: "power3.inOut",
              onComplete: () => {
                gsap.set(card, { clearProps: "will-change,clip-path" });
              },
            });
          },
        });
        triggers.push(t);
      });
    } else {
      const t = ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cards, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            stagger: 0.12,
            onComplete: () => {
              gsap.set(cards, { clearProps: "will-change,clip-path" });
            },
          });
        },
      });
      triggers.push(t);
    }

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section className="tv2">
      <div className="tv2__container">

      {/* ── Header ── */}
      <header className="tv2__header">
        <div className="tv2__header-left">
          <span className="tv2__eyebrow">{section.eyebrow}</span>
          <h2 className="tv2__title">
            {renderHeroAccentTokens(section.title_line_1)} <br />
            {renderHeroAccentTokens(section.title_line_2)}
          </h2>
        </div>
        <p className="tv2__subtitle">
          {section.subtitle}
        </p>
      </header>

      <div className="tv2__rule" aria-hidden="true" />

      {/* ── Grid ── */}
      <div className="tv2__grid" ref={gridRef}>
        {members.map((m, i) => (
          <article
            key={m.id || m.slug || `${m.name}-${i}`}
            className="tv2-card"
          >
            {/* Photo — fills full card */}
            <div className="tv2-card__image">
              <img
                src={assetUrl(m.image)}
                alt={m.name}
                loading={i < 2 ? "eager" : "lazy"}
              />
            </div>

            {/* Gradient blend: image fades into card bg */}
            <div className="tv2-card__blend" aria-hidden="true" />

            {/* Rest state — index + name + role sit on the blend */}
            <div className="tv2-card__rest">
              <span className="tv2-card__index">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="tv2-card__name">{m.name}</h3>
              <p className="tv2-card__role">{m.role}</p>
            </div>

            {/* Hover panel — slides up */}
            <div className="tv2-card__panel" aria-hidden="true">
              <div className="tv2-card__panel-scroll">
                <span className="tv2-panel__index">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="tv2-panel__name">{m.name}</h3>
                <p className="tv2-panel__role">{m.role}</p>
                <div className="tv2-panel__rule" />
                <p className="tv2-panel__bio">{m.bio}</p>

                <div className="tv2-panel__stats">
                  {m.stats.map((s, idx) => (
                    <div key={idx} className="tv2-panel__stat">
                      <span className="tv2-panel__stat-val">{s.value}</span>
                      <span className="tv2-panel__stat-lbl">{s.label}</span>
                    </div>
                  ))}
                </div>

                <div className="tv2-panel__tags">
                  {m.tags.map((tag, idx) => (
                    <span key={idx} className="tv2-panel__tag">{tag}</span>
                  ))}
                </div>

                <div className="tv2-panel__actions">
                  {m.phone?.trim() ? (
                    <a
                      href={`tel:${m.phone.replace(/\s+/g, "")}`}
                      className="tv2-panel__btn tv2-panel__btn--gold"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      Call
                    </a>
                  ) : null}
                  {m.email?.trim() ? (
                    <a
                      href={`mailto:${m.email}`}
                      className="tv2-panel__btn tv2-panel__btn--outline"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Email
                    </a>
                  ) : null}
                  {m.social?.linkedin ? (
                    <a
                      href={m.social.linkedin}
                      className="tv2-panel__btn tv2-panel__btn--icon"
                      aria-label="LinkedIn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

          </article>
        ))}
      </div>

      </div>
    </section>
  );
}
