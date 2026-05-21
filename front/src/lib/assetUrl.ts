const rawBase = import.meta.env.BASE_URL ?? "/";
const base = rawBase.endsWith("/") ? rawBase : `${rawBase}/`;
const apiBase = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

const isExternal = (value: string) =>
  /^(https?:)?\/\//.test(value) || value.startsWith("data:") || value.startsWith("blob:");

/**
 * Returns a GitHub Pages / sub-path-safe URL for files in `public/`.
 *
 * Accepts:
 * - "images/foo.jpg"
 * - "/images/foo.jpg"
 * - `${import.meta.env.BASE_URL}images/foo.jpg`
 * - external URLs (returned as-is)
 */
export default function assetUrl(src?: string) {
  if (!src) return "";
  if (isExternal(src)) return src;
  if (src.startsWith("/media/") || src.startsWith("/static/")) {
    return apiBase ? `${apiBase}${src}` : src;
  }
  if (src.startsWith(base)) return src;

  const normalized = src.startsWith("/") ? src.slice(1) : src;
  return `${base}${normalized}`;
}

