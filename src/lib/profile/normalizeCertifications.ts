export const MAX_PROFILE_CERTIFICATIONS = 12;
export const MAX_CERTIFICATION_LABEL_LENGTH = 48;

/** Nettoie et déduplique les certifications avant persistance ou affichage. */
export function normalizeCertifications(input: unknown): string[] {
  if (!Array.isArray(input)) return [];

  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of input) {
    if (typeof item !== "string") continue;
    const label = item.trim().replace(/\s+/g, " ");
    if (!label || label.length > MAX_CERTIFICATION_LABEL_LENGTH) continue;

    const key = label.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(label);
    if (result.length >= MAX_PROFILE_CERTIFICATIONS) break;
  }

  return result;
}
