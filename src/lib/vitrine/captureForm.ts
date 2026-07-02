import type { LeadUrgency, VitrineOpenIntent, VitrineService } from "@/domain/vitrine";
import type { VitrineDictionary } from "@/i18n/types";
import type { MetierFormFields } from "@/lib/vitrine/metierConfigs";

export function shouldShowDelaySelection(
  intent: VitrineOpenIntent,
  metierFields?: MetierFormFields,
): boolean {
  if (intent !== "quote") {
    return false;
  }
  return metierFields?.showUrgency ?? true;
}

export function shouldShowServices(intent: VitrineOpenIntent): boolean {
  return intent !== "urgent";
}

export function areServicesRequired(_intent: VitrineOpenIntent): boolean {
  return false;
}

export function getDefaultDelay(intent: VitrineOpenIntent): LeadUrgency {
  if (intent === "urgent") return "urgent";
  if (intent === "info") return "info";
  return "asap";
}

export function getCaptureFormTitle(
  intent: VitrineOpenIntent,
  copy: VitrineDictionary,
  metierTitle?: string,
): string {
  switch (intent) {
    case "urgent":
      return copy.details.titles.urgent;
    case "info":
      return copy.details.titles.info;
    case "collaboration":
      return copy.details.titles.collaboration;
    case "quote":
    default:
      return metierTitle ?? copy.details.titles.quote;
  }
}

export const DELAY_PILL_ORDER: LeadUrgency[] = [
  "urgent",
  "asap",
  "planned",
  "info",
];

export function buildWorkTypeFromServices(
  services: VitrineService[],
  selectedIds: string[],
  fallback = "Demande client",
): string {
  const titles = selectedIds
    .map((id) => services.find((service) => service.id === id)?.title?.trim())
    .filter((title): title is string => Boolean(title));

  return titles.length > 0 ? titles.join(" · ") : fallback;
}

