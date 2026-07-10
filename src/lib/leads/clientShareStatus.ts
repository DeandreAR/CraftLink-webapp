import type { LeadWorkflowStatus } from "@/domain/lead";

/** Statuts pipeline traduits pour le client (page /share). */
const CLIENT_SHARE_STATUS: Record<LeadWorkflowStatus, string> = {
  A_TRAITER: "Demande reçue — l'artisan va vous recontacter",
  DEVIS_A_FAIRE: "Devis en préparation",
  DEVIS_ENVOYE: "Devis envoyé — en attente de votre retour",
  DEVIS_SIGNE: "Devis accepté",
  FACTURE_A_ENVOYER: "Facture en préparation",
  FACTURE_ENVOYEE: "Facture envoyée",
  GAGNE_EN_COURS: "Travaux en cours",
  ARCHIVE: "Dossier clos",
};

export function clientShareWorkflowLabel(status: LeadWorkflowStatus): string {
  return CLIENT_SHARE_STATUS[status];
}
