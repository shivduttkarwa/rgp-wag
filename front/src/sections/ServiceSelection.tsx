import {
  TrendingUp,
  Search,
  CalendarCheck,
} from "lucide-react";
import RgButton from "@/components/reusable/RgButton";
import type { ServicesSection } from "@/types/homePage";
import "./ServiceSelection.css";

const THEME_ICON_MAP = {
  buy: Search,
  sell: TrendingUp,
  rent: CalendarCheck,
};

type LegacyServiceItem = {
  id: string;
  icon: typeof Search;
  secondaryIcon?: typeof Search;
  headline: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  theme: "buy" | "sell" | "rent";
};

type LegacyHeader = {
  eyebrow: string;
  title: string;
  titleEm: string;
  subtitle: string;
};

type ServiceSelectionProps = {
  data?: ServicesSection;
  services?: LegacyServiceItem[];
  header?: LegacyHeader;
};

const ServiceSelection = ({ data, services, header }: ServiceSelectionProps) => {
  let section = data;

  if (!data && (services || header)) {
    section = {
      header_eyebrow: header?.eyebrow ?? "",
      header_title: header?.title ?? "",
      header_title_em: header?.titleEm ?? "",
      header_subtitle: header?.subtitle ?? "",
      services: (services ?? []).map((service) => ({
        theme: service.theme,
        headline: service.headline,
        title: service.title,
        subtitle: service.subtitle,
        description: service.description,
        cta_label: service.cta,
      })),
    };
  }

  if (!section) return null;

  return (
    <section className="svc">
      <div className="svc__container">
        {/* Header */}
        <header className="svc__header">
          <span className="svc__eyebrow" data-gsap="fade-up">
            {section.header_eyebrow}
          </span>
          <h2
            className="svc__title"
            data-gsap="char-reveal"
            data-gsap-start="top 85%"
          >
            {section.header_title} <em>{section.header_title_em}</em>
          </h2>
          <p
            className="svc__subtitle"
            data-gsap="fade-up"
            data-gsap-delay="0.2"
          >
            {section.header_subtitle}
          </p>
        </header>

        {/* Service Cards */}
        <div className="svc__grid">
          {section.services.map((service, i) => {
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

                <div className="svc-card__footer">
                  <RgButton
                    variant="blue"
                    to="/contact"
                    label={service.cta_label}
                    arrowSize={16}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceSelection;
