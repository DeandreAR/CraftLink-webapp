import type { MetierKey } from "@/lib/vitrine/metierConfigs";
import { isMetierKey } from "@/lib/vitrine/metierConfigs";

/**
 * Métiers où le bouton « Signaler une urgence » reste visible sur la vitrine.
 * Dépannage, fuites, pannes, ouvertures de porte, fuites de toiture.
 */
export const METIERS_WITH_URGENCY_CTA: readonly MetierKey[] = [
  "ELECTRICIEN",
  "PLOMBIER",
  "SERRURIER",
  "COUVREUR",
] as const;

const URGENCY_METIER_SET = new Set<MetierKey>(METIERS_WITH_URGENCY_CTA);

/**
 * Détermine si la vitrine publique affiche le CTA urgence (WhatsApp / formulaire urgent).
 *
 * **Avec urgence :** électricien, plombier/chauffagiste, serrurier, couvreur.
 * **Devis / projet uniquement :** menuisier, plaquiste, peintre, paysagiste, carreleur,
 * charpentier, maçon, rénovation générale.
 *
 * Sans métier renseigné → urgence affichée (rétrocompatibilité des pages existantes).
 */
export function metierSupportsUrgencyCta(metierKey?: MetierKey | "" | null): boolean {
  if (!metierKey || !isMetierKey(metierKey)) {
    return true;
  }
  return URGENCY_METIER_SET.has(metierKey);
}
