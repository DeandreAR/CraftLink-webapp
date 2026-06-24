import type { LeadDelayStatus, LeadWorkflowStatus } from "@/domain/lead";
import type { Locale } from "@/i18n/config";

export function formatRequestNumber(requestNumber: number): string {
  return String(requestNumber).padStart(4, "0");
}

export function formatLeadDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function isLeadWorkflowMuted(workflow: LeadWorkflowStatus): boolean {
  return workflow === "done" || workflow === "archived";
}

export function delayStatusBadgeClass(status: LeadDelayStatus): string {
  if (status === "urgent") return "bg-red-100 text-red-800 border border-red-200";
  if (status === "asap") return "bg-amber-50 text-amber-900 border border-amber-200";
  if (status === "planned") return "bg-sky-50 text-sky-900 border border-sky-200";
  return "bg-neutral-100 text-neutral-700 border border-neutral-200";
}

export function delayStatusColumnClass(status: LeadDelayStatus): string {
  if (status === "urgent") return "border-t-2 border-t-red-400 bg-red-50/40";
  if (status === "asap") return "border-t-2 border-t-amber-400 bg-amber-50/30";
  if (status === "planned") return "border-t-2 border-t-sky-400 bg-sky-50/30";
  return "border-t-2 border-t-neutral-300 bg-neutral-50/50";
}

export function workflowStatusBadgeClass(
  workflow: "done" | "archived",
): string {
  if (workflow === "done") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  return "bg-neutral-100 text-neutral-500 border border-neutral-200";
}

export function leadRowMutedClass(muted: boolean): string {
  return muted ? "opacity-55 grayscale-[0.15]" : "";
}
