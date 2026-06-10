import React from "react";
import "./Marquee.css";

interface MarqueeProps {
  items: string[];
  speed?: number; // seconds for one full loop
}

const Marquee: React.FC<MarqueeProps> = ({ items, speed = 40 }) => {
  if (!items.length) return null;

  // Duplicate items so the seamless loop works at any viewport width
  const doubled = [...items, ...items];

  return (
    <div className="rg-marquee" aria-hidden="true">
      <div
        className="rg-marquee__track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <React.Fragment key={i}>
            <span className="rg-marquee__item">{item}</span>
            <span className="rg-marquee__sep" aria-hidden="true" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
