import { FaWhatsapp } from "react-icons/fa6";
import type { Locale } from "@/i18n/config";

const WHATSAPP_URL = "https://wa.me/33623407203";

const ariaLabels: Record<Locale, string> = {
  fr: "Nous contacter sur WhatsApp",
  en: "Contact us on WhatsApp",
};

type LandingWhatsAppFloatProps = {
  lang: Locale;
};

export function LandingWhatsAppFloat({ lang }: LandingWhatsAppFloatProps) {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabels[lang]}
      className="fixed right-3 z-[59] flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-all duration-200 hover:scale-[1.04] hover:bg-[#20bd5a] active:scale-[0.98] bottom-[calc(4.25rem+env(safe-area-inset-bottom))] md:bottom-6 md:right-6"
    >
      <FaWhatsapp className="h-6 w-6" aria-hidden />
    </a>
  );
}
