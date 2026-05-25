/** Numéro international sans + (ex. 33612345678). Définir dans .env.local */
const RAW_WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "33600000000";

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Lien wa.me — gratuit pour l’éditeur et le visiteur (données mobile selon forfait). */
export function getWhatsAppHref(message?: string): string {
  const phone = digitsOnly(RAW_WHATSAPP);
  const text = encodeURIComponent(
    message ??
      "Bonjour CraftLink, je souhaite en savoir plus sur l’offre Pro.",
  );
  return `https://wa.me/${phone}?text=${text}`;
}
