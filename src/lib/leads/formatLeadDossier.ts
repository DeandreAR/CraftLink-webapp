import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";

const DELAY_LABELS: Record<LeadDelayStatus, string> = {
  urgent: "Urgent",
  asap: "Dès que possible",
  planned: "Projet planifié",
  info: "Info / devis",
};

export function leadDelayStatusLabel(status: LeadDelayStatus): string {
  return DELAY_LABELS[status];
}

export type LeadDossierContext = {
  /** Nom de l'entreprise artisan (ex. « John Carter Électricité »). */
  businessName?: string;
};

function resolveDescription(lead: DashboardLead): string {
  const description = lead.description?.trim();
  if (description) return description;
  return lead.summary?.trim() ?? "";
}

/** Message WhatsApp pré-rempli pour le client. */
export function formatLeadDossierMessage(
  lead: DashboardLead,
  context?: LeadDossierContext,
): string {
  const clientName = lead.clientName.trim();
  const company = context?.businessName?.trim() || "notre entreprise";
  const description = resolveDescription(lead);

  const lines = [
    clientName ? `Bonjour ${clientName},` : "Bonjour,",
    "",
    `C'est l'entreprise ${company}, je reviens vers vous concernant votre demande.`,
    "",
    "Voici le récapitulatif de votre besoin :",
    `• Travaux : ${lead.workType}`,
    `• Zone : ${lead.zone}`,
    `• Statut : ${leadDelayStatusLabel(lead.delayStatus)}`,
  ];

  if (description) {
    lines.push(`• Description : ${description}`);
  }

  if (lead.voice) {
    lines.push(`• Message vocal : ${lead.voice.audioUrl}`);
    lines.push(`• Résumé du message vocal : ${lead.voice.summary}`);
  }

  if (lead.photos?.length) {
    lines.push(`• Photos (${lead.photos.length}) :`);
    lead.photos.forEach((photo, index) => {
      lines.push(`  ${index + 1}. ${photo.url}`);
    });
  }

  lines.push(
    "",
    "N'hésitez pas à me confirmer ces informations ou à me préciser tout autre élément utile.",
  );

  return lines.join("\n");
}
