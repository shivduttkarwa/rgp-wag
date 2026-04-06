import { useEffect, useRef } from "react";
import BtnSecondary from "../components/BtnSecondary";
import HeroSection from "../sections/HeroSection";
import PropertyMarqee from "../components/reusable/PropertyMarqee";
import ServiceSelection from "../sections/ServiceSelection";
import "./AboutPage.css";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Building,
  CalendarCheck,
  Home,
  Key,
  Search,
  TrendingUp,
} from "lucide-react";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const img = (name: string) => `${base}images/${name}`;

export default function ServicesPage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLHeadingElement | null>(null);
  const introMaxProgressRef = useRef(0);

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
    return () => cleanup?.();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = introRef.current;
    if (!el || el.dataset.linesSplit === "true") return;
    el.dataset.linesSplit = "true";

    const fragment = document.createDocumentFragment();
    const nodes = Array.from(el.childNodes);

    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || "";
        text.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else {
            const span = document.createElement("span");
            span.className = "intro-word";
            span.textContent = part;
            fragment.appendChild(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName.toLowerCase() === "br") {
          fragment.appendChild(document.createTextNode(" "));
          return;
        }
        const text = element.textContent || "";
        const span = document.createElement("span");
        const isGold = element.classList.contains("gold-word");
        span.className = isGold ? "intro-word gold-word" : "intro-word";
        span.textContent = text;
        fragment.appendChild(span);
      }
    });

    el.innerHTML = "";
    el.appendChild(fragment);

    const words = Array.from(el.querySelectorAll<HTMLElement>(".intro-word"));
    if (!words.length) return;

    // Group words by rendered line (supports responsive line wrapping).
    const lines: HTMLElement[][] = [];
    let currentTop: number | null = null;
    let lineWords: HTMLElement[] = [];

    words.forEach((word) => {
      const top = word.offsetTop;
      if (currentTop === null) currentTop = top;
      if (Math.abs(top - currentTop) > 2) {
        lines.push(lineWords);
        lineWords = [];
        currentTop = top;
      }
      lineWords.push(word);
    });
    if (lineWords.length) lines.push(lineWords);

    el.innerHTML = "";
    lines.forEach((line) => {
      const lineWrap = document.createElement("span");
      lineWrap.className = "intro-line";
      const lineText = document.createElement("span");
      lineText.className = "intro-line-text";
      lineWrap.appendChild(lineText);
      line.forEach((word, i) => {
        lineText.appendChild(word);
        if (i < line.length - 1) {
          lineText.appendChild(document.createTextNode(" "));
        }
      });
      el.appendChild(lineWrap);
    });

    const lineTexts = el.querySelectorAll<HTMLElement>(".intro-line-text");
    gsap.set(lineTexts, { yPercent: 100, autoAlpha: 0 });
    const tl = gsap.to(lineTexts, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.12,
      paused: true,
    });

    introMaxProgressRef.current = 0;
    ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      end: "top 25%",
      scrub: true,
      onUpdate: (self) => {
        const next = Math.max(self.progress, introMaxProgressRef.current);
        introMaxProgressRef.current = next;
        tl.progress(next);
        if (next >= 1) {
          tl.progress(1);
          self.kill();
        }
      },
    });
  }, []);

  return (
    <>
      <HeroSection
        ready={ready}
        showVideo={false}
        showCta={false}
        bgImage="images/hero1.jpg"
        titleLine1={
          <>
            Services For <span className="rg-gold">Buyers</span>
          </>
        }
        titleLine2={
          <>
            Sellers & <span className="rg-amber">Renters</span>
          </>
        }
        subtitle="We handle the full journey — buying, selling, and leasing — with strategy, precision, and a calm, boutique approach."
      />
      <main className="about-page" ref={pageRef}>
        {/* 2) STATEMENT */}
        <section className="section section-spacious">
          <div className="container center stack">
            <h2 className="intro-statement lead" ref={introRef}>
              A <span className="gold-word">full-service</span> partner for{" "}
              <span className="gold-word">buying</span>,{" "}
              <span className="gold-word">selling</span>, and{" "}
              <span className="gold-word">renting</span> — with clarity in the
              plan and confidence in the outcome.
            </h2>
          </div>
        </section>

        {/* 3) GREEN SPLIT */}
        <section className="split-green">
          <div className="container">
            <div className="wrap">
              <div className="stack">
                <h3
                  className="h-serif"
                  data-gsap="char-reveal"
                  data-gsap-start="top 90%"
                >
                  Buy With Confidence
                  <br />
                  From Day One
                </h3>
                <p
                  className="split-desc"
                  data-gsap="fade-up"
                  data-gsap-start="top 90%"
                  data-gsap-delay="0.15"
                >
                  We narrow the field quickly, secure the right property, and
                  negotiate from strength — so you buy well without noise or
                  pressure.
                </p>
                <p
                  className="split-desc"
                  data-gsap="fade-up"
                  data-gsap-start="top 90%"
                  data-gsap-delay="0.25"
                >
                  From off‑market access to finance coordination, we manage the
                  details so you can focus on the decision that matters.
                </p>
                <div className="split-cta">
                  <BtnSecondary
                    data-gsap="btn-clip-reveal"
                    data-gsap-delay="0.2"
                    label="Explore Our Homes"
                  />
                </div>
              </div>
              <div className="img-card">
                <div className="split-img-clip">
                  <img
                    data-gsap="clip-smooth-down"
                    data-gsap-start="top 90%"
                    data-gsap-delay="0.05"
                    data-gsap-mobile="clip-smooth-down"
                    data-gsap-mobile-cards-start="top 90%"
                    alt="Buyer guidance"
                    src={img("ps1 (6).jpg")}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ServiceSelection
          header={{
            eyebrow: "Our Services",
            title: "Buy, Sell &",
            titleEm: "Rent",
            subtitle:
              "One team, three core services — handled with clarity, speed, and market‑ready execution.",
          }}
          services={[
            {
              id: "buy",
              icon: Search,
              secondaryIcon: Key,
              headline: "Buy",
              title: "Buyer",
              subtitle: "Representation",
              description:
                "Search, shortlist, and negotiate with confidence. We secure access, run the numbers, and protect your position.",
              features: [
                "Off‑market access and shortlists",
                "Pricing guidance and negotiation",
                "Contract support and due diligence",
              ],
              cta: "Start Buying",
              theme: "buy",
            },
            {
              id: "sell",
              icon: TrendingUp,
              secondaryIcon: Home,
              headline: "Sell",
              title: "Sales",
              subtitle: "Strategy",
              description:
                "Positioned pricing, premium presentation, and targeted marketing to create competition and lift results.",
              features: [
                "Pricing strategy and campaign plan",
                "Styling, media, and buyer targeting",
                "Auction or private treaty management",
              ],
              cta: "Plan My Sale",
              theme: "sell",
            },
            {
              id: "rent",
              icon: CalendarCheck,
              secondaryIcon: Building,
              headline: "Rent",
              title: "Leasing",
              subtitle: "Management",
              description:
                "End‑to‑end leasing with reliable tenants, clear reporting, and proactive maintenance care.",
              features: [
                "Tenant screening and onboarding",
                "Rent collection and inspections",
                "Ongoing management and renewals",
              ],
              cta: "Lease My Property",
              theme: "rent",
            },
          ]}
          cta={{
            eyebrow: "Ready to Move?",
            title: "Get a",
            titleEm: "Tailored Plan",
            text: "Tell us your goal and timeline — we’ll map the smartest path and execute with precision.",
            primaryLabel: "Book a Consultation",
            primaryHref: "/contact",
            secondaryLabel: "0450 009 291",
            secondaryHref: "tel:+61450009291",
          }}
        />

        {/* 4) TURN-KEY */}
        <section className="img-overlay">
          <img alt="Selling strategy" src={img("ps1 (5).jpg")} />
          <div className="overlay-card" data-gsap="clip-reveal-left">
            <h3 className="h-serif">
              Sell With
              <br />
              Clear Strategy
            </h3>
            <p>
              Pricing, positioning, staging, and marketing — engineered to drive
              competition and protect your final result.
            </p>
            <div className="overlay-cta">
              <BtnSecondary label="Request a Valuation" />
            </div>
          </div>
        </section>

        {/* 5) AVAILABILITY */}
        <section className="avail">
          <div className="grid">
            <div className="photo">
              <img alt="Rental service" src={img("ps1 (1).jpg")} />
            </div>
            <div className="panel">
              <div className="eyebrow">RENT</div>
              <h3
                className="h-serif"
                data-gsap="char-reveal"
                data-gsap-start="top 85%"
              >
                Lease With
                <br />
                Confidence
              </h3>
              <p data-gsap="fade-up" data-gsap-delay="0.15">
                Premium leasing, tenant screening, and ongoing care that keeps
                your property protected and performing.
              </p>
              <div className="avail-cta">
                <BtnSecondary
                  label="View Available Rentals"
                  color="#00032e"
                  className="avail-cta__btn"
                />
              </div>
            </div>
          </div>
        </section>

        <PropertyMarqee />
      </main>
    </>
  );
}
