import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, Mail, Phone, Send } from "lucide-react";
import HeroSection from "../sections/HeroSection";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import RgButton from "@/components/reusable/RgButton";
import { submitContactForm } from "@/lib/api/forms";
import "./ContactPage.css";

export default function ContactPage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLElement>(null);
  const ptWrapRef = useRef<HTMLDivElement>(null);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string>("Any type");
  const [ptOpen, setPtOpen] = useState(false);

  const PROPERTY_TYPES = [
    "Apartment",
    "Villa / Townhouse",
    "Penthouse",
    "Commercial",
    "Plot / Land",
  ];

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!ptOpen) return;
      const wrap = ptWrapRef.current;
      if (!wrap) return;
      if (e.target instanceof Node && !wrap.contains(e.target)) setPtOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPtOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ptOpen]);

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
            <RgButton
              href="tel:+61450009291"
              variant="gold"
              className="contact-hero-actions__link contact-hero-actions__link--primary"
              aria-label="Call us"
              label="Call Us"
              endIcon={<Phone size={18} aria-hidden="true" />}
            />
            <RgButton
              href="mailto:admin@realgoldproperties.com.au"
              variant="blue"
              className="contact-hero-actions__link contact-hero-actions__link--secondary"
              aria-label="Email us"
              label="Email Us"
              endIcon={<Mail size={18} aria-hidden="true" />}
            />
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

              <div className="c-item c-item--static" data-gsap="fade-up" data-gsap-delay="0.15">
                <div>
                  <p className="c-key">Office Hours</p>
                  <p className="c-val">All days</p>
                </div>
                <p className="c-val c-val--time">09:00 – 18:00</p>
              </div>
            </nav>

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
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const firstName = String(formData.get("first_name") ?? "").trim();
              const lastName = String(formData.get("last_name") ?? "").trim();
              const email = String(formData.get("email") ?? "").trim();
              const phone = String(formData.get("phone") ?? "").trim();
              const message = String(formData.get("message") ?? "").trim();
              const fullName = `${firstName} ${lastName}`.trim();

              setSubmitError(null);
              setIsSubmitting(true);
              try {
                await submitContactForm({
                  name: fullName || "Website enquiry",
                  email,
                  phone,
                  subject: `${intent} enquiry (${propertyType})`,
                  message:
                    `${message || "No additional message provided."}\n\n` +
                    `Intent: ${intent}\n` +
                    `Property type: ${propertyType}\n` +
                    `Budget: ${formatBudget(budget)}`,
                });
                setSuccess(true);
                form.reset();
                setPropertyType("Any type");
                setBudget(5_000_000);
              } catch {
                setSubmitError("Could not submit right now. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div className="fgrid">
              <div className="fg">
                <label htmlFor="fn">First Name</label>
                <input id="fn" name="first_name" type="text" placeholder="James" required />
              </div>
              <div className="fg">
                <label htmlFor="ln">Last Name</label>
                <input id="ln" name="last_name" type="text" placeholder="Crawford" required />
              </div>
              <div className="fg">
                <label htmlFor="em">Email</label>
                <input id="em" name="email" type="email" placeholder="james@example.com" required />
              </div>
              <div className="fg">
                <label htmlFor="ph">Phone</label>
                <input id="ph" name="phone" type="tel" placeholder="+61 4 0000 0000" />
              </div>
              <div
                className={`fg full fg--select${ptOpen ? " is-open" : ""}`}
                ref={ptWrapRef}
              >
                <label htmlFor="pt">Property Type</label>
                <button
                  id="pt"
                  type="button"
                  className="fg__select"
                  aria-haspopup="listbox"
                  aria-expanded={ptOpen}
                  aria-controls="pt-listbox"
                  onClick={() => setPtOpen((v) => !v)}
                >
                  <span className="fg__select-val">{propertyType}</span>
                  <ChevronDown size={18} className="fg__chev" aria-hidden="true" />
                </button>

                <div
                  id="pt-listbox"
                  className="fg__menu"
                  role="listbox"
                  aria-label="Property type options"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={propertyType === "Any type"}
                    className={`fg__opt${propertyType === "Any type" ? " is-active" : ""}`}
                    onClick={() => {
                      setPropertyType("Any type");
                      setPtOpen(false);
                    }}
                  >
                    Any type
                  </button>
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="option"
                      aria-selected={propertyType === t}
                      className={`fg__opt${propertyType === t ? " is-active" : ""}`}
                      onClick={() => {
                        setPropertyType(t);
                        setPtOpen(false);
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
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
                <textarea id="msg" name="message" placeholder="Preferred location, size, lifestyle needs…" />
              </div>
            </div>

            <div className="srow">
              <RgButton
                variant="gold"
                type="submit"
                label={isSubmitting ? "Sending..." : "Send Enquiry"}
                endIcon={<Send size={18} aria-hidden="true" />}
                disabled={isSubmitting}
              />
              <p className="s-note">
                We respond within
                <br />
                one business day.
              </p>
            </div>
            {submitError ? <p className="s-note">{submitError}</p> : null}
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

          <RgButton
            to="/expressions-of-interest"
            variant="gold"
            className="contact-cta__button"
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
            label="Open the Form"
            arrowSize={18}
          />
        </section>
      </div>

      <div
        className={`succ-modal${success ? " show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Enquiry received"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) setSuccess(false);
        }}
      >
        <div className="succ-modal__card" role="document">
          <button
            type="button"
            className="succ-modal__close"
            onClick={() => setSuccess(false)}
            aria-label="Close message"
          >
            ×
          </button>

          <span className="succ-modal__orn" aria-hidden="true">✦</span>
          <h2 className="succ-modal__title">
            Enquiry <em>Received.</em>
          </h2>
          <div className="succ-modal__rule" aria-hidden="true" />
          <p className="succ-modal__text">
            Thank you for reaching out to Real Gold Properties. One of our advisors will be in touch with you within one business day.
          </p>
        </div>
      </div>
    </main>
  );
}
