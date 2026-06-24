import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";

const DELAY_LABELS: Record<LeadDelayStatus, string> = {
  urgent: "Urgent — intervention rapide",
  asap: "Dès que possible",
  planned: "Projet planifié",
  info: "Demande d'information / devis",
};

export function leadDelayStatusLabel(status: LeadDelayStatus): string {
  return DELAY_LABELS[status];
}

export function formatLeadDossierMessage(
  lead: DashboardLead,
  artisanName?: string,
): string {
  const greeting = lead.clientName.trim()
    ? `Bonjour ${lead.clientName.trim()},`
    : "Bonjour,";

  const lines = [
    greeting,
    "",
    "Suite à votre demande via ma page CraftLink :",
    `• Travaux : ${lead.workType}`,
    `• Zone : ${lead.zone}`,
    `• Statut / délai : ${leadDelayStatusLabel(lead.delayStatus)}`,
    "",
    lead.summary.trim(),
    "",
    artisanName?.trim() ? `Cordialement,\n${artisanName.trim()}` : "Cordialement",
  ];

  return lines.join("\n");
}
