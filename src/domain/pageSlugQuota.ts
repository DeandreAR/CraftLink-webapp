/** Max changements d’URL publique sur 12 mois glissants. */
export const MAX_PAGE_SLUG_CHANGES_PER_YEAR = 2;

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export type PageSlugChangeQuota = {
  used: number;
  remaining: number;
  /** Dates dans la fenêtre des 12 mois (ISO). */
  recentDates: string[];
  /** Quand un nouveau changement sera possible si quota saturé. */
  nextAvailableAt: string | null;
};

export function parsePageSlugChangeDates(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") return item;
      if (item instanceof Date) return item.toISOString();
      return null;
    })
    .filter((item): item is string => Boolean(item && !Number.isNaN(Date.parse(item))));
}

export function getPageSlugChangeQuota(
  dates: string[],
  now: Date = new Date(),
): PageSlugChangeQuota {
  const cutoff = now.getTime() - YEAR_MS;
  const recentDates = dates
    .filter((iso) => Date.parse(iso) >= cutoff)
    .sort((a, b) => Date.parse(a) - Date.parse(b));

  const used = recentDates.length;
  const remaining = Math.max(0, MAX_PAGE_SLUG_CHANGES_PER_YEAR - used);
  const nextAvailableAt =
    used >= MAX_PAGE_SLUG_CHANGES_PER_YEAR
      ? new Date(Date.parse(recentDates[0]) + YEAR_MS).toISOString()
      : null;

  return { used, remaining, recentDates, nextAvailableAt };
}

export function appendPageSlugChangeDate(
  dates: string[],
  at: Date = new Date(),
): string[] {
  return [...dates, at.toISOString()];
}
