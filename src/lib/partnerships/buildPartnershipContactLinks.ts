import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";
import type { DashboardDictionary } from "@/i18n/types";
import { buildWhatsAppLinksFromMessage } from "@/lib/leads/buildLeadWhatsAppLink";

export type PartnershipContactLinks = {
  email: string;
  sms: string | null;
  whatsapp: string | null;
};

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

function applyTemplate(template: string, request: DashboardPartnershipRequest, copy: DashboardDictionary): string {
  const partnershipLabel = copy.partners.types[request.partnershipType];
  return template
    .replaceAll("{contactName}", request.contactName)
    .replaceAll("{company}", request.companyName)
    .replaceAll("{partnershipType}", partnershipLabel);
}

export function buildPartnershipContactLinks(
  request: DashboardPartnershipRequest,
  copy: DashboardDictionary,
): PartnershipContactLinks {
  const d = copy.partners.detail;
  const message = applyTemplate(d.contactMessage, request, copy);
  const subject = applyTemplate(d.contactEmailSubject, request, copy);

  const email = `mailto:${encodeURIComponent(request.email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  const phoneDigits = digitsOnly(request.phone);
  const sms = phoneDigits
    ? `sms:${phoneDigits}?body=${encodeURIComponent(message)}`
    : null;

  const whatsappLinks = request.phone.trim()
    ? buildWhatsAppLinksFromMessage(request.phone, message)
    : null;

  return {
    email,
    sms,
    whatsapp: whatsappLinks?.web ?? null,
  };
}
