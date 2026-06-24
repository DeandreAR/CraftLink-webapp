import type { LeadDelayStatus } from "@/domain/lead";
import type { Locale } from "@/i18n/config";

export function formatLeadDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function delayStatusBadgeClass(status: LeadDelayStatus): string {
  if (status === "urgent") return "bg-red-100 text-red-800 border border-red-200";
  if (status === "asap") return "bg-amber-50 text-amber-900 border border-amber-200";
  if (status === "planned") return "bg-sky-50 text-sky-900 border border-sky-200";
  return "bg-neutral-100 text-neutral-700 border border-neutral-200";
}

export function workflowStatusBadgeClass(
  workflow: "done" | "archived",
): string {
  if (workflow === "done") return "bg-emerald-50 text-emerald-800 border border-emerald-200";
  return "bg-neutral-200 text-neutral-600 border border-neutral-300";
}
