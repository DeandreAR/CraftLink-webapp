import type { DashboardLead } from "@/domain/lead";
import { isCatchUpEligibleStatus } from "@/lib/leads/workflowStatus";

export const CATCH_UP_STALE_HOURS = 48;

export type CatchUpAction = "quote_sent" | "lost" | "snooze";

function leadActivityAt(lead: DashboardLead): Date {
  return new Date(lead.updatedAt || lead.createdAt);
}

/** Lead éligible au bandeau Smart Catch-up. */
export function isLeadCatchUpEligible(
  lead: DashboardLead,
  now: Date = new Date(),
): boolean {
  if (!isCatchUpEligibleStatus(lead.workflowStatus)) return false;

  const staleMs = CATCH_UP_STALE_HOURS * 3_600_000;
  return now.getTime() - leadActivityAt(lead).getTime() >= staleMs;
}

/** Lead le plus ancien à relancer (un seul bandeau à la fois). */
export function findCatchUpLead(
  leads: DashboardLead[],
  now: Date = new Date(),
): DashboardLead | null {
  const eligible = leads.filter((lead) => isLeadCatchUpEligible(lead, now));
  if (!eligible.length) return null;

  return [...eligible].sort(
    (a, b) => leadActivityAt(a).getTime() - leadActivityAt(b).getTime(),
  )[0];
}
