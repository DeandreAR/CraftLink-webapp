import type { LeadWorkflowStatus } from "@/domain/lead";
import { LEAD_WORKFLOW_STATUSES } from "@/domain/lead";

export function isLeadArchived(status: LeadWorkflowStatus): boolean {
  return status === "ARCHIVE";
}

export function isLeadWorkflowMuted(status: LeadWorkflowStatus): boolean {
  return status === "ARCHIVE";
}

export function isCatchUpEligibleStatus(status: LeadWorkflowStatus): boolean {
  return status === "A_TRAITER" || status === "DEVIS_A_FAIRE";
}

/** Badge pipeline : fond uni voyant, texte blanc. */
export function workflowStatusBadgeClass(status: LeadWorkflowStatus): string {
  switch (status) {
    case "A_TRAITER":
      return "bg-orange-500 text-white";
    case "DEVIS_A_FAIRE":
      return "bg-amber-500 text-white";
    case "DEVIS_ENVOYE":
      return "bg-blue-500 text-white";
    case "DEVIS_SIGNE":
      return "bg-violet-600 text-white";
    case "FACTURE_A_ENVOYER":
      return "bg-fuchsia-600 text-white";
    case "FACTURE_ENVOYEE":
      return "bg-teal-600 text-white";
    case "GAGNE_EN_COURS":
      return "bg-emerald-600 text-white";
    case "ARCHIVE":
      return "bg-neutral-500 text-white";
  }
}

export function workflowStatusColumnClass(status: LeadWorkflowStatus): string {
  switch (status) {
    case "A_TRAITER":
      return "border-t-2 border-t-orange-400 bg-orange-50/40";
    case "DEVIS_A_FAIRE":
      return "border-t-2 border-t-amber-400 bg-amber-50/35";
    case "DEVIS_ENVOYE":
      return "border-t-2 border-t-blue-400 bg-blue-50/35";
    case "DEVIS_SIGNE":
      return "border-t-2 border-t-violet-400 bg-violet-50/35";
    case "FACTURE_A_ENVOYER":
      return "border-t-2 border-t-fuchsia-400 bg-fuchsia-50/35";
    case "FACTURE_ENVOYEE":
      return "border-t-2 border-t-teal-400 bg-teal-50/35";
    case "GAGNE_EN_COURS":
      return "border-t-2 border-t-emerald-400 bg-emerald-50/35";
    case "ARCHIVE":
      return "border-t-2 border-t-neutral-300 bg-neutral-50/60";
  }
}

export { LEAD_WORKFLOW_STATUSES };
