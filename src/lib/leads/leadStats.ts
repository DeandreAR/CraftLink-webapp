import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";

export type LeadsSummaryStats = {
  total: number;
  urgent: number;
  asap: number;
  planned: number;
  info: number;
  done: number;
};

export function computeLeadsSummary(leads: DashboardLead[]): LeadsSummaryStats {
  const active = leads.filter((lead) => lead.workflowStatus !== "archived");

  const countByDelay = (status: LeadDelayStatus) =>
    active.filter((lead) => lead.delayStatus === status).length;

  return {
    total: active.length,
    urgent: countByDelay("urgent"),
    asap: countByDelay("asap"),
    planned: countByDelay("planned"),
    info: countByDelay("info"),
    done: leads.filter((lead) => lead.workflowStatus === "done").length,
  };
}
