import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";

export type LeadSortKey = "id" | "date" | "name" | "delay" | "calendar" | "contactStatus";
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

const CONTACT_STATUS_SORT_ORDER: Record<DashboardLead["contactStatus"], number> = {
  pending: 0,
  contacted: 1,
};

const DEFAULT_DIRECTION: Record<LeadSortKey, LeadSortDirection> = {
  id: "desc",
  date: "desc",
  name: "asc",
  delay: "asc",
  calendar: "asc",
  contactStatus: "asc",
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
    if (sortKey === "id") {
      return factor * (a.requestNumber - b.requestNumber);
    }
    if (sortKey === "date") {
      return (
        factor *
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      );
    }
    if (sortKey === "name") {
      return factor * a.clientName.localeCompare(b.clientName, "fr", { sensitivity: "base" });
    }
    if (sortKey === "delay") {
      const diff =
        DELAY_STATUS_SORT_ORDER[a.delayStatus] - DELAY_STATUS_SORT_ORDER[b.delayStatus];
      if (diff !== 0) return factor * diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortKey === "calendar") {
      const aTime = a.schedule?.date ? new Date(a.schedule.date).getTime() : null;
      const bTime = b.schedule?.date ? new Date(b.schedule.date).getTime() : null;
      if (aTime === null && bTime === null) return 0;
      if (aTime === null) return factor;
      if (bTime === null) return -factor;
      return factor * (aTime - bTime);
    }
    if (sortKey === "contactStatus") {
      const diff =
        CONTACT_STATUS_SORT_ORDER[a.contactStatus] -
        CONTACT_STATUS_SORT_ORDER[b.contactStatus];
      if (diff !== 0) return factor * diff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return copy;
}
