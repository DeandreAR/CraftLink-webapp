const ALLOWED_HOST_PATTERN =
  /(?:googleusercontent\.com|ggpht\.com|streetviewpixels|gstatic\.com|googleapis\.com|serpapi\.com)/i;

const STREET_VIEW_PATTERN = /streetviewpixels|street\s*view|360°/i;

export function isAllowedGooglePhotoUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && ALLOWED_HOST_PATTERN.test(url.hostname);
  } catch {
    return false;
  }
}

export function isStreetViewPhotoUrl(raw: string, title?: string): boolean {
  if (STREET_VIEW_PATTERN.test(raw)) return true;
  if (title && STREET_VIEW_PATTERN.test(title)) return true;
  return false;
}

export function buildGooglePhotoProxyUrl(rawUrl: string): string {
  return `/api/import/google/photo?url=${encodeURIComponent(rawUrl)}`;
}
