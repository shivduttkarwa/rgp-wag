import { User } from "lucide-react";
import assetUrl from "@/lib/assetUrl";
import SectionBadge from "@/components/reusable/SectionBadge";
import type { IntroSection } from "@/types/homePage";
import "./Intro.css";

const Intro = ({ data }: { data: IntroSection }) => {
  return (
    <section className="intro">
      {/* Left: Content */}
      <div className="intro-content">
        <SectionBadge text={data.label} icon={User} />

        <h1
          className="intro-headline"
          data-gsap="char-reveal"
          data-gsap-start="top 85%"
        >
          {data.headline_line1}
          <br />
          {data.headline_line2}
          <span className="founder">{data.founder_name}</span>
        </h1>

        <p className="intro-text" data-gsap="fade-up" data-gsap-delay="0.2">
          {data.body}
        </p>
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
