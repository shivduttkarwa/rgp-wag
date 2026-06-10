export type ButtonBlockData = {
  label: string;
  href: string;
  style: "gold" | "blue" | "outline";
  open_in_new_tab: boolean;
};

export type SectionTitleData = {
  eyebrow?: string;
  title: string;
  description?: string;
};
