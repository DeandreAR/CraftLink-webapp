import { buildAppUrl } from "@/config/app";
import { abonnementPath } from "@/lib/auth/paths";
import { defaultLocale } from "@/i18n/config";

/** Lien CTA e-mails essai : connexion puis page abonnement (Checkout Stripe). */
export function buildTrialAbonnementCtaUrl(locale = defaultLocale): string {
  const destination = abonnementPath(locale);
  return buildAppUrl(`/login?next=${encodeURIComponent(destination)}`);
}
