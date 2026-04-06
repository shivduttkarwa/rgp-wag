import { useMemo, useState } from "react";
import HeroSection from "../sections/HeroSection";
import "./AboutPage.css";

const base = import.meta.env.BASE_URL?.endsWith("/")
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const img = (name: string) => `${base}images/${name}`;

const accordionItems = [
  {
    title: "Legacy-Level Craftsmanship",
    body: "Every residence is curated with materials, trades, and finishes that age beautifully and perform for decades.",
  },
  {
    title: "View-First Site Planning",
    body: "We position every home to maximize light, landscape, and privacy — with outdoor living at the center.",
  },
  {
    title: "Lifestyle-Ready Amenities",
    body: "From wellness and entertaining to flexible workspaces, every plan is designed for how you live today.",
  },
  {
    title: "Enduring Value",
    body: "We focus on timeless design, premium locations, and low-maintenance materials that protect long-term value.",
  },
];

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const heroImage = useMemo(() => img("hero_architecture.jpg"), []);

  return (
    <>
      <HeroSection />
      <main className="about-page">
        {/* 1) HERO */}
        <section className="section">
          <div className="container center stack">
            <h1 className="hero-title h-serif">
              A Portfolio Of Exceptional
              <br />
              Residences Across Australia
            </h1>
          </div>
          <div className="hero-media">
            <img
              className="hero-img"
              alt="Real Gold Properties"
              src={heroImage}
            />
          </div>
        </section>

        {/* 2) STATEMENT + MARK */}
        <section className="section section-spacious">
          <div className="container center stack">
            <h2 className="intro-statement lead">
              Thoughtfully placed in the nation’s most admired enclaves,
              <br />
              Real Gold Properties represents a refined collection of bespoke
              homes and private estates.
            </h2>

            <div className="mark" aria-label="Real Gold Properties">
              <div className="mark-icon" aria-hidden="true" />
              <div className="twrap">
                <div className="t1">Real Gold</div>
                <div className="t2">PROPERTIES</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3) GREEN SPLIT */}
        <section className="split-green">
          <div className="container">
            <div className="wrap">
              <div className="img-card">
                <img alt="Coastal residence" src={img("ps1 (6).jpg")} />
              </div>
              <div className="stack">
                <h3 className="h-serif">
                  More Beautiful Than
                  <br />
                  You Expect
                </h3>
                <p>
                  We craft homes that become the center of life — places where
                  family, friends, and community gather year after year. Each
                  residence is designed to feel timeless, effortless, and deeply
                  personal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4) DREAM BIG */}
        <section className="section">
          <div className="container">
            <div className="two-col">
              <div className="copy stack">
                <div className="eyebrow">DREAM BIG</div>
                <h2 className="h-serif">
                  The Ideal Setting For Custom
                  <br />
                  Coastal &amp; City Residences
                </h2>
                <p>
                  Our projects balance bold architecture with a deep respect for
                  their surroundings. From waterfront sanctuaries to urban
                  penthouses, each home is built around light, space, and
                  enduring value.
                </p>
                <p className="copy-secondary">
                  We collaborate with leading architects, landscape designers,
                  and artisans to deliver residences that feel curated, not
                  constructed.
                </p>
              </div>
              <div>
                <img
                  className="img"
                  alt="Luxury pool"
                  src={img("ps1 (2).jpg")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5) ROOM TO BREATHE */}
        <section className="section section-tight">
          <div className="container">
            <div className="two-col two-col-center">
              <div className="copy stack">
                <h2 className="h-serif">Room To Breathe &amp; Be</h2>
                <p>
                  Every property is positioned for privacy, serenity, and
                  connection. Our communities are designed to feel both
                  exclusive and welcoming — a place to belong.
                </p>
              </div>
              <div className="slice-wrap">
                <div className="slice" aria-hidden="true" />
                <img className="img" alt="Landscape" src={img("ps1 (7).jpg")} />
              </div>
            </div>
          </div>
        </section>

        {/* 6) FEATURES / FACILITIES */}
        <section className="section section-mid">
          <div className="container">
            <div className="two-col two-col-start">
              <div>
                <h2 className="feature-title h-serif">Features / Facilities</h2>
                <div className="accordion">
                  {accordionItems.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <div
                        key={item.title}
                        className="acc-item"
                        data-open={isOpen ? "true" : "false"}
                      >
                        <button
                          className="acc-btn"
                          type="button"
                          onClick={() =>
                            setOpenIndex((prev) =>
                              prev === index ? -1 : index,
                            )
                          }
                        >
                          <span className="label">{item.title}</span>
                          <span className="icon">{isOpen ? "–" : "+"}</span>
                        </button>
                        <div className="acc-panel">
                          <div className="inner">{item.body}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <img
                  className="img"
                  alt="Coastal terrace"
                  src={img("ps1 (4).jpg")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7) AVAILABILITY */}
        <section className="avail">
          <div className="grid">
            <div className="photo">
              <img alt="Availability" src={img("ps1 (1).jpg")} />
            </div>
            <div className="panel">
              <div className="eyebrow">AVAILABILITY</div>
              <h3 className="h-serif">
                Own Your Piece
                <br />
                Of The Coast
              </h3>
              <p>
                Explore a curated selection of private estates, penthouses, and
                new releases across our portfolio.
              </p>
              <a className="link-underline" href="/properties">
                VIEW AVAILABLE PROPERTIES
              </a>
            </div>
          </div>
        </section>

        {/* 8) TURN-KEY */}
        <section className="img-overlay">
          <img alt="Turn-key residences" src={img("ps1 (5).jpg")} />
          <div className="overlay-card">
            <div
              className="mark"
              style={{ justifyContent: "flex-start", margin: "0 0 18px 0" }}
            >
              <div className="twrap" style={{ alignItems: "flex-start" }}>
                <div
                  className="t2"
                  style={{ color: "var(--green)", opacity: 0.75 }}
                >
                  REAL GOLD COLLECTION
                </div>
              </div>
            </div>
            <h3 className="h-serif">
              Turn-Key
              <br />
              Residences
            </h3>
            <p>
              Meticulously prepared homes, curated down to the smallest detail —
              ready for immediate move-in.
            </p>
            <a className="cta" href="/properties">
              LEARN MORE
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
