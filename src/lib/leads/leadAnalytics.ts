import type { DashboardLead, LeadWorkflowStatus } from "@/domain/lead";

export type StatsPeriod = "7d" | "month" | "year";

/** Buckets métier pour le camembert (alignés sur le pipeline CraftLink). */
export type StatsStatusBucket =
  | "pending"
  | "quote_sent"
  | "signed"
  | "refused";

export type LeadStatsKpis = {
  totalRequests: number;
  conversionRate: number;
  signedRevenue: number;
  pendingQuoteVolume: number;
  signedCount: number;
  pendingQuoteCount: number;
};

export type LeadStatsTimelinePoint = {
  key: string;
  label: string;
  count: number;
};

export type LeadStatsStatusSlice = {
  bucket: StatsStatusBucket;
  count: number;
  percentage: number;
};

const SIGNED_STATUSES: ReadonlySet<LeadWorkflowStatus> = new Set([
  "DEVIS_SIGNE",
  "FACTURE_A_ENVOYER",
  "FACTURE_ENVOYEE",
  "GAGNE_EN_COURS",
]);

const PENDING_QUOTE_STATUSES: ReadonlySet<LeadWorkflowStatus> = new Set([
  "DEVIS_A_FAIRE",
  "DEVIS_ENVOYE",
]);

const PENDING_STATUSES: ReadonlySet<LeadWorkflowStatus> = new Set([
  "A_TRAITER",
  "DEVIS_A_FAIRE",
]);

export function isSignedStatus(status: LeadWorkflowStatus): boolean {
  return SIGNED_STATUSES.has(status);
}

export function statusToBucket(status: LeadWorkflowStatus): StatsStatusBucket {
  if (status === "ARCHIVE") return "refused";
  if (SIGNED_STATUSES.has(status)) return "signed";
  if (status === "DEVIS_ENVOYE") return "quote_sent";
  if (PENDING_STATUSES.has(status)) return "pending";
  return "pending";
}

export function filterLeadsByPeriod(
  leads: DashboardLead[],
  period: StatsPeriod,
  now = new Date(),
): DashboardLead[] {
  const start = periodStart(period, now);
  return leads.filter((lead) => {
    const created = new Date(lead.createdAt);
    return !Number.isNaN(created.getTime()) && created >= start && created <= now;
  });
}

function periodStart(period: StatsPeriod, now: Date): Date {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (period === "7d") {
    start.setDate(start.getDate() - 6);
    return start;
  }
  if (period === "month") {
    start.setDate(1);
    return start;
  }
  start.setMonth(0, 1);
  return start;
}

function leadMontant(lead: DashboardLead): number {
  return typeof lead.montant === "number" && Number.isFinite(lead.montant)
    ? lead.montant
    : 0;
}

export function computeLeadKpis(leads: DashboardLead[]): LeadStatsKpis {
  const totalRequests = leads.length;
  const signed = leads.filter((l) => isSignedStatus(l.workflowStatus));
  const pendingQuotes = leads.filter((l) =>
    PENDING_QUOTE_STATUSES.has(l.workflowStatus),
  );
  const signedCount = signed.length;
  const conversionRate =
    totalRequests === 0 ? 0 : Math.round((signedCount / totalRequests) * 1000) / 10;

  return {
    totalRequests,
    conversionRate,
    signedRevenue: signed.reduce((sum, l) => sum + leadMontant(l), 0),
    pendingQuoteVolume: pendingQuotes.reduce((sum, l) => sum + leadMontant(l), 0),
    signedCount,
    pendingQuoteCount: pendingQuotes.length,
  };
}

export function computeStatusDistribution(
  leads: DashboardLead[],
): LeadStatsStatusSlice[] {
  const counts: Record<StatsStatusBucket, number> = {
    pending: 0,
    quote_sent: 0,
    signed: 0,
    refused: 0,
  };

  for (const lead of leads) {
    counts[statusToBucket(lead.workflowStatus)] += 1;
  }

  const total = leads.length;
  return (Object.keys(counts) as StatsStatusBucket[]).map((bucket) => ({
    bucket,
    count: counts[bucket],
    percentage:
      total === 0 ? 0 : Math.round((counts[bucket] / total) * 1000) / 10,
  }));
}

/** Évolution du volume de demandes : jours (7j / mois) ou mois (année). */
export function computeRequestsTimeline(
  leads: DashboardLead[],
  period: StatsPeriod,
  locale: string,
  now = new Date(),
): LeadStatsTimelinePoint[] {
  if (period === "7d") {
    return buildDailyTimeline(leads, 7, locale, now);
  }
  if (period === "month") {
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return buildDailyTimeline(leads, daysInMonth, locale, now, true);
  }
  return buildMonthlyTimeline(leads, locale, now);
}

function buildDailyTimeline(
  leads: DashboardLead[],
  dayCount: number,
  locale: string,
  now: Date,
  fromMonthStart = false,
): LeadStatsTimelinePoint[] {
  const points: LeadStatsTimelinePoint[] = [];
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  if (fromMonthStart) {
    start.setDate(1);
  } else {
    start.setDate(start.getDate() - (dayCount - 1));
  }

  for (let i = 0; i < dayCount; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    if (day > now) break;
    const key = dayKey(day);
    const label = day.toLocaleDateString(locale, {
      day: "numeric",
      month: "short",
    });
    const count = leads.filter((l) => dayKey(new Date(l.createdAt)) === key).length;
    points.push({ key, label, count });
  }
  return points;
}

function buildMonthlyTimeline(
  leads: DashboardLead[],
  locale: string,
  now: Date,
): LeadStatsTimelinePoint[] {
  const year = now.getFullYear();
  const points: LeadStatsTimelinePoint[] = [];
  for (let month = 0; month <= now.getMonth(); month++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const label = new Date(year, month, 1).toLocaleDateString(locale, {
      month: "short",
    });
    const count = leads.filter((l) => {
      const d = new Date(l.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    points.push({ key, label, count });
  }
  return points;
}

function dayKey(date: Date): string {
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatEuro(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
