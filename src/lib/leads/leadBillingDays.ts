import type { DashboardLead } from "@/domain/lead";

/** Nombre de jours calendaires depuis une date ISO (null si pas encore envoyé). */
export function daysSinceDate(
  isoDate: string | null | undefined,
  now: Date = new Date(),
): number | null {
  if (!isoDate) return null;
  const start = new Date(isoDate);
  if (Number.isNaN(start.getTime())) return null;
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / 86_400_000));
}

export function daysSinceQuoteSent(lead: DashboardLead, now?: Date): number | null {
  return daysSinceDate(lead.quoteSentAt, now);
}

export function daysSinceInvoiceSent(lead: DashboardLead, now?: Date): number | null {
  return daysSinceDate(lead.invoiceSentAt, now);
}

export function formatBillingDaysCount(
  days: number | null,
  notSentLabel: string,
  dayUnit: string,
): string {
  if (days === null) return notSentLabel;
  return `${days} ${dayUnit}`;
}
