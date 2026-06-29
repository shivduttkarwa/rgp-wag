import type { LucideIcon } from "lucide-react";
import "./SectionBadge.css";

interface SectionBadgeProps {
  text: string;
  icon: LucideIcon;
  className?: string;
}

export default function SectionBadge({ text, icon: Icon, className = "" }: SectionBadgeProps) {
  return (
    <div className={`section-badge${className ? ` ${className}` : ""}`} data-gsap="fade-up">
      <Icon size={16} />
      <span>{text}</span>
    </div>
  );
}
