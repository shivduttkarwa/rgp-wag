import {
  TrendingUp,
  Search,
  CalendarCheck,
} from "lucide-react";
import CmsButton from "@/components/reusable/CmsButton";
import type { ServicesSection } from "@/types/homePage";
import "./ServiceSelection.css";

const THEME_ICON_MAP = {
  buy: Search,
  sell: TrendingUp,
  rent: CalendarCheck,
};

const ServiceSelection = ({ data }: { data?: ServicesSection }) => {
  if (!data) return null;

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
          <p
            className="svc__subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.2"
          >
            {data.header_subtitle}
          </p>
        </header>

        <div className="svc__grid">
          {data.services.map((service, i) => {
            const Icon = THEME_ICON_MAP[service.theme] ?? Search;

            return (
              <article
                key={service.theme}
                className="svc-card"
                data-gsap="clip-smooth-down"
                data-gsap-delay={`${i * 0.14}`}
                data-gsap-start="top 88%"
              >
                <div className="svc-card__top" aria-hidden="true">
                  <span className="svc-card__icon">
                    <Icon size={18} />
                  </span>
                </div>

                <h3 className="svc-card__word">
                  {service.theme.charAt(0).toUpperCase() + service.theme.slice(1)}
                </h3>

                <p className="svc-card__desc">{service.description}</p>

                {service.cta?.label && service.cta?.href ? (
                  <div className="svc-card__footer">
                    <CmsButton button={service.cta} />
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceSelection;
