import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import type { DashboardLead } from "@/domain/lead";
import { checkFileExpiration } from "@/lib/leads/checkFileExpiration";

export type LeadWithMediaRetention = {
  lead: DashboardLead;
  mediaExpired: boolean;
};

/** Retire audio / photos si la rétention plan est dépassée. */
export function applyMediaRetention(
  lead: DashboardLead,
  ownerPlan: CraftlinkPlan,
  now: Date = new Date(),
): LeadWithMediaRetention {
  const expired = checkFileExpiration(new Date(lead.createdAt), ownerPlan, now);
  if (!expired) {
    return { lead, mediaExpired: false };
  }

  return {
    mediaExpired: true,
    lead: {
      ...lead,
      voice: null,
      photos: [],
      attachments: [],
    },
  };
}
