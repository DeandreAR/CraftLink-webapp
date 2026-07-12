import { JOB_NEED_OTHER, JOB_TYPES } from "@/config/jobTypes.js";
import type { Locale } from "@/i18n/config";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";

/** Liste des natures de besoin pour un métier (5 besoins + « Autre »). */
export function getJobNeedOptions(
  metierKey: string | null | undefined,
  locale: Locale,
): string[] {
  const other = JOB_NEED_OTHER[locale];

  if (!metierKey || !isMetierKey(metierKey)) {
    return [other];
  }

  const job = JOB_TYPES[metierKey];
  const needs = job?.needs?.[locale] ?? [];

  if (needs.length === 0) {
    return [other];
  }

  return [...needs, other];
}
