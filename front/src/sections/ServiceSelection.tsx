import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import type { ServicesSection } from "@/types/homePage";
import "./ServiceSelection.css";

const ServiceSelection = ({ data }: { data: ServicesSection }) => {
  return (
    <section className="svc">
      <div className="svc__container">
        <header className="svc__header">
          <span className="svc__eyebrow" data-gsap="fade-up">
            {data.header_eyebrow}
          </span>
          <h2
            className="svc__title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {data.header_title} <em>{data.header_title_em}</em>
          </h2>
          <p className="svc__subtitle" data-gsap="fade-up" data-gsap-delay="0.2">
            {data.header_subtitle}
          </p>
        </header>

        <div className="svc__grid">
          {data.services.map((service, i) => (
            <article
              key={service.theme}
              className={`svc-card svc-card--${service.theme}`}
              data-gsap="clip-smooth-down"
              data-gsap-delay={`${i * 0.14}`}
              data-gsap-start="top 88%"
            >
              <h3 className="svc-card__word">
                {service.theme.charAt(0).toUpperCase() + service.theme.slice(1)}
              </h3>
              <p className="svc-card__desc">{service.description}</p>
              <div className="svc-card__footer">
                <Link to="/contact" className="svc-card__btn">
                  <span>{service.cta_label}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="svc-cta">
        <div className="svc-cta__container">
          <div className="svc-cta__decor svc-cta__decor--left" />
          <div className="svc-cta__decor svc-cta__decor--right" />

          <div className="svc-cta__content">
            <span className="svc-cta__eyebrow" data-gsap="fade-up">
              {data.cta_eyebrow}
            </span>
            <h3
              className="svc-cta__title"
              data-gsap="char-reveal"
              data-gsap-start="top 85%"
            >
              {data.cta_title} <em>{data.cta_title_em}</em>
            </h3>
            <p className="svc-cta__text" data-gsap="fade-up" data-gsap-delay="0.15">
              {data.cta_text}
            </p>

            <div className="svc-cta__actions">
              <Link
                to={data.cta_primary.href}
                className="svc-cta__btn svc-cta__btn--primary"
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
              >
                <MessageCircle size={20} />
                <span>{data.cta_primary.label}</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href={data.cta_secondary.href}
                className="svc-cta__btn svc-cta__btn--secondary"
                data-gsap="btn-clip-reveal"
                data-gsap-delay="0.2"
              >
                <Phone size={18} />
                <span>{data.cta_secondary.label}</span>
              </a>
            </div>

            <div data-gsap="zoom-in" data-gsap-stagger="0.3" className="svc-cta__trust">
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
