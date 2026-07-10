export type ParsedGoogleAddress = {
  streetLine: string | null;
  postalCode: string | null;
  city: string | null;
  /** Libellé affiché dans l'onboarding (ex. « 75002 Paris »). */
  displayCity: string | null;
};

/** Extrait ville et code postal d'une adresse GMB (format SerpApi). */
export function parseGoogleAddress(address: string): ParsedGoogleAddress {
  const trimmed = address.trim();
  if (!trimmed) {
    return { streetLine: null, postalCode: null, city: null, displayCity: null };
  }

  let segments = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (segments.length > 1 && /^france$/i.test(segments[segments.length - 1] ?? "")) {
    segments = segments.slice(0, -1);
  }

  const streetLine = segments[0] ?? null;
  let postalCode: string | null = null;
  let cityName: string | null = null;

  for (let index = segments.length - 1; index >= 1; index -= 1) {
    const segment = segments[index] ?? "";
    const postalMatch = segment.match(/^(\d{5})\s+(.+)$/);
    if (postalMatch) {
      postalCode = postalMatch[1];
      cityName = postalMatch[2].trim();
      break;
    }
    if (!cityName && segment && !/^\d+$/.test(segment)) {
      cityName = segment;
    }
  }

  if (!postalCode) {
    const postalInAddress = trimmed.match(/\b(\d{5})\b/);
    postalCode = postalInAddress?.[1] ?? null;
  }

  const displayCity =
    postalCode && cityName
      ? `${postalCode} ${cityName}`
      : cityName ?? (postalCode ? postalCode : streetLine);

  return { streetLine, postalCode, city: cityName, displayCity };
}
