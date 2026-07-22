import type { DashboardTab } from "@/components/dashboard/DashboardLayout";

export function parseDashboardTab(raw: string | null | undefined): DashboardTab {
  if (raw === "organize" || raw === "profile" || raw === "partners" || raw === "inbox") {
    return raw;
  }
  return "inbox";
}

export function parseDashboardLeadId(raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  return value;
}
