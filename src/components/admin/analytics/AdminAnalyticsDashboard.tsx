import type { AdminAnalyticsDashboard } from "@/domain/adminAnalytics";
import { AdminApiUsageSection } from "@/components/admin/analytics/AdminApiUsageSection";
import { AdminKpiGrid } from "@/components/admin/analytics/AdminKpiGrid";
import { AdminRecentActivityTable } from "@/components/admin/analytics/AdminRecentActivityTable";
import { AdminSection, AdminShell } from "@/components/admin/analytics/AdminShell";
import { AdminStorageSection } from "@/components/admin/analytics/AdminStorageSection";

type AdminAnalyticsDashboardProps = {
  data: AdminAnalyticsDashboard;
  adminEmail: string;
};

function buildDataSourceLabel(data: AdminAnalyticsDashboard): string {
  const parts: string[] = [];
  if (data.dataSource.profilesLive) parts.push("profiles live");
  if (data.dataSource.leadsLive) parts.push("leads live");
  if (data.dataSource.storageLive) parts.push("stockage live");
  if (data.dataSource.apiUsageMock) parts.push("API mock");
  else parts.push("API live");
  return parts.join(" · ");
}

export function AdminAnalyticsDashboardView({
  data,
  adminEmail,
}: AdminAnalyticsDashboardProps) {
  return (
    <AdminShell
      adminEmail={adminEmail}
      generatedAt={data.generatedAt}
      dataSourceLabel={buildDataSourceLabel(data)}
    >
      <AdminSection title="Vue d'ensemble" description="KPIs globaux CraftLink.">
        <AdminKpiGrid kpis={data.kpis} />
      </AdminSection>

      <AdminStorageSection storage={data.storage} />

      <AdminApiUsageSection apiUsage={data.apiUsage} />

      <AdminRecentActivityTable events={data.recentActivity} />
    </AdminShell>
  );
}
