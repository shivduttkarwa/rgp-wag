import type { ReactNode } from "react";

const GOLD_STYLE = { color: "#f9c206" } as const;

export function renderHeroAccentTokens(text: string): ReactNode {
  if (!text) return null;

  // HTML format (legacy DB content) — strip <p> wrapper and parse into React nodes.
  // IMPORTANT: do NOT wrap in a container span — the animation in HeroSection
  // walks direct children of the title element and calls textContent on any
  // element node it finds, which would strip inner HTML if we used a wrapper.
  if (text.trim().startsWith("<")) {
    const inner = text.trim().replace(/^<p[^>]*>|<\/p>$/g, "").trim();
    if (!inner) return null;

    const parts: ReactNode[] = [];
    const re = /<span[^>]*class="rg-gold"[^>]*>([^<]*)<\/span>|([^<]+)/g;
    let m: RegExpExecArray | null;
    let key = 0;

    while ((m = re.exec(inner)) !== null) {
      if (m[1] !== undefined) {
        parts.push(<span key={key++} className="rg-gold" style={GOLD_STYLE}>{m[1]}</span>);
      } else if (m[2]) {
        parts.push(m[2]);
      }
    }

    return <>{parts}</>;
  }

  // Token format: [gold]…[/gold]
  const parts = text.split(/(\[gold\].*?\[\/gold\])/g);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        const gold = part.match(/^\[gold\](.*?)\[\/gold\]$/);
        if (gold) return <span key={i} className="rg-gold" style={GOLD_STYLE}>{gold[1]}</span>;
        return part;
      })}
    </>
  );
}
