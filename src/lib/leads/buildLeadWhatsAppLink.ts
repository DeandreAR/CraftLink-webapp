import type { DashboardLead } from "@/domain/lead";
import { formatLeadDossierMessage } from "@/lib/leads/formatLeadDossier";

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Normalise un numéro FR (06… → 336…). */
function normalizePhoneForWhatsApp(phone: string): string {
  let digits = digitsOnly(phone);
  if (!digits) return "";
  if (digits.startsWith("0")) {
    digits = `33${digits.slice(1)}`;
  }
  return digits;
}

export type LeadWhatsAppLinks = {
  /** Web WhatsApp (navigateur). */
  web: string;
  /** Protocole natif — WhatsApp Desktop sur ordinateur. */
  app: string;
  /** Lien mobile (api.whatsapp.com). */
  api: string;
};

function buildLinksFromPhoneAndText(phone: string, message: string): LeadWhatsAppLinks {
  const text = encodeURIComponent(message);
  const query = `phone=${phone}&text=${text}`;
  return {
    web: `https://wa.me/${phone}?text=${text}`,
    app: `whatsapp://send?${query}`,
    api: `https://api.whatsapp.com/send?${query}`,
  };
}

/** Liens WhatsApp avec un message libre (quick replies). */
export function buildWhatsAppLinksFromMessage(
  phoneRaw: string,
  message: string,
): LeadWhatsAppLinks | null {
  const phone = normalizePhoneForWhatsApp(phoneRaw);
  if (!phone) return null;
  return buildLinksFromPhoneAndText(phone, message);
}

/** Liens WhatsApp vers le client avec le dossier lead pré-rempli. */
export function buildLeadWhatsAppLinks(
  lead: DashboardLead,
  businessName?: string,
): LeadWhatsAppLinks | null {
  const phone = normalizePhoneForWhatsApp(lead.clientPhone);
  if (!phone) return null;
  return buildLinksFromPhoneAndText(phone, formatLeadDossierMessage(lead, { businessName }));
}
