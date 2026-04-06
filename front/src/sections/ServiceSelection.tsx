import {
  Home,
  Key,
  Building,
  ArrowRight,
  TrendingUp,
  Search,
  CalendarCheck,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./ServiceSelection.css";

type ServiceItem = {
  id: string;
  icon: typeof Search;
  secondaryIcon: typeof Key;
  headline: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  cta: string;
  theme: "buy" | "sell" | "rent";
};

type ServiceHeader = {
  eyebrow: string;
  title: string;
  titleEm: string;
  subtitle: string;
};

type ServiceCta = {
  eyebrow: string;
  title: string;
  titleEm: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "buy",
    icon: Search,
    secondaryIcon: Key,
    headline: "Advisory",
    title: "Buyer Support",
    subtitle: "And Guidance",
    description:
      "Clear advice and local insight to help you buy with confidence—pricing, comparables, and negotiation support tailored to your goals.",
    features: [
      "Buyer support and advisory",
      "Residential property sales",
      "House & land packages",
    ],
    cta: "Speak With Us",
    theme: "buy",
  },
  {
    id: "sell",
    icon: TrendingUp,
    secondaryIcon: Home,
    headline: "Insights",
    title: "Property Appraisals",
    subtitle: "& Market Analysis",
    description:
      "Professional appraisals, transparent pricing strategy, and data-led guidance to help you make the right move at the right time.",
    features: [
      "Property appraisals and market analysis",
      "Honest communication",
      "Results driven outcomes",
    ],
    cta: "Request an Appraisal",
    theme: "sell",
  },
  {
    id: "rent",
    icon: CalendarCheck,
    secondaryIcon: Building,
    headline: "Management",
    title: "Rentals &",
    subtitle: "Property Management",
    description:
      "Reliable tenancy, proactive maintenance, and smooth day-to-day management for landlords and tenants alike.",
    features: [
      "Quality tenant selection",
      "Reliable rent collection",
      "Routine inspections & maintenance",
    ],
    cta: "Get In Touch",
    theme: "rent",
  },
];

const DEFAULT_HEADER: ServiceHeader = {
  eyebrow: "How Can We Help You?",
  title: "What Are You",
  titleEm: "Looking For?",
  subtitle:
    "Whether you're buying, selling, or renting — we're here to make your real estate journey seamless and rewarding.",
};

const DEFAULT_CTA: ServiceCta = {
  eyebrow: "Need Guidance?",
  title: "Not Sure Where to",
  titleEm: "Start?",
  text: "Our experienced advisors are here to understand your needs and guide you through every step of your real estate journey.",
  primaryLabel: "Talk to an Expert",
  primaryHref: "/contact",
  secondaryLabel: "0450 009 291",
  secondaryHref: "tel:+61450009291",
};

const ServiceSelection = ({
  services = DEFAULT_SERVICES,
  header = DEFAULT_HEADER,
  cta = DEFAULT_CTA,
}: {
  services?: ServiceItem[];
  header?: ServiceHeader;
  cta?: ServiceCta;
}) => {
  return (
    <section className="svc">
      <div className="svc__container">
        {/* Header */}
        <header className="svc__header">
          <span className="svc__eyebrow" data-gsap="fade-up">
            {header.eyebrow}
          </span>
          <h2
            className="svc__title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {header.title} <em>{header.titleEm}</em>
          </h2>
          <p
            className="svc__subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.2"
          >
            {header.subtitle}
          </p>
        </header>

        {/* Service Cards */}
        <div className="svc__grid">
          {services.map((service, i) => (
            <article
              key={service.id}
              className={`svc-card svc-card--${service.theme}`}
              data-gsap="clip-smooth-down"
              data-gsap-delay={`${i * 0.14}`}
              data-gsap-start="top 88%"
            >
              <h3 className="svc-card__word">
                {service.id.charAt(0).toUpperCase() + service.id.slice(1)}
              </h3>
              <p className="svc-card__desc">{service.description}</p>
              <div className="svc-card__footer">
                <Link to="/contact" className="svc-card__btn">
                  <span>{service.cta}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="svc-cta">
        <div className="svc-cta__container">
          {/* Decorative Elements */}
          <div className="svc-cta__decor svc-cta__decor--left" />
          <div className="svc-cta__decor svc-cta__decor--right" />

          {/* Content */}
          <div className="svc-cta__content">
            <span className="svc-cta__eyebrow" data-gsap="fade-up">
              {cta.eyebrow}
            </span>
            <h3
              className="svc-cta__title"
              data-gsap="char-reveal"
              data-gsap-start="top 85%"
            >
              {cta.title} <em>{cta.titleEm}</em>
            </h3>
            <p
              className="svc-cta__text"
              data-gsap="fade-up"
              data-gsap-delay="0.15"
            >
              {cta.text}
            </p>

            {/* CTA Buttons */}
            <div className="svc-cta__actions">
              <Link
                to="/contact"
                className="svc-cta__btn svc-cta__btn--primary"
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
              >
                <MessageCircle size={20} />
                <span>{cta.primaryLabel}</span>
                <ArrowRight size={18} />
              </Link>
              <a
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
                href={cta.secondaryHref}
                className="svc-cta__btn svc-cta__btn--secondary"
              >
                <Phone size={18} />
                <span>{cta.secondaryLabel}</span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div
              data-gsap="zoom-in"
              data-gsap-stagger="0.3 "
              className="svc-cta__trust"
            >
              <div className="svc-cta__trust-item">
                <span className="svc-cta__trust-value">5+</span>
                <span className="svc-cta__trust-label">Years Experience</span>
              </div>
              <div className="svc-cta__trust-divider" />
              <div className="svc-cta__trust-item">
                <span className="svc-cta__trust-value">100+</span>
                <span className="svc-cta__trust-label">Happy Clients</span>
              </div>
              <div className="svc-cta__trust-divider" />
              <div className="svc-cta__trust-item">
                <span className="svc-cta__trust-value">24/7</span>
                <span className="svc-cta__trust-label">Support Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSelection;
