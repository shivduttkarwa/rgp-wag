import { useEffect, useRef } from "react";
import "./Differ.css";

interface DifferCard {
  number: string;
  heading: string;
  paragraph: string;
  graphicType: "circles" | "triangles" | "arrows";
}

const differData: DifferCard[] = [
  {
    number: "01",
    heading: "Grit with Vision",
    paragraph: "We think big by staying small – nimble, precise and creative.",
    graphicType: "circles",
  },
  {
    number: "02",
    heading: "Radical Transparency",
    paragraph:
      "We share openly with our partners, ensuring alignment and trust from the very beginning.",
    graphicType: "triangles",
  },
  {
    number: "03",
    heading: "Long-Term Alignment",
    paragraph:
      "We invest alongside our partners and focus on opportunities that stand the test of time.",
    graphicType: "arrows",
  },
];

const Differ: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    headingWordsRef.current.forEach((word) => {
      if (word) observer.observe(word);
    });

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const renderGraphic = (type: DifferCard["graphicType"]) => {
    switch (type) {
      case "circles":
        return (
          <div className="differ-graphic differ-graphic--circles">
            <div className="circle circle--inner" />
            <div className="circle circle--middle" />
            <div className="circle circle--outer" />
          </div>
        );
      case "triangles":
        return (
          <div className="differ-graphic differ-graphic--triangles">
            <div className="triangle triangle--1" />
            <div className="triangle triangle--2" />
          </div>
        );
      case "arrows":
        return (
          <div className="differ-graphic differ-graphic--arrows">
            <div className="arrow arrow--1" />
            <div className="arrow arrow--2" />
            <div className="arrow arrow--3" />
          </div>
        );
      default:
        return null;
    }
  };

  const headingWords = ["HOW", "WE", "DIFFER"];

  return (
    <section className="differ-section" ref={sectionRef}>
      <div className="differ-title">
        <div className="differ-title__heading-wrapper">
          <h2 className="differ-title__heading" aria-label="HOW WE DIFFER">
            {headingWords.map((word, index) => (
              <span
                key={word}
                className="differ-title__word-mask"
                ref={(el) => {
                  headingWordsRef.current[index] = el;
                }}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <span className="differ-title__word">{word}</span>
              </span>
            ))}
          </h2>
        </div>
        <div className="differ-title__subheader">
          <h3 className="differ-title__subheader-text">
            These 3 principles show how we work and why our partners stick with
            us — a clear perspective that guides every decision we make.
          </h3>
        </div>
      </div>

      <div className="differ-cards">
        <div className="differ-cards__container">
          <div className="differ-cards__wrapper">
            {differData.map((card, index) => (
              <div
                key={card.number}
                className={`differ-card differ-card--${index + 1}`}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="differ-card__text">
                  <h4 className="differ-card__heading">{card.heading}</h4>
                  <p className="differ-card__paragraph">{card.paragraph}</p>
                </div>
                <div className="differ-card__number">{card.number}</div>
                <div className="differ-card__graphic-wrapper">
                  {renderGraphic(card.graphicType)}
                </div>
              </div>
            ))}
          </div>

          <div className="differ-cards__bottom-text">
            <p className="differ-cards__bottom-paragraph">
              What sets us apart isn't just our{" "}
              <a href="/capabilities">capabilities</a>. It's how we show up and
              how we treat the people we work with. We bring a rare mix of
              humanity and clarity to every project – always keeping our
              investors, residents and community in view.
              <br />
              <br />
              Our upbringing taught us to keep our heads down, solve problems
              fast, and avoid the theater that often surrounds business. We
              don't posture — we perform. Every handshake, every hard
              conversation, every smart risk we take is part of building
              something that lasts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Differ;
