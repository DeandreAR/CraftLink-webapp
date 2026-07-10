export type ParsedGoogleIdentifier =
  | { kind: "place_id"; placeId: string; sourceUrl?: string }
  | { kind: "url"; url: string }
  | { kind: "search"; query: string };

function tryParseUrl(input: string): URL | null {
  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    return new URL(withScheme);
  } catch {
    return null;
  }
}

function extractPlaceIdFromText(text: string): string | null {
  const match = text.match(/place_id:([A-Za-z0-9_-]+)/i);
  return match?.[1] ?? null;
}

function isGoogleMapsHost(hostname: string): boolean {
  return (
    hostname === "g.page" ||
    hostname.endsWith(".g.page") ||
    hostname === "maps.app.goo.gl" ||
    hostname === "goo.gl" ||
    (hostname.includes("google.") &&
      (hostname.includes("maps") || hostname === "maps.google.com"))
  );
}

/** Liens courts / partage GMB reconnus mais pas toujours résolvables en place_id direct. */
function isGoogleBusinessUrlHost(hostname: string): boolean {
  return (
    isGoogleMapsHost(hostname) ||
    hostname === "share.google" ||
    hostname.endsWith(".share.google") ||
    hostname === "business.google.com" ||
    hostname.endsWith(".business.google.com")
  );
}

export function isShareGoogleUrl(raw: string): boolean {
  const url = tryParseUrl(raw.trim());
  if (!url) return /^share\.google\//i.test(raw.trim());
  return url.hostname === "share.google" || url.hostname.endsWith(".share.google");
}

function isRawPlaceId(value: string): boolean {
  return /^ChIJ[\w-]+$/i.test(value) || /^EhI[\w-]+$/i.test(value);
}

export function parseGoogleIdentifier(raw: string): ParsedGoogleIdentifier {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Identifiant Google requis");
  }

  const embeddedPlaceId = extractPlaceIdFromText(trimmed);
  if (embeddedPlaceId) {
    const url = tryParseUrl(trimmed);
    return {
      kind: "place_id",
      placeId: embeddedPlaceId,
      sourceUrl: url && isGoogleMapsHost(url.hostname) ? url.href : undefined,
    };
  }

  if (isRawPlaceId(trimmed)) {
    return { kind: "place_id", placeId: trimmed };
  }

  const url = tryParseUrl(trimmed);
  if (url && isGoogleBusinessUrlHost(url.hostname)) {
    const queryPlaceId = url.searchParams.get("place_id");
    if (queryPlaceId) {
      return { kind: "place_id", placeId: queryPlaceId, sourceUrl: url.href };
    }
    return { kind: "url", url: url.href };
  }

  if (/^share\.google\//i.test(trimmed)) {
    const normalized = tryParseUrl(trimmed);
    if (normalized) {
      return { kind: "url", url: normalized.href };
    }
  }

  if (/^g\.page\//i.test(trimmed)) {
    const normalized = tryParseUrl(trimmed);
    if (normalized) {
      return { kind: "url", url: normalized.href };
    }
  }

  return { kind: "search", query: trimmed };
}

export function googleBusinessUrlFromPlaceId(placeId: string): string {
  return `https://www.google.com/maps/place/?q=place_id:${placeId}`;
}

export function resolveGoogleBusinessUrl(
  parsed: ParsedGoogleIdentifier,
  resolvedPlaceId?: string | null,
): string {
  if (parsed.kind === "place_id") {
    return parsed.sourceUrl ?? googleBusinessUrlFromPlaceId(parsed.placeId);
  }
  if (parsed.kind === "url") {
    return parsed.url;
  }
  if (resolvedPlaceId) {
    return googleBusinessUrlFromPlaceId(resolvedPlaceId);
  }
  return "";
}
