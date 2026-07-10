import type { DashboardLead } from "@/domain/lead";
import type { LeadDelayStatus, LeadSchedule, LeadWorkflowStatus } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { LeadWhatsAppLinks } from "@/lib/leads/buildLeadWhatsAppLink";

export type LeadsViewHandlers = {
  onOpenDetail: (leadId: string) => void;
  onDelayStatusChange: (leadId: string, status: LeadDelayStatus) => void;
  onWorkflowStatusChange: (leadId: string, status: LeadWorkflowStatus) => void;
  onScheduleChange: (leadId: string, schedule: LeadSchedule | null) => void;
  onWhatsAppContact: (leadId: string, links: LeadWhatsAppLinks) => void;
};

export type LeadsViewBaseProps = LeadsViewHandlers & {
  leads: DashboardLead[];
  copy: DashboardDictionary;
  locale: Locale;
  businessName?: string;
};
