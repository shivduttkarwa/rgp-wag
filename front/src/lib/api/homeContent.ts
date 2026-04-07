import type { HomeHeroContent } from "@/types/content";

type HeroContentApiResponse = {
  title_line_1?: unknown;
  title_line_2?: unknown;
  subtitle?: unknown;
  updated_at?: unknown;
  cta?: {
    label?: unknown;
    href?: unknown;
  };
  background?: {
    image_url?: unknown;
    poster_url?: unknown;
    video_url?: unknown;
    show_video?: unknown;
  };
};

export const DEFAULT_HOME_HERO_CONTENT: HomeHeroContent = {
  titleLine1: "Your [gold]Dream[/gold] Home",
  titleLine2: "[amber]Perfectly[/amber] Delivered",
  subtitle:
    "350+ premium properties delivered - luxury villas, penthouses & exclusive estates crafted for those who demand the extraordinary.",
  cta: {
    label: "Explore Properties",
    href: "/properties",
  },
  background: {
    imageUrl: "images/hero-rpg-brisbane.jpg",
    posterUrl: null,
    videoUrl: "vids/hero-rgp.mp4",
    showVideo: true,
  },
  updatedAt: null,
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

function buildApiUrl(path: string): string {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function normalizeHeroContent(payload: HeroContentApiResponse): HomeHeroContent {
  const imageUrl = asString(
    payload.background?.image_url,
    DEFAULT_HOME_HERO_CONTENT.background.imageUrl,
  );
  const posterUrl = asNullableString(payload.background?.poster_url);
  const videoUrl = asNullableString(payload.background?.video_url);

  return {
    titleLine1: asString(
      payload.title_line_1,
      DEFAULT_HOME_HERO_CONTENT.titleLine1,
    ),
    titleLine2: asString(
      payload.title_line_2,
      DEFAULT_HOME_HERO_CONTENT.titleLine2,
    ),
    subtitle: asString(payload.subtitle, DEFAULT_HOME_HERO_CONTENT.subtitle),
    cta: {
      label: asString(
        payload.cta?.label,
        DEFAULT_HOME_HERO_CONTENT.cta.label,
      ),
      href: asString(payload.cta?.href, DEFAULT_HOME_HERO_CONTENT.cta.href),
    },
    background: {
      imageUrl,
      posterUrl,
      videoUrl,
      showVideo:
        asBoolean(
          payload.background?.show_video,
          DEFAULT_HOME_HERO_CONTENT.background.showVideo,
        ) && Boolean(videoUrl),
    },
    updatedAt: asNullableString(payload.updated_at),
  };
}

export async function fetchHomeHeroContent(
  signal?: AbortSignal,
): Promise<HomeHeroContent> {
  const response = await fetch(buildApiUrl("/api/content/hero/"), {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Hero content request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as HeroContentApiResponse;
  return normalizeHeroContent(payload);
}
