import { startTransition, useEffect, useState } from "react";

import {
  DEFAULT_HOME_HERO_CONTENT,
  fetchHomeHeroContent,
} from "@/lib/api/homeContent";
import type { HomeHeroContent } from "@/types/content";

type HomeHeroContentState = {
  data: HomeHeroContent;
  error: string | null;
  status: "loading" | "ready" | "fallback";
};

const INITIAL_STATE: HomeHeroContentState = {
  data: DEFAULT_HOME_HERO_CONTENT,
  error: null,
  status: "loading",
};

export function useHomeHeroContent(): HomeHeroContentState {
  const [state, setState] = useState<HomeHeroContentState>(INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();

    const loadContent = async () => {
      try {
        const data = await fetchHomeHeroContent(controller.signal);
        startTransition(() => {
          setState({
            data,
            error: null,
            status: "ready",
          });
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Unable to load hero content.";

        startTransition(() => {
          setState({
            data: DEFAULT_HOME_HERO_CONTENT,
            error: message,
            status: "fallback",
          });
        });
      }
    };

    void loadContent();

    return () => controller.abort();
  }, []);

  return state;
}
