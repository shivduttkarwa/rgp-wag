import { useEffect, useRef, useState, type FormEvent } from "react";
import HeroSection from "../sections/HeroSection";
import { initGsapSwitchAnimations } from "@/lib/gsapSwitchAnimations";
import "./ExpressionOfInterestPage.css";

type FieldType = "text" | "email" | "tel" | "number" | "textarea" | "select";

type FieldConfig = {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  full?: boolean;
  autoComplete?: string;
  options?: Array<{ label: string; value: string }>;
};

type FieldSection = {
  number: string;
  title: string;
  description: string;
  fields: FieldConfig[];
};

const YES_NO_OPTIONS = [
  { label: "Please select", value: "" },
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const FORM_SECTIONS: FieldSection[] = [
  {
    number: "01",
    title: "Property & Primary Buyer",
    description:
      "Provide the property address together with the first purchaser's full legal name and contact details.",
    fields: [
      {
        id: "propertyAddress",
        name: "property_address",
        label: "Property Address",
        type: "textarea",
        placeholder: "Street address, suburb, state and postcode",
        required: true,
        rows: 3,
        full: true,
      },
      {
        id: "buyer1FullLegalName",
        name: "buyer_1_full_legal_name",
        label: "Buyer 1 - Full Legal Name:",
        type: "text",
        placeholder: "Full legal name as it will appear on the contract",
        required: true,
        autoComplete: "name",
      },
      {
        id: "addressBuyer1",
        name: "address_buyer_1",
        label: "Address - Buyer 1",
        type: "textarea",
        placeholder: "Current residential address",
        required: true,
        rows: 3,
        full: true,
      },
      {
        id: "phoneBuyer1",
        name: "phone_buyer_1",
        label: "Phone - Buyer 1",
        type: "tel",
        placeholder: "Best contact number",
        required: true,
        autoComplete: "tel",
      },
      {
        id: "emailBuyer1",
        name: "email_buyer_1",
        label: "Email - Buyer 1",
        type: "email",
        placeholder: "Best email address",
        required: true,
        autoComplete: "email",
      },
    ],
  },
  {
    number: "02",
    title: "Second Buyer Details",
    description:
      "Complete this section only if a second purchaser will also be included on the contract.",
    fields: [
      {
        id: "buyer2FullLegalName",
        name: "buyer_2_full_legal_name",
        label: "Buyer 2 - Full Legal Name:",
        type: "text",
        placeholder: "Full legal name as it will appear on the contract",
        autoComplete: "name",
      },
      {
        id: "addressBuyer2IfDifferentToBuyer1",
        name: "address_buyer_2_if_different_to_buyer_1",
        label: "Address - Buyer 2 (if different to Buyer 1)",
        type: "textarea",
        placeholder: "Current residential address",
        rows: 3,
        full: true,
      },
      {
        id: "phoneBuyer2",
        name: "phone_buyer_2",
        label: "Phone - Buyer 2",
        type: "tel",
        placeholder: "Best contact number",
        autoComplete: "tel",
      },
      {
        id: "emailBuyer2",
        name: "email_buyer_2",
        label: "Email - Buyer 2",
        type: "email",
        placeholder: "Best email address",
        autoComplete: "email",
      },
    ],
  },
  {
    number: "03",
    title: "Offer & Conditions",
    description:
      "Enter your proposed price, deposit amounts, finance terms, building and pest conditions, and any additional terms of the offer.",
    fields: [
      {
        id: "offerPrice",
        name: "offer_price",
        label: "Offer Price ($)",
        type: "number",
        placeholder: "e.g. 950000",
        required: true,
      },
      {
        id: "initialDeposit",
        name: "initial_deposit",
        label: "Initial Deposit ($)",
        type: "number",
        placeholder: "e.g. 10000",
        required: true,
      },
      {
        id: "balanceDeposit",
        name: "balance_deposit",
        label: "Balance Deposit ($)",
        type: "number",
        placeholder: "e.g. 40000",
      },
      {
        id: "financeSubject",
        name: "will_your_offer_be_subject_to_finance",
        label: "Will your offer be subject to finance?",
        type: "select",
        required: true,
        options: YES_NO_OPTIONS,
      },
      {
        id: "financeDays",
        name: "finance_if_yes_how_many_days",
        label: "If yes, how many days?",
        type: "text",
        placeholder: "e.g. 14 days",
      },
      {
        id: "buildingPestSubject",
        name: "will_your_offer_be_subject_to_building_pest",
        label: "Will your offer be subject to Building & Pest",
        type: "select",
        options: YES_NO_OPTIONS,
      },
      {
        id: "buildingPestDays",
        name: "building_pest_if_yes_how_many_days",
        label: "If yes, how many days?",
        type: "text",
        placeholder: "e.g. 7 days",
      },
      {
        id: "otherConditions",
        name: "do_you_have_any_other_conditions_for_purchase",
        label: "Do you have any other conditions for purchase?",
        type: "select",
        options: YES_NO_OPTIONS,
        full: true,
      },
      {
        id: "otherConditionsDetails",
        name: "if_yes_please_state_brief_details",
        label: "If yes, please state brief details",
        type: "textarea",
        placeholder: "List any special conditions, inclusions, or requests",
        rows: 3,
        full: true,
      },
    ],
  },
  {
    number: "04",
    title: "Solicitor & Privacy",
    description:
      "Provide your solicitor or conveyancer details and let us know whether we may keep your information on file.",
    fields: [
      {
        id: "solicitorDetails",
        name: "solicitor_details",
        label: "Solicitor Details",
        type: "textarea",
        placeholder: "Firm name, contact person, phone number, and email",
        required: true,
        rows: 3,
        full: true,
      },
      {
        id: "databasePermission",
        name: "are_you_happy_for_us_to_store_your_information_in_our_database",
        label: "Are you happy for us to store your information in our database?",
        type: "select",
        options: YES_NO_OPTIONS,
        full: true,
      },
    ],
  },
];

function Field({ field }: { field: FieldConfig }) {
  return (
    <div
      className={`eoi-field${field.full ? " eoi-field--full" : ""}`}
      data-gsap="fade-up"
      data-gsap-start="top 92%"
      data-gsap-duration="0.65"
    >
      <label className="eoi-field__label" htmlFor={field.id}>
        <span>{field.label}</span>
        {field.required ? <span className="eoi-field__required">*</span> : null}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          rows={field.rows ?? 4}
          className="eoi-field__control eoi-field__control--textarea"
        />
      ) : null}

      {field.type === "select" ? (
        <div className="eoi-select">
          <select
            id={field.id}
            name={field.name}
            required={field.required}
            defaultValue=""
            className="eoi-field__control eoi-field__control--select"
          >
            {field.options?.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {field.type !== "textarea" && field.type !== "select" ? (
        <input
          id={field.id}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          autoComplete={field.autoComplete}
          className="eoi-field__control"
        />
      ) : null}
    </div>
  );
}

export default function ExpressionOfInterestPage({
  ready = false,
}: {
  ready?: boolean;
}) {
  const pageRef = useRef<HTMLElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
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
    return cleanup;
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(true);
  };

  return (
    <main className="eoi-page" ref={pageRef}>
      <HeroSection
        ready={ready}
        showVideo={false}
        showCta
        ctaLabel="Complete the Form"
        ctaOnClick={() =>
          formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        bgImage="images/hero1.jpg"
        titleLine1={
          <>
            Expression <span className="rg-gold">of</span>
          </>
        }
        titleLine2={
          <>
            Interest <span className="rg-amber">Form</span>
          </>
        }
        subtitle="Use this form to submit your offer, purchaser details, and purchase conditions for the property you wish to secure."
      />

      <section className="eoi-shell">
        <div className="eoi-shell__rule" />
        <div className="eoi-wrap" ref={formTopRef}>
          <div className="eoi-main">
            <div className="eoi-heading" data-gsap="fade-up">
              <h2 className="eoi-heading__title" data-gsap="char-reveal" data-gsap-start="top 88%">
                Expression of Interest Form
              </h2>
              <p className="eoi-heading__body" data-gsap="fade-up" data-gsap-delay="0.14">
                I/We acknowledge that if this offer is accepted, I/We will be
                required to enter into and execute a contract of sale on these
                terms. I/We acknowledge that we may be one of several parties
                making offers to the seller for their consideration. Both
                purchaser and seller must sign a contract of sale before this
                offer becomes legally binding. An offer may be withdrawn at any
                time before signing a contract of sale.
              </p>
            </div>

            <form
              className="eoi-form"
              onSubmit={handleSubmit}
            >
              {FORM_SECTIONS.map((section) => (
                <section key={section.number} className="eoi-form__section">
                  <div
                    className="eoi-form__section-head"
                    data-gsap="fade-up"
                    data-gsap-start="top 90%"
                    data-gsap-duration="0.7"
                  >
                    <span className="eoi-form__section-no">{section.number}</span>
                    <div>
                      <h3 className="eoi-form__section-title">{section.title}</h3>
                      <p className="eoi-form__section-body">{section.description}</p>
                    </div>
                  </div>

                  <div className="eoi-form__grid">
                    {section.fields.map((field) => (
                      <Field key={field.id} field={field} />
                    ))}
                  </div>
                </section>
              ))}

              <div
                className="eoi-submit"
                data-gsap="fade-up"
                data-gsap-start="top 90%"
                data-gsap-duration="0.7"
              >
                <div className="eoi-submit__note">
                  <span className="eoi-submit__pill">Please review</span>
                  <p>
                    Required fields are marked with an asterisk. Please check all
                    details carefully before submitting your Expression of Interest.
                  </p>
                </div>

                <button type="submit" className="eoi-submit__button">
                  Submit Expression of Interest
                </button>
              </div>
            </form>

            <div
              className="eoi-note"
              data-gsap="clip-smooth-down"
              data-gsap-start="top 88%"
              data-gsap-duration="0.95"
            >
              <span className="eoi-note__eyebrow">Important information</span>
              <p className="eoi-note__body">
                Submitting an Expression of Interest does not create a legally
                binding contract. If your offer is accepted, you will be asked
                to sign a formal contract of sale on the agreed terms.
              </p>
              <p className="eoi-note__body">
                The seller may consider multiple offers at the same time, and an
                offer may be withdrawn at any point before a contract of sale
                has been signed by both purchaser and seller.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className={`eoi-success${success ? " is-visible" : ""}`} role="dialog" aria-modal="true">
        <div className="eoi-success__card">
          <span className="eoi-success__mark">✦</span>
          <h2>
            Expression of Interest <em>submitted.</em>
          </h2>
          <div className="eoi-success__rule" />
          <p>
            Thank you for your submission. Our team will review your details
            and be in touch shortly regarding the next steps for your offer.
          </p>
          <button
            type="button"
            className="eoi-success__button"
            onClick={() => setSuccess(false)}
          >
            Return to form
          </button>
        </div>
      </div>
    </main>
  );
}
