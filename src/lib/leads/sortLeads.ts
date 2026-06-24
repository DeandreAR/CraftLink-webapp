import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";
import {
  ESSENTIAL_MONTHLY_LEAD_LIMIT,
  isProPlan,
} from "@/lib/dashboard/planAccess";

/** Priorité pour le tri par statut (délai). */
export const DELAY_STATUS_SORT_ORDER: Record<LeadDelayStatus, number> = {
  urgent: 0,
  asap: 1,
  planned: 2,
  info: 3,
};

export type LeadSortKey = "date" | "name" | "status";

export function sortLeads(
  leads: DashboardLead[],
  sortKey: LeadSortKey,
): DashboardLead[] {
  const copy = [...leads];

  copy.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortKey === "name") {
      return a.clientName.localeCompare(b.clientName, "fr", { sensitivity: "base" });
    }
    const diff =
      DELAY_STATUS_SORT_ORDER[a.delayStatus] - DELAY_STATUS_SORT_ORDER[b.delayStatus];
    if (diff !== 0) return diff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return copy;
}

/** Quota Essentiel : basé sur l'ordre chronologique de réception, pas sur le tri affiché. */
export function isLeadQuotaLocked(
  lead: DashboardLead,
  allLeads: DashboardLead[],
  planTier: string,
): boolean {
  if (isProPlan(planTier)) return false;

  const byDate = [...allLeads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const rank = byDate.findIndex((item) => item.id === lead.id);
  return rank >= ESSENTIAL_MONTHLY_LEAD_LIMIT;
}
