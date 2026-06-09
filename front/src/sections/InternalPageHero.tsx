import HeroSection from "@/sections/HeroSection";
import RgButton from "@/components/reusable/RgButton";
import { renderHeroAccentTokens } from "@/lib/heroTokens";
import type { InternalPageHeroData } from "@/types/internalPageHero";
import "./InternalPageHero.css";

const isInternalPath = (href: string) => href.startsWith("/");

type InternalPageHeroProps = {
  hero: InternalPageHeroData;
  ready?: boolean;
};

export default function InternalPageHero({ hero, ready = false }: InternalPageHeroProps) {
  const buttons = (hero.buttons ?? []).filter((button) => button.label?.trim());
  const stats = (hero.stats ?? []).filter(
    (stat) => stat.value?.trim() && stat.label?.trim()
  );
  const mode =
    hero.mode ??
    (stats.length ? "stats" : buttons.length ? "buttons" : "none");

  const panel =
    mode === "buttons" && buttons.length ? (
      <div className="internal-page-hero__actions">
        {buttons.map((button, index) => {
          const key = `${button.label}-${index}`;
          const variant = button.style ?? (index === 0 ? "gold" : "blue");
          const target = button.open_in_new_tab ? "_blank" : undefined;
          const rel = button.open_in_new_tab ? "noopener noreferrer" : undefined;

          if (button.onClick) {
            return (
              <RgButton
                key={key}
                variant={variant}
                label={button.label}
                className="internal-page-hero__action"
                onClick={button.onClick}
              />
            );
          }

          const href = button.href?.trim() ?? "";

          if (isInternalPath(href)) {
            return (
              <RgButton
                key={key}
                variant={variant}
                label={button.label}
                className="internal-page-hero__action"
                to={href}
              />
            );
          }

          return (
            <RgButton
              key={key}
              variant={variant}
              label={button.label}
              className="internal-page-hero__action"
              href={href || "#"}
              target={target}
              rel={rel}
            />
          );
        })}
      </div>
    ) : undefined;

  const footer =
    mode === "stats" && stats.length ? (
      <div className="internal-page-hero__stats-slab">
        <div className="internal-page-hero__stats">
          {stats.map((stat, index) => (
            <div className="internal-page-hero__stat-wrap" key={`${stat.label}-${index}`}>
              {index > 0 ? <div className="internal-page-hero__stat-divider" /> : null}
              <div className="internal-page-hero__stat">
                <span className="internal-page-hero__stat-value">{stat.value}</span>
                <span className="internal-page-hero__stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : undefined;

  const backgroundImage = hero.background_image?.url ?? hero.background_image_url;

  return (
    <HeroSection
      ready={ready}
      showVideo={Boolean(hero.show_video)}
      showCta={false}
      bgImage={backgroundImage}
      bgPoster={backgroundImage}
      bgVideo={hero.background_video_url || undefined}
      titleLine1={renderHeroAccentTokens(hero.title_line_1)}
      titleLine2={renderHeroAccentTokens(hero.title_line_2)}
      subtitle={hero.subtitle}
      panel={panel}
      footer={footer}
    />
  );
}
