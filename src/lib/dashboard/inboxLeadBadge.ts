import type { DashboardLead } from "@/domain/lead";

export type InboxBadgeKind = "new" | "followUp" | "active" | "done";

export function getInboxBadgeKind(lead: DashboardLead): InboxBadgeKind {
  if (lead.workflowStatus === "A_TRAITER") return "new";
  if (
    lead.workflowStatus === "GAGNE_EN_COURS" ||
    lead.workflowStatus === "DEVIS_SIGNE"
  ) {
    return "active";
  }
  if (lead.workflowStatus === "ARCHIVE") return "done";
  return "followUp";
}

export const INBOX_BADGE_CLASSES: Record<InboxBadgeKind, string> = {
  new: "bg-[#EFA188] text-[#212129]",
  followUp: "bg-amber-100 text-amber-950 ring-1 ring-amber-200",
  active: "bg-[#B2F5EA]/70 text-emerald-900 ring-1 ring-[#B2F5EA]",
  done: "bg-neutral-100 text-neutral-600",
};
