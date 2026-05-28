import type { LeadUrgency, VitrineOpenIntent } from "@/domain/vitrine";
import type { VitrineDictionary } from "@/i18n/types";

export function shouldShowDelaySelection(intent: VitrineOpenIntent): boolean {
  return intent === "quote";
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
      return copy.details.titles.quote;
  }
}

export const DELAY_PILL_ORDER: LeadUrgency[] = [
  "urgent",
  "asap",
  "planned",
  "info",
];
