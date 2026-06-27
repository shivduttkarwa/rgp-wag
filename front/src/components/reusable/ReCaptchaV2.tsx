import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      render: (container: HTMLElement, options: object) => number;
      reset: (widgetId: number) => void;
    };
    onRecaptchaLoad?: () => void;
  }
}

export interface ReCaptchaV2Handle {
  reset: () => void;
}

interface Props {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

/** True only when a site key is configured — use this to gate token requirements in forms. */
export const RECAPTCHA_ENABLED = Boolean(SITE_KEY);

const ReCaptchaV2 = forwardRef<ReCaptchaV2Handle, Props>(({ onVerify, onExpire }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current !== null) {
        window.grecaptcha?.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (!SITE_KEY) return; // no key configured — skip widget

    const render = () => {
      if (!containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: onVerify,
        "expired-callback": () => onExpire?.(),
      });
    };

    const init = () => window.grecaptcha.ready(render);

    if (typeof window.grecaptcha !== "undefined") {
      init();
    } else {
      const prev = window.onRecaptchaLoad;
      window.onRecaptchaLoad = () => {
        prev?.();
        init();
      };
    }

    return () => {
      widgetIdRef.current = null;
    };
  }, []);

  if (!SITE_KEY) return null;

  return <div ref={containerRef} />;
});

ReCaptchaV2.displayName = "ReCaptchaV2";

export default ReCaptchaV2;
