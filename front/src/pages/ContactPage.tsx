import { useEffect, useMemo, useRef, useState } from "react";
import ReCaptchaV2, { type ReCaptchaV2Handle } from "@/components/reusable/ReCaptchaV2";
import { ChevronDown, Send } from "lucide-react";
import InternalPageHero from "@/sections/InternalPageHero";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import RgButton from "@/components/reusable/RgButton";
import { submitContactForm } from "@/lib/api/forms";
import { useContactPage } from "@/hooks/useContactPage";
import CmsEditBar from "@/components/reusable/CmsEditBar";
import PageSkeleton from "@/components/reusable/PageSkeleton";
import RgpCta from "@/components/reusable/RgpCta";
import EoiCta from "@/components/reusable/eoi-cta";
import "./ContactPage.css";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export default function ContactPage({ ready = false }: { ready?: boolean }) {
  const pageRef = useRef<HTMLElement>(null);
  const ptWrapRef = useRef<HTMLDivElement>(null);
  const { data, status } = useContactPage();
  const { sections } = data;

  const contactInfo = sections.contact_info;
  const contactForm = sections.contact_form;

  const intentOptions = contactForm?.intent_options ?? [];
  const propertyTypeOptions = contactForm?.property_type_options ?? [];

  const budgetMin = Math.max(0, contactForm?.budget_min || 0);
  const budgetMax = Math.max(budgetMin + 1, contactForm?.budget_max || budgetMin + 1);
  const budgetStep = Math.max(1, contactForm?.budget_step || 1);
  const budgetDefault = clamp(contactForm?.budget_default || budgetMin, budgetMin, budgetMax);
  const contactItems = useMemo(
    () =>
      contactInfo
        ? [
            {
              label: "Contact Number",
              value: contactInfo.contact_number,
              href: contactInfo.contact_number
                ? `tel:${contactInfo.contact_number.replace(/\s+/g, "")}`
                : "",
            },
            {
              label: "Email",
              value: contactInfo.email,
              href: contactInfo.email ? `mailto:${contactInfo.email}` : "",
            },
            {
              label: "Address",
              value: contactInfo.address,
              href: "",
            },
            {
              label: "Working Hours",
              value: contactInfo.working_hours,
              href: "",
            },
          ].filter((item) => item.value)
        : [],
    [
      contactInfo,
      contactInfo?.contact_number,
      contactInfo?.email,
      contactInfo?.address,
      contactInfo?.working_hours,
    ],
  );

  const intentOptionsKey = useMemo(() => intentOptions.join("||"), [intentOptions]);
  const propertyTypeOptionsKey = useMemo(
    () => propertyTypeOptions.join("||"),
    [propertyTypeOptions],
  );

  useEffect(() => {
    if (status === "loading") return;
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
  }, [status, data.updated_at]);

  const [intent, setIntent] = useState(intentOptions[0] || "");
  const [budget, setBudget] = useState(budgetDefault);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string>("Any type");
  const [ptOpen, setPtOpen] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef<ReCaptchaV2Handle>(null);

  useEffect(() => {
    setIntent((prev) => (intentOptions.includes(prev) ? prev : intentOptions[0] || ""));
  }, [intentOptionsKey, intentOptions]);

  useEffect(() => {
    setPropertyType((prev) => {
      if (prev === "Any type") return prev;
      return propertyTypeOptions.includes(prev) ? prev : "Any type";
    });
  }, [propertyTypeOptionsKey, propertyTypeOptions]);

  useEffect(() => {
    setBudget(budgetDefault);
  }, [budgetDefault]);

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
    if (value >= budgetMax) {
      const maxInM = (budgetMax / 1_000_000).toFixed(0);
      return `A$ ${maxInM}M+`;
    }
    if (value >= 1_000_000) {
      const v = (value / 1_000_000).toFixed(1).replace(/\.0$/, "");
      return `A$ ${v}M`;
    }
    return `A$ ${(value / 1000).toFixed(0)}K`;
  };

  if (status === "loading") return <PageSkeleton />;

  return (
    <>
      <CmsEditBar pageId={data.id} />
      <main className="contact-page" ref={pageRef}>
      {sections.hero && <InternalPageHero ready={ready} hero={sections.hero} />}

      {contactInfo || contactForm ? (
      <div className="contact-shell">
        <div className="top-rule" />

        <div className="page">
          {contactInfo ? (
          <section className="left">
            <div>
              <h1 className="hero-title" data-gsap="char-reveal" data-gsap-start="top 90%">
                {contactInfo.title}
              </h1>
              <p className="tagline" data-gsap="fade-up" data-gsap-delay="0.15">
                {contactInfo.tagline}
              </p>
            </div>

            <div>
              <nav className="c-list">
                {contactItems.map((item, index) => {
                  const delay = `${0.1 + index * 0.1}`;
                  if (!item.href) {
                    return (
                      <div
                        key={`${item.label}-${item.value}-${index}`}
                        className="c-item c-item--static"
                        data-gsap="fade-up"
                        data-gsap-delay={delay}
                      >
                        <div>
                          <p className="c-key">{item.label}</p>
                          <p className="c-val">{item.value}</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={`${item.label}-${item.value}-${index}`}
                      href={item.href}
                      className="c-item"
                      data-gsap="fade-up"
                      data-gsap-delay={delay}
                    >
                      <div>
                        <p className="c-key">{item.label}</p>
                        <p className="c-val">{item.value}</p>
                      </div>
                      <svg
                        className="c-arr"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                        />
                      </svg>
                    </a>
                  );
                })}
              </nav>

              <div className="quote" data-gsap="fade-up" data-gsap-delay="0.1">
                <blockquote>{contactInfo.quote_text}</blockquote>
                <cite>{contactInfo.quote_author}</cite>
              </div>
            </div>
          </section>
          ) : null}

          {contactForm ? (
          <section className="right">
            <p className="form-eyebrow" data-gsap="fade-up">{contactForm.eyebrow}</p>
            <h2 className="form-heading" data-gsap="char-reveal" data-gsap-start="top 85%">
              {contactForm.heading_line_1}
              <br />
              <em>{contactForm.heading_line_2}</em>
            </h2>
            <p className="form-sub" data-gsap="fade-up" data-gsap-delay="0.15">
              {contactForm.subtitle}
            </p>

            <div className="intents" data-gsap="fade-up" data-gsap-delay="0.2">
              {intentOptions.map((label) => (
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

                if (!recaptchaToken) {
                  setSubmitError("Please complete the reCAPTCHA.");
                  return;
                }

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
                    recaptcha_token: recaptchaToken,
                    website: "",
                  });
                  setSuccess(true);
                  form.reset();
                  setPropertyType("Any type");
                  setBudget(budgetDefault);
                  recaptchaRef.current?.reset();
                  setRecaptchaToken("");
                } catch (err) {
                  setSubmitError(
                    err instanceof Error
                      ? err.message
                      : "Could not submit right now. Please try again.",
                  );
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
                    {propertyTypeOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={propertyType === option}
                        className={`fg__opt${propertyType === option ? " is-active" : ""}`}
                        onClick={() => {
                          setPropertyType(option);
                          setPtOpen(false);
                        }}
                      >
                        {option}
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
                    style={{ width: `${((budget - budgetMin) / (budgetMax - budgetMin)) * 100}%` }}
                  />
                  <div
                    className="b-knob"
                    style={{ left: `${((budget - budgetMin) / (budgetMax - budgetMin)) * 100}%` }}
                  />
                  <input
                    className="b-input"
                    type="range"
                    min={budgetMin}
                    max={budgetMax}
                    step={budgetStep}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </div>
                <div className="b-ends">
                  <span>{formatBudget(budgetMin)}</span>
                  <span>{formatBudget(budgetMax)}</span>
                </div>
              </div>

              <div className="fgrid fgrid--last">
                <div className="fg full">
                  <label htmlFor="msg">Message</label>
                  <textarea id="msg" name="message" placeholder="Preferred location, size, lifestyle needs…" />
                </div>
              </div>

              {/* Honeypot — hidden from real users, filled by bots */}
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                defaultValue=""
                style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, pointerEvents: "none" }}
              />

              <ReCaptchaV2
                ref={recaptchaRef}
                onVerify={setRecaptchaToken}
                onExpire={() => setRecaptchaToken("")}
              />

              <div className="srow">
                <RgButton
                  variant="gold"
                  type="submit"
                  label={isSubmitting ? "Sending..." : "Send Enquiry"}
                  endIcon={<Send size={18} aria-hidden="true" />}
                  disabled={isSubmitting || !recaptchaToken}
                />
                <p className="s-note">{contactForm.submit_note}</p>
              </div>
              {submitError ? <p className="s-note">{submitError}</p> : null}
            </form>
          </section>
          ) : null}
        </div>
      </div>
      ) : null}

      {sections.cta && (
        <RgpCta
          eyebrow={sections.cta.eyebrow}
          title={sections.cta.title}
          titleEm={sections.cta.title_em}
          text={sections.cta.text}
          primary={sections.cta.primary}
          secondary={sections.cta.secondary}
          bgImage={sections.cta.background_image?.url}
          bgVideo={sections.cta.background_type === "video" ? sections.cta.background_video || undefined : undefined}
          posterImage={sections.cta.video_poster_image?.url}
          minHeight={sections.cta.min_height}
        />
      )}
      {sections.eoi_cta && (
        <EoiCta
          badgeText={sections.eoi_cta.badge_text}
          title={sections.eoi_cta.title}
          text={sections.eoi_cta.text}
          button={sections.eoi_cta.button}
          bgImage={sections.eoi_cta.background_image?.url}
          mobileBgImage={sections.eoi_cta.mobile_background_image?.url}
          minHeight={sections.eoi_cta.min_height}
          mobileMinHeight={sections.eoi_cta.mobile_min_height}
        />
      )}

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
    </>
  );
}
