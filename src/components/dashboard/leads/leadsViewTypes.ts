import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

export type LeadsViewHandlers = {
  isLocked: (lead: DashboardLead) => boolean;
  onOpenDetail: (leadId: string) => void;
  onDelayStatusChange: (leadId: string, status: LeadDelayStatus) => void;
  onMarkDone: (leadId: string) => void;
  onMarkArchived: (leadId: string) => void;
  onReactivate: (leadId: string) => void;
};

export type LeadsViewBaseProps = LeadsViewHandlers & {
  leads: DashboardLead[];
  copy: DashboardDictionary;
  locale: Locale;
  artisanName?: string;
  lockedCtaHref: string;
};
