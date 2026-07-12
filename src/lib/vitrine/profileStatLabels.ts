import type { Locale } from "@/i18n/config";

export function formatExperienceYearsBadge(years: number, locale: Locale): string {
  const n = Math.max(1, Math.round(years));
  return locale === "en" ? `${n}+ years of experience` : `${n}+ ans d'expérience`;
}

export function formatCompletedProjectsBadge(count: number, locale: Locale): string {
  const n = Math.max(1, Math.round(count));
  return locale === "en" ? `${n}+ completed projects` : `${n}+ réalisations`;
}

export function resolvePublicExperienceYears(
  experienceYears?: number,
  importExperienceYears?: number,
): number | undefined {
  if (typeof experienceYears === "number" && experienceYears > 0) {
    return Math.round(experienceYears);
  }
  if (typeof importExperienceYears === "number" && importExperienceYears > 0) {
    return Math.round(importExperienceYears);
  }
  return undefined;
}
