import { useState, useRef, useEffect } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSection from "../sections/HeroSection";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import "./ContactPage.css";

export default function ContactPage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLElement>(null);

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
  }, []);

  const [intent, setIntent] = useState("Buy");
  const [budget, setBudget] = useState(5_000_000);
  const [success, setSuccess] = useState(false);

  const formatBudget = (value: number) => {
    if (value >= 20_000_000) return "A$ 20M+";
    if (value >= 1_000_000) {
      const v = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
      return `A$ ${v}M`;
    }
    return `A$ ${(value / 1000).toFixed(0)}K`;
  };

  return (
    <main className="contact-page" ref={pageRef}>
      <HeroSection
        ready={ready}
        showVideo={false}
        showCta={false}
        bgImage="images/contact-hero.jpg"
        titleLine1={
          <>
            Get In <span className="rg-gold">Touch</span>
          </>
        }
        titleLine2={
          <>
            <span className="rg-amber">We're</span> Here
          </>
        }
        subtitle="Our team is ready to guide you — from first enquiry to final key."
        panel={
          <div className="contact-hero-actions">
            <a
              href="tel:+61450009291"
              className="btn-secondary contact-hero-actions__link contact-hero-actions__link--primary"
              aria-label="Call us"
            >
              <span className="bs-text">Call Us</span>
            </a>
            <a
              href="mailto:admin@realgoldproperties.com.au"
              className="btn-secondary contact-hero-actions__link contact-hero-actions__link--secondary"
              aria-label="Email us"
            >
              <span className="bs-text">Email Us</span>
            </a>
          </div>
        }
      />

      <div className="contact-shell">
        <div className="top-rule" />

        <div className="page">
        {/* LEFT */}
        <section className="left">
          <div>
            <h1 className="hero-title" data-gsap="char-reveal" data-gsap-start="top 90%">
              Let's Talk
              <em>Appraisal.</em>
            </h1>
            <p className="tagline" data-gsap="fade-up" data-gsap-delay="0.15">
              Whether you're buying, selling, or investing — our advisors are ready to guide
              you through every step.
            </p>
          </div>

          <div>
            <nav className="c-list">
              <a href="tel:+61450009291" className="c-item" data-gsap="fade-up" data-gsap-delay="0.1">
                <div>
                  <p className="c-key">Phone</p>
                  <p className="c-val">0450 009 291</p>
                </div>
                <svg className="c-arr" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
              <a href="mailto:admin@realgoldproperties.com.au" className="c-item" data-gsap="fade-up" data-gsap-delay="0.2">
                <div>
                  <p className="c-key">Email</p>
                  <p className="c-val">admin@realgoldproperties.com.au</p>
                </div>
                <svg className="c-arr" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
              <a href="#" className="c-item" data-gsap="fade-up" data-gsap-delay="0.3">
                <div>
                  <p className="c-key">Visit</p>
                  <p className="c-val">Forest Lake, Brisbane QLD 4078</p>
                </div>
                <svg className="c-arr" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            </nav>

            <div className="hours" data-gsap="fade-up" data-gsap-delay="0.15">
              <p className="h-label">Office Hours</p>
              <div className="h-row"><span className="h-day">All days</span><span className="h-time">09:00 – 18:00</span></div>
            </div>

            <div className="quote" data-gsap="fade-up" data-gsap-delay="0.1">
              <blockquote>
                "Real estate is not just a transaction — it is the beginning of a life lived better."
              </blockquote>
              <cite>— Our Promise</cite>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="right">
          <p className="form-eyebrow" data-gsap="fade-up">Begin your enquiry</p>
          <h2 className="form-heading" data-gsap="char-reveal" data-gsap-start="top 85%">
            Tell us what you're
            <br />
            <em>looking for.</em>
          </h2>
          <p className="form-sub" data-gsap="fade-up" data-gsap-delay="0.15">
            Fill in the details and a specialist will respond within one business day.
          </p>

          <div className="intents" data-gsap="fade-up" data-gsap-delay="0.2">
            {["Buy", "Sell", "Rent", "Invest", "Off-Plan", "Valuation"].map((label) => (
              <button
                key={label}
                type="button"
                className={`ip${intent === label ? " on" : ""}`}
                onClick={() => setIntent(label)}
              >
                {label}
              </button>
            ))}
          </div>

          <form
            data-gsap="clip-smooth-down"
            data-gsap-delay="0.25"
            data-gsap-start="top 85%"
            onSubmit={(e) => {
              e.preventDefault();
              setSuccess(true);
            }}
          >
            <div className="fgrid">
              <div className="fg">
                <label htmlFor="fn">First Name</label>
                <input id="fn" type="text" placeholder="James" required />
              </div>
              <div className="fg">
                <label htmlFor="ln">Last Name</label>
                <input id="ln" type="text" placeholder="Crawford" required />
              </div>
              <div className="fg">
                <label htmlFor="em">Email</label>
                <input id="em" type="email" placeholder="james@example.com" required />
              </div>
              <div className="fg">
                <label htmlFor="ph">Phone</label>
                <input id="ph" type="tel" placeholder="+61 4 0000 0000" />
              </div>
              <div className="fg full">
                <label htmlFor="pt">Property Type</label>
                <select id="pt">
                  <option value="">Any type</option>
                  <option>Apartment</option>
                  <option>Villa / Townhouse</option>
                  <option>Penthouse</option>
                  <option>Commercial</option>
                  <option>Plot / Land</option>
                </select>
              </div>
            </div>

            <div className="budget">
              <div className="b-head">
                <span className="b-lbl">Budget</span>
                <span className="b-val">{formatBudget(budget)}</span>
              </div>
              <div className="b-track">
                <div
                  className="b-fill"
                  style={{ width: `${((budget - 500_000) / (20_000_000 - 500_000)) * 100}%` }}
                />
                <div
                  className="b-knob"
                  style={{ left: `${((budget - 500_000) / (20_000_000 - 500_000)) * 100}%` }}
                />
                <input
                  className="b-input"
                  type="range"
                  min={500_000}
                  max={20_000_000}
                  step={500_000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                />
              </div>
              <div className="b-ends">
                <span>A$ 500K</span>
                <span>A$ 20M+</span>
              </div>
            </div>

            <div className="fgrid fgrid--last">
              <div className="fg full">
                <label htmlFor="msg">Message</label>
                <textarea id="msg" placeholder="Preferred location, size, lifestyle needs…" />
              </div>
            </div>

            <div className="srow">
              <button type="submit" className="btn">
                Send Enquiry
              </button>
              <p className="s-note">
                We respond within
                <br />
                one business day.
              </p>
            </div>
            </form>
          </section>
        </div>

        <section
          className="contact-cta"
          data-gsap="clip-smooth-down"
          data-gsap-start="top 88%"
        >
          <div className="contact-cta__copy">
            <div className="contact-cta__badge" data-gsap="fade-up">
              <FileText size={20} />
              <span>Expression of Interest</span>
            </div>
            <h3
              className="contact-cta__title"
              data-gsap="char-reveal"
              data-gsap-start="top 88%"
            >
              Need to submit a detailed property offer?
            </h3>
            <p
              className="contact-cta__text"
              data-gsap="fade-up"
              data-gsap-delay="0.14"
            >
              Use our full Expression of Interest form to share buyer details,
              offer terms, conditions, and solicitor information in one clean
              submission.
            </p>
          </div>

          <Link
            to="/expressions-of-interest"
            className="contact-cta__button"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          >
            <span>Open the Form</span>
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>

      <div className={`succ${success ? " show" : ""}`} role="dialog" aria-modal="true">
        <div className="sc">
          <span className="sc-orn">✦</span>
          <h2>
            Enquiry <em>Received.</em>
          </h2>
          <div className="sc-rule" />
          <p>
            Thank you for reaching out to Real Gold Properties. One of our
            advisors will be in touch with you within one business day.
          </p>
          <button type="button" className="sc-btn" onClick={() => setSuccess(false)}>
            Return to page
          </button>
        </div>
      </div>
    </main>
  );
}
