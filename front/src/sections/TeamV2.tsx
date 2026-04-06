import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TeamV2.css";

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  stats: { value: string; label: string }[];
  tags: string[];
  email: string;
  phone: string;
  social: { linkedin?: string };
}

const MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Rahul Singh",
    role: "Founder & Chief Executive",
    bio: "Founder and driving force behind RGP, building a boutique luxury real estate agency from the ground up. Brings a sharp investor mindset and deep market insight to every client engagement.",
    image: "images/rahul-singh.jpg",
    stats: [
      { value: "5+", label: "Years" },
      { value: "$850M", label: "Volume" },
      { value: "120+", label: "Properties" },
    ],
    tags: ["Luxury Estates", "Investment Strategy", "Market Analysis"],
    email: "rahul@luxestate.com",
    phone: "+61450009291",
    social: { linkedin: "#" },
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Senior Property Agent",
    bio: "Specialist in premium residential properties with a sharp eye for matching clients to their ideal home. Known for a patient, consultative approach and strong follow-through.",
    image: "images/team3.png",
    stats: [
      { value: "5", label: "Years" },
      { value: "$180M", label: "Closed" },
      { value: "96%", label: "Retention" },
    ],
    tags: ["Luxury Residential", "Buyer Consulting", "New Developments"],
    email: "sarah@luxestate.com",
    phone: "+61400000002",
    social: { linkedin: "#" },
  },
  {
    id: 3,
    name: "Michael Ross",
    role: "Senior Property Agent",
    bio: "Trusted for seamless transactions and deep local market knowledge. Specialises in off-market opportunities and exclusive listings for private clients.",
    image: "images/team4.png",
    stats: [
      { value: "5", label: "Years" },
      { value: "$220M", label: "Closed" },
      { value: "60+", label: "Properties" },
    ],
    tags: ["Off-Market Listings", "Negotiations", "Premium Rentals"],
    email: "michael@luxestate.com",
    phone: "+61400000003",
    social: { linkedin: "#" },
  },
  {
    id: 4,
    name: "Emma Williams",
    role: "Property Agent",
    bio: "Detail-oriented agent with a background in interior design, offering clients a unique perspective on property potential, layout, and value-add opportunities.",
    image: "images/team2.png",
    stats: [
      { value: "3", label: "Years" },
      { value: "$95M", label: "Closed" },
      { value: "40+", label: "Properties" },
    ],
    tags: ["Residential Sales", "Interior Advisory", "First-Time Buyers"],
    email: "emma@luxestate.com",
    phone: "+61400000004",
    social: { linkedin: "#" },
  },
  {
    id: 5,
    name: "David Park",
    role: "Property Agent",
    bio: "Results-driven agent with strong analytical skills and an investor mindset. Guides clients through both end-use and investment purchases with clarity and confidence.",
    image: "images/team5.png",
    stats: [
      { value: "2", label: "Years" },
      { value: "$75M", label: "Closed" },
      { value: "35+", label: "Properties" },
    ],
    tags: ["Investment Properties", "Resale", "Market Analysis"],
    email: "david@luxestate.com",
    phone: "+61400000005",
    social: { linkedin: "#" },
  },
];

const BASE = import.meta.env.BASE_URL || "/";

export default function TeamV2() {
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

      {/* ── Header ── */}
      <header className="tv2__header">
        <div className="tv2__header-left">
          <span className="tv2__eyebrow">Our People</span>
          <h2 className="tv2__title">
            The Minds <em>Behind</em>
            <br />Every Deal
          </h2>
        </div>
        <p className="tv2__subtitle">
          A curated ensemble of creative minds and industry veterans — each
          bringing unmatched expertise to every client engagement.
        </p>
      </header>

      <div className="tv2__rule" aria-hidden="true" />

      {/* ── Grid ── */}
      <div className="tv2__grid" ref={gridRef}>
        {MEMBERS.map((m, i) => (
          <article
            key={m.id}
            className="tv2-card"
          >
            {/* Photo — fills full card */}
            <div className="tv2-card__image">
              <img
                src={`${BASE}${m.image}`}
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
                  <a
                    href={`tel:${m.phone}`}
                    className="tv2-panel__btn tv2-panel__btn--gold"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call
                  </a>
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
                  {m.social.linkedin && (
                    <a
                      href={m.social.linkedin}
                      className="tv2-panel__btn tv2-panel__btn--icon"
                      aria-label="LinkedIn"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

          </article>
        ))}
      </div>

    </section>
  );
}
