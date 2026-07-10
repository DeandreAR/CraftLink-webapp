import type { DashboardLead, LeadWorkflowStatus } from "@/domain/lead";

/** Horodate automatiquement l'envoi devis / facture lors du changement de statut. */
export function enrichWorkflowStatusPatch(
  current: DashboardLead,
  patch: Partial<DashboardLead>,
): Partial<DashboardLead> {
  if (!patch.workflowStatus) return patch;

  const enriched: Partial<DashboardLead> = { ...patch };
  const status = patch.workflowStatus;

  if (status === "DEVIS_ENVOYE" && !current.quoteSentAt) {
    enriched.quoteSentAt = new Date().toISOString();
  }
  if (status === "FACTURE_ENVOYEE" && !current.invoiceSentAt) {
    enriched.invoiceSentAt = new Date().toISOString();
  }

  return enriched;
}

export const WORKFLOW_SORT_ORDER: Record<LeadWorkflowStatus, number> = {
  A_TRAITER: 0,
  DEVIS_A_FAIRE: 1,
  DEVIS_ENVOYE: 2,
  DEVIS_SIGNE: 3,
  FACTURE_A_ENVOYER: 4,
  FACTURE_ENVOYEE: 5,
  GAGNE_EN_COURS: 6,
  ARCHIVE: 7,
};
