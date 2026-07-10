import type {
  AdminActivityEvent,
  AdminAnalyticsDashboard,
  AdminStorageSnapshot,
} from "@/domain/adminAnalytics";
import { PRO_MONTHLY_SUBSCRIPTION_EUR, SUPABASE_FREE_STORAGE_BYTES } from "@/lib/admin/apiCostEstimates";
import {
  buildMockAdminAnalyticsDashboard,
  buildMockApiUsage,
} from "@/lib/admin/mockAdminAnalytics";
import { createAdminClient } from "@/lib/supabase/admin";

const URGENCY_WORK_TYPE_PATTERN = /urgence whatsapp/i;

function isProPlan(planTier: string | null | undefined): boolean {
  return String(planTier ?? "").toUpperCase() === "PRO";
}

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function mapProfileToActivity(row: {
  id: string;
  full_name: string | null;
  plan_tier: string | null;
  created_at: string | null;
}): AdminActivityEvent {
  const isPro = isProPlan(row.plan_tier);
  return {
    id: `profile-${row.id}`,
    type: isPro ? "upgrade_pro" : "signup",
    title: isPro ? "Compte Pro actif" : "Nouvelle inscription",
    detail: `${row.full_name?.trim() || "Artisan"} — ${isPro ? "Plan Pro" : "Plan Essentiel"}`,
    occurredAt: row.created_at ?? new Date().toISOString(),
  };
}

function mapLeadToActivity(row: {
  id: string;
  client_name: string | null;
  work_type: string | null;
  zone: string | null;
  delay_status: string | null;
  created_at: string | null;
}): AdminActivityEvent {
  const isUrgency =
    URGENCY_WORK_TYPE_PATTERN.test(row.work_type ?? "") || row.delay_status === "urgent";

  return {
    id: `lead-${row.id}`,
    type: isUrgency ? "urgency_lead" : "signup",
    title: isUrgency ? "Lead urgence" : "Nouveau lead",
    detail: `${row.client_name?.trim() || "Visiteur"} — ${row.work_type?.trim() || "Demande"} (${row.zone?.trim() || "—"})`,
    occurredAt: row.created_at ?? new Date().toISOString(),
  };
}

async function tryLoadApiUsageFromDb(
  proCount: number,
): Promise<AdminAnalyticsDashboard["apiUsage"] | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("api_usage_logs")
    .select(
      "provider, model, operation, input_tokens, output_tokens, estimated_cost_usd, success",
    )
    .gte("created_at", monthStart.toISOString());

  if (error || !data?.length) {
    return null;
  }

  const byKey = new Map<
    string,
    {
      provider: string;
      model: string;
      operation: string;
      requestCount: number;
      inputTokens: number;
      outputTokens: number;
      estimatedCostUsd: number;
    }
  >();

  let totalRequests = 0;
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  let totalCostUsd = 0;

  for (const row of data) {
    const key = `${row.provider}:${row.model}:${row.operation}`;
    const bucket = byKey.get(key) ?? {
      provider: String(row.provider),
      model: String(row.model),
      operation: String(row.operation),
      requestCount: 0,
      inputTokens: 0,
      outputTokens: 0,
      estimatedCostUsd: 0,
    };
    bucket.requestCount += 1;
    bucket.inputTokens += Number(row.input_tokens ?? 0);
    bucket.outputTokens += Number(row.output_tokens ?? 0);
    bucket.estimatedCostUsd += Number(row.estimated_cost_usd ?? 0);
    byKey.set(key, bucket);

    totalRequests += 1;
    totalInputTokens += Number(row.input_tokens ?? 0);
    totalOutputTokens += Number(row.output_tokens ?? 0);
    totalCostUsd += Number(row.estimated_cost_usd ?? 0);
  }

  const totalCostEur = totalCostUsd * 0.92;
  const avgApiCostPerProUserEur = proCount > 0 ? totalCostEur / proCount : 0;

  const now = new Date();
  const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return {
    monthLabel,
    totalRequests,
    totalInputTokens,
    totalOutputTokens,
    totalCostUsd,
    totalCostEur,
    proSubscriberCount: proCount,
    avgApiCostPerProUserEur,
    marginPerProUserEur: PRO_MONTHLY_SUBSCRIPTION_EUR - avgApiCostPerProUserEur,
    proSubscriptionEur: PRO_MONTHLY_SUBSCRIPTION_EUR,
    isMock: false,
    byModel: [...byKey.values()],
  };
}

async function tryLoadStorageFromDb(): Promise<AdminStorageSnapshot | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase.rpc("admin_gallery_storage_stats");

  if (error || !data?.length) {
    return null;
  }

  const row = data[0] as { object_count?: number; total_bytes?: number };
  const galleryObjectCount = Number(row.object_count ?? 0);
  const galleryBytes = Number(row.total_bytes ?? 0);
  const usagePercent =
    SUPABASE_FREE_STORAGE_BYTES > 0
      ? Math.round((galleryBytes / SUPABASE_FREE_STORAGE_BYTES) * 1000) / 10
      : 0;

  return {
    galleryObjectCount,
    galleryBytes,
    galleryLimitBytes: SUPABASE_FREE_STORAGE_BYTES,
    usagePercent,
    isMock: false,
  };
}

/** Charge les métriques admin (live Supabase + mock API si table absente). */
export async function loadAdminAnalyticsDashboard(): Promise<AdminAnalyticsDashboard> {
  const supabase = createAdminClient();
  const fallback = buildMockAdminAnalyticsDashboard();

  if (!supabase) {
    return fallback;
  }

  let profilesLive = false;
  let leadsLive = false;

  const sevenDaysAgo = daysAgoIso(7);

  const [profilesRes, profiles7dRes, leadsRes, urgencyRes, recentProfilesRes, recentLeadsRes] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo),
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .or(`work_type.ilike.%urgence whatsapp%,delay_status.eq.urgent`),
      supabase
        .from("profiles")
        .select("id, full_name, plan_tier, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("leads")
        .select("id, client_name, work_type, zone, delay_status, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

  const planRowsRes = await supabase.from("profiles").select("plan_tier");

  if (profilesRes.error || planRowsRes.error) {
    return fallback;
  }

  profilesLive = true;

  const planRows = planRowsRes.data ?? [];
  const activePro = planRows.filter((row) => isProPlan(row.plan_tier)).length;
  const totalArtisans = profilesRes.count ?? planRows.length;
  const activeEssential = Math.max(0, totalArtisans - activePro);
  const artisansDelta7d = profiles7dRes.count ?? 0;

  let totalLeads = fallback.kpis.totalLeads;
  let urgencyLeads = fallback.kpis.urgencyLeads;

  if (!leadsRes.error) {
    leadsLive = true;
    totalLeads = leadsRes.count ?? 0;
    urgencyLeads = urgencyRes.error ? 0 : (urgencyRes.count ?? 0);
  }

  const apiUsage =
    (await tryLoadApiUsageFromDb(activePro)) ?? buildMockApiUsage(activePro);

  const storage =
    (await tryLoadStorageFromDb()) ?? fallback.storage;

  const activity: AdminActivityEvent[] = [
    ...(recentProfilesRes.data ?? []).map(mapProfileToActivity),
    ...(recentLeadsRes.data ?? []).map(mapLeadToActivity),
  ]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 10);

  const recentActivity =
    activity.length > 0 ? activity : fallback.recentActivity;

  return {
    generatedAt: new Date().toISOString(),
    kpis: {
      totalArtisans,
      artisansDelta7d,
      activePro,
      activeEssential,
      conversionRatePercent:
        totalArtisans > 0 ? Math.round((activePro / totalArtisans) * 1000) / 10 : 0,
      mrrEur: activePro * PRO_MONTHLY_SUBSCRIPTION_EUR,
      totalLeads,
      urgencyLeads,
    },
    apiUsage,
    storage,
    recentActivity,
    dataSource: {
      profilesLive,
      leadsLive,
      storageLive: !storage.isMock,
      apiUsageMock: apiUsage.isMock,
    },
  };
}
