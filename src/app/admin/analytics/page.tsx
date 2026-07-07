import { AdminAnalyticsDashboardView } from "@/components/admin/analytics/AdminAnalyticsDashboard";
import { loadAdminAnalyticsDashboard } from "@/lib/admin/loadAdminAnalytics";
import { requirePlatformAdmin } from "@/lib/auth/requirePlatformAdmin";

export const metadata = {
  title: "Admin Analytics — CraftLink",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const { email } = await requirePlatformAdmin();
  const data = await loadAdminAnalyticsDashboard();

  return <AdminAnalyticsDashboardView data={data} adminEmail={email} />;
}
