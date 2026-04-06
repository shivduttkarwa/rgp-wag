import "./DummyHero.css";

type DummyHeroProps = {
  label?: string;
};

export default function DummyHero({ label = "Coming Soon" }: DummyHeroProps) {
  return (
    <section className="dummy-hero" aria-label={label}>
      <span className="dummy-hero__label">{label}</span>
    </section>
  );
}
