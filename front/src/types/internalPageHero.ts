import type { WagtailImage } from "@/types/homePage";

export type InternalPageHeroMode = "none" | "buttons" | "stats";

export type InternalPageHeroButton = {
  label: string;
  href?: string;
  style?: "gold" | "blue" | "outline";
  open_in_new_tab?: boolean;
  onClick?: () => void;
};

export type InternalPageHeroStat = {
  value: string;
  label: string;
};

export type InternalPageHeroData = {
  title_line_1: string;
  title_line_2: string;
  subtitle: string;
  background_image: WagtailImage | null;
  show_video?: boolean;
  background_video_url?: string;
  mode?: InternalPageHeroMode;
  buttons?: InternalPageHeroButton[];
  stats?: InternalPageHeroStat[];
};
