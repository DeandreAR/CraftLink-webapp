import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";

export type LeadSortKey = "date" | "name" | "status";
export type LeadSortDirection = "asc" | "desc";

export type LeadSortState = {
  key: LeadSortKey;
  direction: LeadSortDirection;
};

export const DEFAULT_LEAD_SORT: LeadSortState = { key: "date", direction: "desc" };

/** Priorité pour le tri par statut (délai). */
export const DELAY_STATUS_SORT_ORDER: Record<LeadDelayStatus, number> = {
  urgent: 0,
  asap: 1,
  planned: 2,
  info: 3,
};

const DEFAULT_DIRECTION: Record<LeadSortKey, LeadSortDirection> = {
  date: "desc",
  name: "asc",
  status: "asc",
};

export function toggleLeadSort(current: LeadSortState, key: LeadSortKey): LeadSortState {
  if (current.key === key) {
    return { key, direction: current.direction === "asc" ? "desc" : "asc" };
  }
  return { key, direction: DEFAULT_DIRECTION[key] };
}

export function sortLeads(
  leads: DashboardLead[],
  sort: LeadSortState,
): DashboardLead[] {
  const { key: sortKey, direction } = sort;
  const copy = [...leads];
  const factor = direction === "asc" ? 1 : -1;

  copy.sort((a, b) => {
    if (sortKey === "date") {
      return (
        factor *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
    }
    if (sortKey === "name") {
      return factor * a.clientName.localeCompare(b.clientName, "fr", { sensitivity: "base" });
    }
    const diff =
      DELAY_STATUS_SORT_ORDER[a.delayStatus] - DELAY_STATUS_SORT_ORDER[b.delayStatus];
    if (diff !== 0) return factor * diff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return copy;
}
