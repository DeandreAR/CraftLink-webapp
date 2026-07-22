import "server-only";

/** Bornes UTC d'un jour calendaire à partir d'aujourd'hui + offset (en jours). */
export function utcCalendarDayBoundsFromToday(offsetDays: number): {
  startIso: string;
  endIso: string;
} {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() + offsetDays);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}
