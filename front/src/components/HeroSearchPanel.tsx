import { useNavigate } from "react-router-dom";
import { Home, KeyRound, BadgeCheck, UserSearch } from "lucide-react";
import type { SearchTab } from "@/types/homePage";
import "./HeroSearchPanel.css";

const ICONS = {
  buy: Home,
  rent: KeyRound,
  sold: BadgeCheck,
  agent: UserSearch,
};

type HeroSearchPanelProps = {
  tabs: SearchTab[];
};

type VisibleSearchTab = SearchTab & {
  label: string;
  href: string;
};

function isVisibleTab(tab: SearchTab): tab is VisibleSearchTab {
  return Boolean(tab.label && tab.href);
}

export default function HeroSearchPanel({ tabs }: HeroSearchPanelProps) {
  const navigate = useNavigate();
  const visibleTabs = tabs.filter(isVisibleTab);

  const openHref = (href: string) => {
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      window.location.assign(href);
      return;
    }
    navigate(href);
  };

  if (visibleTabs.length === 0) return null;

  return (
    <div className="hsp">
      {visibleTabs.map(({ label, icon, href }, index) => {
        const Icon = icon ? ICONS[icon] : Home;

        return (
          <button
            key={`${label}-${href}-${index}`}
            className="hsp__tab"
            onClick={() => openHref(href)}
            type="button"
          >
            <span className="hsp__tab-badge">
              <Icon size={31} aria-hidden="true" strokeWidth={1.75} />
            </span>
            <span className="hsp__tab-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
