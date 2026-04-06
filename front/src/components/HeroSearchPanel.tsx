import { useNavigate } from "react-router-dom";
import { Home, KeyRound, BadgeCheck, UserSearch } from "lucide-react";
import "./HeroSearchPanel.css";

const TABS = [
  { id: "buy",   label: "Buy",   icon: Home,       href: "/properties?cat=for-sale" },
  { id: "rent",  label: "Rent",  icon: KeyRound,   href: "/properties?cat=for-rent" },
  { id: "sold",  label: "Sold",  icon: BadgeCheck, href: "/properties?cat=sold"     },
  { id: "agent", label: "Agent", icon: UserSearch, href: "/team"                    },
];

export default function HeroSearchPanel() {
  const navigate = useNavigate();

  return (
    <div className="hsp">
      {TABS.map(({ id, label, icon: Icon, href }) => (
        <button
          key={id}
          className="hsp__tab"
          onClick={() => navigate(href)}
          type="button"
        >
          <span className="hsp__tab-badge">
            <Icon size={31} aria-hidden="true" strokeWidth={1.75} />
          </span>
          <span className="hsp__tab-label">{label}</span>
        </button>
      ))}
    </div>
  );
}
