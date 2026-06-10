import { useEffect, useRef } from "react";
import InternalPageHero from "@/sections/InternalPageHero";
import RgpCta from "@/components/reusable/RgpCta";
import RgButton from "@/components/reusable/RgButton";
import "./AboutPage.css";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useServicesPage } from "@/hooks/useServicesPage";
import CmsEditBar from "@/components/reusable/CmsEditBar";
import PageSkeleton from "@/components/reusable/PageSkeleton";
import assetUrl from "@/lib/assetUrl";

export default function ServicesPage({ ready = false }: { ready?: boolean }) {
  const { data, status } = useServicesPage();
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

  if (status === "loading") return <PageSkeleton />;

  return (
    <>
      <CmsEditBar pageId={data.id} />
      {data.hero ? <InternalPageHero ready={ready} hero={data.hero} /> : null}
      <main className="about-page" ref={pageRef}>
        {/* 2) STATEMENT */}
        {data.intro ? (
        <section className="section section-spacious">
          <div className="container center stack">
            <h2 className="intro-statement lead" ref={introRef}>
              {data.intro.statement}
            </h2>
          </div>
        </section>
        ) : null}

        {/* 3) GREEN SPLIT — Buy */}
        {data.buy ? (
        <section className="split-green">
          <div className="container">
            <div className="wrap">
              <div className="stack">
                <h3 className="h-serif" data-gsap="char-reveal" data-gsap-start="top 90%">
                  {data.buy.heading}
                </h3>
                <p className="split-desc" data-gsap="fade-up" data-gsap-start="top 90%" data-gsap-delay="0.15">
                  {data.buy.p1}
                </p>
                <p className="split-desc" data-gsap="fade-up" data-gsap-start="top 90%" data-gsap-delay="0.25">
                  {data.buy.p2}
                </p>
                <div className="split-cta">
                  <RgButton
                    data-gsap="btn-clip-reveal"
                    data-gsap-delay="0.2"
                    variant="outline"
                    to={data.buy.cta_href}
                    label={data.buy.cta_label}
                  />
                </div>
              </div>
              <div className="img-card">
                <div className="split-img-clip">
                  {data.buy.image_url ? (
                    <img
                      data-gsap="clip-smooth-down"
                      data-gsap-start="top 90%"
                      data-gsap-delay="0.05"
                      data-gsap-mobile="clip-smooth-down"
                      data-gsap-mobile-cards-start="top 90%"
                      alt=""
                      src={assetUrl(data.buy.image_url)}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {data.cta ? (
          <RgpCta
            eyebrow={data.cta.eyebrow}
            title={data.cta.title}
            titleEm={data.cta.title_em}
            text={data.cta.text}
            primary={data.cta.primary}
            secondary={data.cta.secondary}
            stats={data.cta.stats}
          />
        ) : null}

        {/* 4) OVERLAY — Sell */}
        {data.sell ? (
        <section className="img-overlay">
          {data.sell.image_url ? <img alt="" src={assetUrl(data.sell.image_url)} /> : null}
          <div className="overlay-card" data-gsap="clip-reveal-left">
            <h3 className="h-serif">{data.sell.heading}</h3>
            <p>{data.sell.text}</p>
            <div className="overlay-cta">
              <RgButton variant="gold" to={data.sell.cta_href} label={data.sell.cta_label} />
            </div>
          </div>
        </section>
        ) : null}

        {/* 5) AVAILABILITY — Rent */}
        {data.rent ? (
        <section className="avail">
          <div className="grid">
            <div className="photo">
              {data.rent.image_url ? <img alt="" src={assetUrl(data.rent.image_url)} /> : null}
            </div>
            <div className="panel">
              <div className="eyebrow">RENT</div>
              <h3 className="h-serif" data-gsap="char-reveal" data-gsap-start="top 85%">
                {data.rent.heading}
              </h3>
              <p data-gsap="fade-up" data-gsap-delay="0.15">{data.rent.text}</p>
              <div className="avail-cta">
                <RgButton variant="outline" to={data.rent.cta_href} label={data.rent.cta_label} className="avail-cta__btn" />
              </div>
            </div>
          </div>
        </section>
        ) : null}
      </main>
    </>
  );
}
