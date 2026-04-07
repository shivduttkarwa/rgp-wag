import { Fragment, type ReactNode } from "react";

const HERO_TOKEN_PATTERN = /\[(gold|amber)\]([\s\S]*?)\[\/\1\]/gi;

const TOKEN_CLASS_NAME: Record<string, string> = {
  gold: "rg-gold",
  amber: "rg-amber",
};

export function renderHeroAccentTokens(content: string): ReactNode {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of content.matchAll(HERO_TOKEN_PATTERN)) {
    const fullMatch = match[0];
    const tone = match[1]?.toLowerCase();
    const accentText = match[2] ?? "";
    const matchIndex = match.index ?? 0;

    if (matchIndex > cursor) {
      nodes.push(content.slice(cursor, matchIndex));
    }

    nodes.push(
      <span
        className={TOKEN_CLASS_NAME[tone] ?? ""}
        key={`${tone}-${matchIndex}-${accentText}`}
      >
        {accentText}
      </span>,
    );

    cursor = matchIndex + fullMatch.length;
  }

  if (cursor < content.length) {
    nodes.push(content.slice(cursor));
  }

  if (!nodes.length) {
    return content;
  }

  return (
    <>
      {nodes.map((node, index) => (
        <Fragment key={`hero-token-${index}`}>{node}</Fragment>
      ))}
    </>
  );
}
