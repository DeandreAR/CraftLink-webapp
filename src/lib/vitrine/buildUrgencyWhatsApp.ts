import { normalizePhoneForWhatsApp } from "@/lib/leads/buildLeadWhatsAppLink";

/** Lien wa.me pour signaler une urgence avec message pré-rempli. */
export function buildUrgencyWhatsAppUrl(phoneRaw: string, message: string): string | null {
  const phone = normalizePhoneForWhatsApp(phoneRaw);
  if (!phone) return null;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
