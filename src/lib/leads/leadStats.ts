import type { DashboardLead, LeadDelayStatus } from "@/domain/lead";

export type LeadsSummaryStats = {
  total: number;
  urgent: number;
  asap: number;
  planned: number;
  info: number;
  done: number;
};

export function computeLeadsSummary(leads: DashboardLead[]): LeadsSummaryStats {
  const active = leads.filter((lead) => lead.workflowStatus !== "ARCHIVE");

  const countByDelay = (status: LeadDelayStatus) =>
    active.filter((lead) => lead.delayStatus === status).length;

  return {
    total: active.length,
    urgent: countByDelay("urgent"),
    asap: countByDelay("asap"),
    planned: countByDelay("planned"),
    info: countByDelay("info"),
    done: leads.filter(
      (lead) =>
        lead.workflowStatus === "DEVIS_ENVOYE" ||
        lead.workflowStatus === "DEVIS_SIGNE" ||
        lead.workflowStatus === "FACTURE_A_ENVOYER" ||
        lead.workflowStatus === "FACTURE_ENVOYEE" ||
        lead.workflowStatus === "GAGNE_EN_COURS",
    ).length,
  };
}
