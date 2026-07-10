import type { LeadDelayStatus } from "@/domain/lead";
import type { Locale } from "@/i18n/config";
import { parseFullPhoneNumber } from "@/lib/phone/formatPhoneNumber";
import {
  isLeadArchived,
  isLeadWorkflowMuted,
  workflowStatusBadgeClass,
  workflowStatusColumnClass,
} from "@/lib/leads/workflowStatus";

export {
  isLeadArchived,
  isLeadWorkflowMuted,
  workflowStatusBadgeClass,
  workflowStatusColumnClass,
};

export function formatClientPhone(phone: string, locale: Locale): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const parsed = parseFullPhoneNumber(trimmed, locale === "fr" ? "FR" : "US");
  const localDigits = parsed.local.replace(/\D/g, "");

  if (parsed.country.iso === "FR" && localDigits.length === 9) {
    const n = `0${localDigits}`;
    return `+33 ${n.slice(1, 2)} ${n.slice(2, 4)} ${n.slice(4, 6)} ${n.slice(6, 8)} ${n.slice(8, 10)}`;
  }

  if (parsed.country.iso === "FR" && localDigits.length === 10 && localDigits.startsWith("0")) {
    return `+33 ${localDigits.slice(1, 2)} ${localDigits.slice(2, 4)} ${localDigits.slice(4, 6)} ${localDigits.slice(6, 8)} ${localDigits.slice(8, 10)}`;
  }

  return trimmed;
}

export function formatRequestNumber(requestNumber: number): string {
  return String(requestNumber).padStart(4, "0");
}

export function formatScheduleShort(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "short",
  }).format(new Date(y, m - 1, d));
}

export function contactStatusBadgeClass(contacted: boolean): string {
  return contacted
    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
    : "bg-neutral-100 text-neutral-500 border border-neutral-200";
}

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

export function delayStatusColumnClass(status: LeadDelayStatus): string {
  if (status === "urgent") return "border-t-2 border-t-red-400 bg-red-50/40";
  if (status === "asap") return "border-t-2 border-t-amber-400 bg-amber-50/30";
  if (status === "planned") return "border-t-2 border-t-sky-400 bg-sky-50/30";
  return "border-t-2 border-t-neutral-300 bg-neutral-50/50";
}

export function leadRowMutedClass(muted: boolean): string {
  return muted ? "opacity-55 grayscale-[0.15]" : "";
}
