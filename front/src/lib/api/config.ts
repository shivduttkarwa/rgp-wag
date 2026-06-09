export const API_BASE = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  ""
).replace(/\/$/, "");

/**
 * Prefix Django media/static relative paths with the backend base URL.
 * Paths that are already absolute (http/https) or relative to the Vite
 * public folder (no leading slash) are returned unchanged.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("/media/") || url.startsWith("/static/")) {
    return `${API_BASE}${url}`;
  }
  return url;
}
