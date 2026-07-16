import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { metierSupportsUrgencyCta } from "@/lib/vitrine/metierUrgencySupport";

/** Affiche le CTA urgence : activé explicitement, ou par défaut pour les métiers éligibles. */
export function resolveShowUrgentButton(
  metierKey?: MetierKey | "" | null,
  urgencyCtaEnabled?: boolean,
): boolean {
  if (urgencyCtaEnabled === true) return true;
  if (urgencyCtaEnabled === false) return false;
  return metierSupportsUrgencyCta(metierKey);
}
