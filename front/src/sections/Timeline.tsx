import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BtnSecondary from "../components/BtnSecondary";
import "./Timeline.css";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  index: number;
  step: string;
  year: string;
  title: string;
  desc: string;
  metrics: { val: string; label: string }[];
  tags: string[];
  imgSrc: string;
  imgAlt: string;
}

const ALL_STEPS: Step[] = [
  {
    index: 0,
    step: "01",
    year: "2016",
    title: "Boutique by Choice",
    desc: "In 2016 we opened our doors with one promise: every client gets our full attention and clear, honest advice.",
    metrics: [
      { val: "2", label: "People" },
      { val: "1", label: "Office" },
    ],
    tags: ["Boutique", "Founded", "Local"],
    imgSrc:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=700&fit=crop",
    imgAlt: "2016",
  },
  {
    index: 1,
    step: "02",
    year: "2018",
    title: "Referred, Not Rented",
    desc: "Referrals became our engine as clients recommended us to the people who mattered most.",
    metrics: [
      { val: "70%", label: "Referral Share" },
      { val: "4.9", label: "Client Rating" },
    ],
    tags: ["Referrals", "Trust", "Growth"],
    imgSrc:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=700&fit=crop",
    imgAlt: "2018",
  },
  {
    index: 2,
    step: "03",
    year: "2020",
    title: "Local, Precise",
    desc: "We doubled down on local expertise, tight communication, and a repeatable standard of care.",
    metrics: [
      { val: "1", label: "Market" },
      { val: "12", label: "Team" },
    ],
    tags: ["Local", "Consistent", "Reliable"],
    imgSrc:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=700&fit=crop",
    imgAlt: "2020",
  },
  {
    index: 3,
    step: "04",
    year: "2023",
    title: "Process Refined",
    desc: "We refined our process, lifted standards, and made performance predictable.",
    metrics: [
      { val: "98%", label: "On-Time Follow Up" },
      { val: "4.9", label: "Review Score" },
    ],
    tags: ["Process", "Consistency", "Service"],
    imgSrc:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=700&fit=crop",
    imgAlt: "2023",
  },
  {
    index: 4,
    step: "05",
    year: "2026",
    title: "Performance, Proven",
    desc: "Performance in the last 12 months on realestate.com.au.",
    metrics: [
      { val: "$885k", label: "Median Sold Price" },
      { val: "21", label: "Median Days Advertised" },
      { val: "14", label: "Properties Sold (Lead Agent)" },
    ],
    tags: ["2026", "Snapshot", "These Are Our Numbers"],
    imgSrc:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=700&fit=crop",
    imgAlt: "2026",
  },
];

const MOBILE_STEPS: Step[] = [ALL_STEPS[0], ALL_STEPS[2], ALL_STEPS[4]];

export default function Timeline() {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const frameImgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const deviceFrameRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const contentRailRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const currentActiveRef = useRef<number>(0);
  const trackStartRef = useRef<number>(0);
  const trackEndRef = useRef<number>(0);
  const [steps, setSteps] = useState<Step[]>(ALL_STEPS);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 32.5rem)");
    const applySteps = () => {
      setSteps(media.matches ? MOBILE_STEPS : ALL_STEPS);
      setIsMobile(media.matches);
    };

    applySteps();
    media.addEventListener("change", applySteps);

    const panels = panelRefs.current.filter(Boolean) as HTMLDivElement[];
    const frameImgs = frameImgRefs.current.filter(Boolean) as HTMLDivElement[];
    const deviceFrame = deviceFrameRef.current;
    const progressTrack = progressTrackRef.current;
    const progressFill = progressFillRef.current;
    const contentRail = contentRailRef.current;

    const intro = introRef.current;
    if (!deviceFrame || !progressFill || !contentRail || !intro) return;

    const setTrackBounds = () => {
      if (!progressTrack || panels.length === 0) return;
      const first = panels[0];
      const last = panels[panels.length - 1];
      const firstCenter = first.offsetTop + first.offsetHeight / 2;
      const lastCenter = last.offsetTop + last.offsetHeight / 2;
      const total = contentRail.scrollHeight;
      trackStartRef.current = firstCenter;
      trackEndRef.current = lastCenter;
      progressTrack.style.top = `${firstCenter}px`;
      progressTrack.style.bottom = `${Math.max(total - lastCenter, 0)}px`;
    };

    setTrackBounds();
    window.addEventListener("resize", setTrackBounds);

    frameImgs.forEach((img, i) => {
      gsap.set(img, { opacity: i === 0 ? 1 : 0 });
    });

    panels[0]?.classList.add("rg-active");

    const triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    if (isMobile) {
      panels.forEach((panel, i) => {
        const img = panel.querySelector<HTMLElement>(".rg-panel-media");
        const contentEls = Array.from(
          panel.querySelectorAll<HTMLElement>(
            ".rg-panel-year, .rg-panel-title, .rg-panel-sep, .rg-panel-desc, .rg-panel-stats, .rg-panel-tags",
          ),
        );

        // Ensure all text elements are visible after any desktop animations.
        gsap.set(contentEls, { x: 0, opacity: 1 });

        const imgFrom = i % 2 === 0 ? -150 : 150;
        const contentFrom = -imgFrom;

        if (img) {
          triggers.push(
            ScrollTrigger.create({
              trigger: panel,
              start: "top 55%",
              end: "top 1%",
              scrub: 1,
              onEnter: () => activateStep(i, panels),
              onEnterBack: () => activateStep(i, panels),
              animation: gsap.fromTo(
                img,
                { x: imgFrom, opacity: 0 },
                { x: 0, opacity: 1, ease: "power2.out", duration: 0.6 },
              ),
            }),
          );
        }

        if (contentEls.length) {
          triggers.push(
            ScrollTrigger.create({
              trigger: panel,
              start: "top 55%",
              end: "top 1%",
              scrub: 1,
              animation: gsap.fromTo(
                contentEls,
                { x: contentFrom, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  ease: "power2.out",
                  duration: 0.6,
                  stagger: 0.08,
                },
              ),
            }),
          );
        }
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
        window.removeEventListener("resize", setTrackBounds);
        media.removeEventListener("change", applySteps);
      };
    }

    panels.forEach((panel, i) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: "top center",
          end: "bottom center",
          onEnter: () => activateStep(i, panels),
          onEnterBack: () => activateStep(i, panels),
        }),
      );

      if (i < panels.length - 1) {
        const DROP = 0.35;
        const DROP_PX = 80;

        triggers.push(
          ScrollTrigger.create({
            trigger: panels[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: 1.5,
            onUpdate: (self) => {
              const p = self.progress;
              let y: number, rotateY: number, tiltT: number;

              if (p <= DROP) {
                tiltT = 0;
                y = (p / DROP) * DROP_PX;
                rotateY = i * 180;
              } else {
                tiltT = (p - DROP) / (1 - DROP);
                y = (1 - tiltT) * DROP_PX;
                rotateY = i * 180 + tiltT * 180;
              }

              gsap.set(deviceFrame, {
                y,
                rotateY,
                scale: 1 - Math.sin(tiltT * Math.PI) * 0.04,
              });

              const norm = rotateY % 360;
              const frontFace = norm < 90 || norm >= 270;

              if (tiltT < 0.5) {
                gsap.set(frameImgs[i], {
                  opacity: 1,
                  scaleX: frontFace ? 1 : -1,
                });
                gsap.set(frameImgs[i + 1], { opacity: 0, scaleX: 1 });
              } else {
                gsap.set(frameImgs[i], { opacity: 0 });
                gsap.set(frameImgs[i + 1], {
                  opacity: 1,
                  scaleX: frontFace ? 1 : -1,
                });
              }

              deviceFrame.classList.toggle(
                "rg-flipping",
                tiltT > 0.05 && tiltT < 0.95,
              );
            },
            onLeave: () => {
              const endAngle = (i + 1) * 180;
              const norm = endAngle % 360;
              const frontFace = norm < 90 || norm >= 270;
              gsap.set(deviceFrame, { rotateY: endAngle, y: 0, scale: 1 });
              deviceFrame.classList.remove("rg-flipping");
              frameImgs.forEach((img, idx) => {
                const active = idx === i + 1;
                gsap.set(img, {
                  opacity: active ? 1 : 0,
                  scaleX: active && !frontFace ? -1 : 1,
                });
              });
            },
            onLeaveBack: () => {
              const startAngle = i * 180;
              const norm = startAngle % 360;
              const frontFace = norm < 90 || norm >= 270;
              gsap.set(deviceFrame, { rotateY: startAngle, y: 0, scale: 1 });
              deviceFrame.classList.remove("rg-flipping");
              frameImgs.forEach((img, idx) => {
                const active = idx === i;
                gsap.set(img, {
                  opacity: active ? 1 : 0,
                  scaleX: active && !frontFace ? -1 : 1,
                });
              });
            },
          }),
        );
      }

      const els = Array.from(
        panel.querySelectorAll<HTMLElement>(
          ".rg-panel-year, .rg-panel-title, .rg-panel-sep, .rg-panel-desc, .rg-panel-stats, .rg-panel-tags",
        ),
      );
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        els,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, ease: "power2.out", duration: 0.4 },
      );
      triggers.push(
        ScrollTrigger.create({
          trigger: panel,
          start: "top 45%",
          end: "top 1%",
          scrub: 1.2,
          animation: tl,
        }),
      );
    });

    triggers.push(
      ScrollTrigger.create({
        trigger: contentRail,
        start: () => `top+=${trackStartRef.current}px center`,
        end: () => `top+=${trackEndRef.current}px center`,
        scrub: 0.3,
        onUpdate: (self) => {
          progressFill.style.height = `${Math.min(self.progress, 1) * 100}%`;
        },
      }),
    );

    // Recalculate all scroll positions after the full page layout settles
    ScrollTrigger.refresh();
    setTrackBounds();

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("resize", setTrackBounds);
      media.removeEventListener("change", applySteps);
    };
  }, [steps]);

  function activateStep(index: number, panels: HTMLDivElement[]) {
    if (currentActiveRef.current === index) return;
    currentActiveRef.current = index;
    panels.forEach((p, i) => p.classList.toggle("rg-active", i === index));
  }

  return (
    <div className="rg-root">
      <section className="rg-intro" ref={introRef}>
        <span className="rg-intro-eyebrow" data-gsap="fade-up">
          Our Journey
        </span>
        <h2
          className="rg-intro-title"
          data-gsap="char-reveal"
          data-gsap-start="top 85%"
        >
          Precision, Discretion,{" "}
          <span className="rg-intro-highlight">Results</span>
        </h2>
        <p className="rg-intro-desc" data-gsap="fade-up" data-gsap-delay="0.15">
          We stay focused, we stay accountable, and we let the results speak.
        </p>
      </section>

      <section className="rg-timeline-container">
        <div className="rg-timeline-layout">
          <div className="rg-content-rail" ref={contentRailRef}>
            <div className="rg-progress-track" ref={progressTrackRef}>
              <div className="rg-progress-fill" ref={progressFillRef} />
            </div>

            {steps.map((s, i) => (
              <div
                key={s.year}
                className="rg-panel"
                data-index={i}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
              >
                <div className="rg-panel-dot" />

                {isMobile && (
                  <div className="rg-panel-media">
                    <img src={s.imgSrc} alt={s.imgAlt} />
                  </div>
                )}

                {/* Year — hero typographic element */}
                <p className="rg-panel-year">{s.year}</p>

                {/* Title */}
                <h2 className="rg-panel-title">{s.title}</h2>

                {/* Gold expanding separator */}
                <div className="rg-panel-sep" />

                {/* Description — short and sharp */}
                <p className="rg-panel-desc">{s.desc}</p>

                {/* Stats */}
                <div className="rg-panel-stats">
                  {s.metrics.map((m) => (
                    <div key={m.label} className="rg-stat">
                      <span className="rg-stat-val">{m.val}</span>
                      <span className="rg-stat-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tags — dot separated */}
                <p className="rg-panel-tags">
                  {s.tags.map((t, ti) => (
                    <span key={t}>
                      {ti > 0 && <span className="rg-tag-dot">·</span>}
                      {t}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>

          <div className="rg-image-rail">
            <div className="rg-frame-container">
              <div className="rg-device-frame" ref={deviceFrameRef}>
                <div className="rg-frame-images">
                  {steps.map((s, i) => (
                    <div
                      key={s.year}
                      className="rg-frame-img"
                      data-img={i}
                      ref={(el) => {
                        frameImgRefs.current[i] = el;
                      }}
                    >
                      <img src={s.imgSrc} alt={s.imgAlt} />
                      <div className="rg-frame-img-overlay" />
                      <span className="rg-frame-img-label">{s.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rg-end-section">
        <p className="rg-end-text" data-gsap="fade-left">
          Measured performance. <span>Clear outcomes.</span>
        </p>
        <div className="rg-end-cta">
          <BtnSecondary
            label="Explore Our Homes"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          />
        </div>
      </section>
    </div>
  );
}
