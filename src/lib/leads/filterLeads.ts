import type { DashboardLead } from "@/domain/lead";

export type LeadCalendarFilter = "all" | "scheduled" | "unscheduled";
export type LeadContactFilter = "all" | "pending" | "contacted";

export type LeadTableFilter = {
  calendar: LeadCalendarFilter;
  contact: LeadContactFilter;
};

export const DEFAULT_LEAD_TABLE_FILTER: LeadTableFilter = {
  calendar: "all",
  contact: "all",
};

export function filterLeads(
  leads: DashboardLead[],
  filter: LeadTableFilter,
): DashboardLead[] {
  return leads.filter((lead) => {
    if (filter.calendar === "scheduled" && !lead.schedule?.date) return false;
    if (filter.calendar === "unscheduled" && lead.schedule?.date) return false;
    if (filter.contact === "pending" && lead.contactStatus !== "pending") return false;
    if (filter.contact === "contacted" && lead.contactStatus !== "contacted") return false;
    return true;
  });
}
