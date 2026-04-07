export type HeroBackgroundContent = {
  imageUrl: string;
  posterUrl: string | null;
  videoUrl: string | null;
  showVideo: boolean;
};

export type HeroCallToActionContent = {
  label: string;
  href: string;
};

export type HomeHeroContent = {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  cta: HeroCallToActionContent;
  background: HeroBackgroundContent;
  updatedAt: string | null;
};
