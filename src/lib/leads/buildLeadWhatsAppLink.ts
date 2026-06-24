import type { DashboardLead } from "@/domain/lead";
import { formatLeadDossierMessage } from "@/lib/leads/formatLeadDossier";

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Lien wa.me vers le client avec le dossier lead pré-rempli. */
export function buildLeadWhatsAppLink(
  lead: DashboardLead,
  artisanName?: string,
): string {
  const phone = digitsOnly(lead.clientPhone);
  if (!phone) return "";
  const text = encodeURIComponent(formatLeadDossierMessage(lead, artisanName));
  return `https://wa.me/${phone}?text=${text}`;
}
