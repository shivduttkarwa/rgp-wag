import type { ReactNode } from "react";

// Inline styles used for accent spans — must bypass mix-blend-mode:screen on parent
const GOLD_STYLE = { color: "#f9c206", fontWeight: 700 } as const;
const AMBER_STYLE = { color: "#f97316", fontWeight: 700 } as const;

/**
 * Renders a hero/section title, handling two formats:
 *
 * 1. Rich text HTML (from Wagtail RichTextBlock):
 *    "<p>Your <span class=\"rg-gold\">Dream</span> Home</p>"
 *    → parsed into React nodes WITHOUT any wrapper span so that
 *      HeroSection's splitToChars animation can see rg-gold/rg-amber
 *      as direct children and preserve their colour during character splitting.
 *
 * 2. Legacy accent token syntax (old fallback / TS defaults):
 *    "Your [gold]Dream[/gold] Home"
 *    → parsed manually into React spans (same direct-child structure)
 */
export function renderHeroAccentTokens(text: string): ReactNode {
  if (!text) return null;

  // Rich text HTML format — strip <p> wrapper and parse into React nodes.
  // IMPORTANT: do NOT wrap in a container span — the animation in HeroSection
  // walks direct children of the title element and calls textContent on any
  // element node it finds, which would strip inner HTML if we used a wrapper.
  if (text.trim().startsWith("<")) {
    const inner = text.trim().replace(/^<p[^>]*>|<\/p>$/g, "").trim();
    if (!inner) return null;

    const parts: ReactNode[] = [];
    // Match <span class="rg-gold|rg-amber" ...>text</span> or plain text runs
    const re = /<span[^>]*class="rg-(gold|amber)"[^>]*>([^<]*)<\/span>|([^<]+)/g;
    let m: RegExpExecArray | null;
    let key = 0;

    while ((m = re.exec(inner)) !== null) {
      if (m[1]) {
        const style = m[1] === "gold" ? GOLD_STYLE : AMBER_STYLE;
        parts.push(
          <span key={key++} className={`rg-${m[1]}`} style={style}>
            {m[2]}
          </span>,
        );
      } else if (m[3]) {
        parts.push(m[3]);
      }
    }

    return <>{parts}</>;
  }

  // Legacy token format: [gold]…[/gold]  [amber]…[/amber]
  const parts = text.split(/(\[(?:gold|amber)\].*?\[\/(?:gold|amber)\])/g);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        const gold  = part.match(/^\[gold\](.*?)\[\/gold\]$/);
        const amber = part.match(/^\[amber\](.*?)\[\/amber\]$/);
        if (gold)  return <span key={i} className="rg-gold"  style={GOLD_STYLE}>{gold[1]}</span>;
        if (amber) return <span key={i} className="rg-amber" style={AMBER_STYLE}>{amber[1]}</span>;
        return part;
      })}
    </>
  );
}
