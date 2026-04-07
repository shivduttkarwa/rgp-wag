import type { ReactNode } from "react";

/**
 * Converts accent token syntax used in Wagtail CMS fields into styled spans.
 * Supported tokens: [gold]…[/gold]  [amber]…[/amber]
 *
 * Example:
 *   "Your [gold]Dream[/gold] Home" → <>Your <span className="rg-gold">Dream</span> Home</>
 */
export function renderHeroAccentTokens(text: string): ReactNode {
  const parts = text.split(/(\[(?:gold|amber)\].*?\[\/(?:gold|amber)\])/g);

  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, i) => {
        const gold  = part.match(/^\[gold\](.*?)\[\/gold\]$/);
        const amber = part.match(/^\[amber\](.*?)\[\/amber\]$/);
        if (gold)  return <span key={i} className="rg-gold">{gold[1]}</span>;
        if (amber) return <span key={i} className="rg-amber">{amber[1]}</span>;
        return part;
      })}
    </>
  );
}
