import type { ReactNode } from "react";

/**
 * Renders a hero/section title, handling two formats:
 *
 * 1. Rich text HTML (from Wagtail RichTextBlock — new format):
 *    "<p>Your <span class=\"rg-gold\">Dream</span> Home</p>"
 *    → strips the <p> wrapper and renders via dangerouslySetInnerHTML
 *
 * 2. Legacy accent token syntax (old fallback / TS defaults):
 *    "Your [gold]Dream[/gold] Home"
 *    → parsed manually into React spans
 */
export function renderHeroAccentTokens(text: string): ReactNode {
  if (!text) return null;

  // Rich text HTML format — strip outer <p> wrapper and inject as HTML.
  // Inline styles are added alongside the classes so screen/filter blend
  // modes on the parent can't wash out the accent colour.
  if (text.trim().startsWith("<")) {
    const inner = text.trim().replace(/^<p[^>]*>|<\/p>$/g, "").trim();
    if (!inner) return null;
    const styled = inner
      .replace(/class="rg-gold"/g, 'class="rg-gold" style="color:#f9c206;font-weight:700"')
      .replace(/class="rg-amber"/g, 'class="rg-amber" style="color:#f97316;font-weight:700"');
    return <span dangerouslySetInnerHTML={{ __html: styled }} />;
  }

  // Legacy token format: [gold]…[/gold]  [amber]…[/amber]
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
