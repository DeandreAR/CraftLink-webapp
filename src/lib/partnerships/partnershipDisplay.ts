import type { DashboardPartnershipRequest, PartnershipWorkflowStatus } from "@/domain/partnershipRequest";
import type { DashboardDictionary } from "@/i18n/types";

export function partnershipStatusBadgeClass(status: PartnershipWorkflowStatus): string {
  switch (status) {
    case "A_TRAITER":
      return "bg-amber-500 text-white";
    case "CONTACTE":
      return "bg-sky-600 text-white";
    case "ARCHIVE":
      return "bg-slate-400 text-white";
    default:
      return "bg-slate-400 text-white";
  }
}

export function formatPartnershipDate(iso: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatPartnershipBudget(
  copy: DashboardDictionary,
  budgetRange: DashboardPartnershipRequest["budgetRange"],
  budgetApproximate: string | null,
): string {
  const parts: string[] = [];
  if (budgetRange) {
    parts.push(copy.partners.budgetRanges[budgetRange]);
  }
  if (budgetApproximate?.trim()) {
    parts.push(budgetApproximate.trim());
  }
  return parts.length > 0 ? parts.join(" · ") : copy.partners.detail.budgetNotProvided;
}
