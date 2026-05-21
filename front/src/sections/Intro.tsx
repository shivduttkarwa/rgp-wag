import RgButton from "@/components/reusable/RgButton";
import assetUrl from "@/lib/assetUrl";
import type { IntroSection } from "@/types/homePage";
import "./Intro.css";

const isExternalHref = (href: string) => /^[a-z][a-z0-9+.-]*:/i.test(href);

const Intro = ({ data }: { data: IntroSection }) => {
  const primaryHref = data.primary_cta.href || "/contact";
  const secondaryHref = data.secondary_cta.href || "/about";
  const primaryLinkProps = isExternalHref(primaryHref)
    ? { href: primaryHref }
    : { to: primaryHref };
  const secondaryLinkProps = isExternalHref(secondaryHref)
    ? { href: secondaryHref }
    : { to: secondaryHref };

  return (
    <section className="intro">
      {/* Left: Content */}
      <div className="intro-content">
        <span className="intro-label" data-gsap="fade-up">
          {data.label}
        </span>

        <h1
          className="intro-headline"
          data-gsap="fade-up"
          data-gsap-delay="0.1"
        >
          {data.headline_line1}
          <br />
          {data.headline_line2}
          <span className="founder">{data.founder_name}</span>
        </h1>

        <p className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
          {data.body}
        </p>

        <div className="intro-cta-group">
          <RgButton
            variant="blue"
            {...primaryLinkProps}
            label={data.primary_cta.label}
            arrowSize={16}
            data-gsap="btn-clip-reveal"
            data-gsap-delay="0.2"
          />
          {data.secondary_cta.label ? (
            <RgButton
              variant="outline"
              {...secondaryLinkProps}
              label={data.secondary_cta.label}
              arrowSize={16}
              data-gsap="btn-clip-reveal"
              data-gsap-delay="0.3"
            />
          ) : null}
        </div>
      </div>

      {/* Right: Image */}
      <div
        className="intro-image"
        data-gsap="clip-reveal-right"
        data-gsap-start="top 60%"
      >
        <img
          src={assetUrl(data.image?.url ?? data.image_url)}
          alt={`${data.founder_name} — Real Gold Properties`}
        />

        {/* Bottom gradient */}
        <div className="intro-img-gradient" />

        {/* Corner brackets */}
        <div className="intro-img-corner intro-img-corner--tl" />
        <div className="intro-img-corner intro-img-corner--br" />
      </div>
    </section>
  );
};

export default Intro;
