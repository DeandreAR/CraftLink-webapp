import type { OnboardingTourStep } from "@/hooks/useOnboardingTour";

/** Ancres de tour réservées au plan Pro. */
const PRO_ONLY_TOUR_ELEMENTS = new Set([
  "dashboard-section-calendar",
  "dashboard-section-stats",
  "dashboard-pipeline",
  "partenariats-selection",
  "partenariats-toggle",
]);

export type TourStepCopy = {
  element: string;
  title: string;
  description: string;
  /** Variante Essentiel si le texte Pro mentionne des features payantes. */
  descriptionEssential?: string;
  /** Si true, étape masquée pour l’offre Essentiel. */
  proOnly?: boolean;
};

export function resolveTourSteps(
  steps: TourStepCopy[],
  isPro: boolean,
): OnboardingTourStep[] {
  return steps
    .filter((step) => {
      if (step.proOnly) return isPro;
      if (PRO_ONLY_TOUR_ELEMENTS.has(step.element)) return isPro;
      return true;
    })
    .map((step) => ({
      element: step.element,
      title: step.title,
      description:
        !isPro && step.descriptionEssential
          ? step.descriptionEssential
          : step.description,
    }));
}
