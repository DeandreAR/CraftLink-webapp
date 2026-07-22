import type {
  AdminActivityEvent,
  AdminAnalyticsDashboard,
  AdminStorageSnapshot,
  AdminTrialFunnelSnapshot,
} from "@/domain/adminAnalytics";
import { isTrialActive } from "@/domain/proAccess";
import { PRO_MONTHLY_SUBSCRIPTION_EUR, SUPABASE_FREE_STORAGE_BYTES } from "@/lib/admin/apiCostEstimates";
import {
  buildMockAdminAnalyticsDashboard,
  buildMockApiUsage,
} from "@/lib/admin/mockAdminAnalytics";
import { createAdminClient } from "@/lib/supabase/admin";

const URGENCY_WORK_TYPE_PATTERN = /urgence whatsapp/i;
const TRIAL_EXPIRING_SOON_MS = 48 * 60 * 60 * 1000;

type ProfilePlanRow = {
  id: string;
  created_at: string | null;
  is_subscribed: boolean | null;
  trial_ends_at: string | null;
  trial_email_mid_sent_at: string | null;
  trial_email_warning_sent_at: string | null;
  trial_email_expired_sent_at: string | null;
  stripe_subscription_id: string | null;
};

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function roundPercent(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function computePlanMetrics(rows: ProfilePlanRow[], now: Date = new Date()) {
  let subscribedPro = 0;
  let activeTrials = 0;
  let expiredTrials = 0;
  let trialsStarted = 0;
  let trialsStarted7d = 0;
  let trialsStarted30d = 0;
  let trialsExpiringSoon = 0;
  let emailsMidSent = 0;
  let emailsWarningSent = 0;
  let emailsExpiredSent = 0;

  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const expiringCutoff = now.getTime() + TRIAL_EXPIRING_SOON_MS;

  for (const row of rows) {
    const subscribed = row.is_subscribed === true;
    const hasTrial = Boolean(row.trial_ends_at);
    const trialActive = !subscribed && isTrialActive(row.trial_ends_at, now);
    const trialExpired =
      !subscribed && hasTrial && !isTrialActive(row.trial_ends_at, now);

    if (subscribed) subscribedPro += 1;
    if (trialActive) activeTrials += 1;
    if (trialExpired) expiredTrials += 1;

    if (hasTrial) {
      trialsStarted += 1;
      const createdAtMs = row.created_at ? new Date(row.created_at).getTime() : NaN;
      if (!Number.isNaN(createdAtMs)) {
        if (createdAtMs >= sevenDaysAgo) trialsStarted7d += 1;
        if (createdAtMs >= thirtyDaysAgo) trialsStarted30d += 1;
      }
    }

    if (trialActive && row.trial_ends_at) {
      const endsAtMs = new Date(row.trial_ends_at).getTime();
      if (!Number.isNaN(endsAtMs) && endsAtMs <= expiringCutoff) {
        trialsExpiringSoon += 1;
      }
    }

    if (row.trial_email_mid_sent_at) emailsMidSent += 1;
    if (row.trial_email_warning_sent_at) emailsWarningSent += 1;
    if (row.trial_email_expired_sent_at) emailsExpiredSent += 1;
  }

  const totalArtisans = rows.length;
  const activeEssential = Math.max(0, totalArtisans - subscribedPro - activeTrials);
  const completedTrials = subscribedPro + expiredTrials;

  return {
    subscribedPro,
    activeTrials,
    expiredTrials,
    activeEssential,
    trialsStarted,
    trialsStarted7d,
    trialsStarted30d,
    trialsExpiringSoon,
    emailsMidSent,
    emailsWarningSent,
    emailsExpiredSent,
    conversionRatePercent: roundPercent(subscribedPro, totalArtisans),
    trialConversionRatePercent: roundPercent(subscribedPro, completedTrials),
  };
}

function buildTrialFunnel(
  metrics: ReturnType<typeof computePlanMetrics>,
): AdminTrialFunnelSnapshot {
  return {
    trialsStarted: metrics.trialsStarted,
    trialsStarted7d: metrics.trialsStarted7d,
    trialsStarted30d: metrics.trialsStarted30d,
    activeTrials: metrics.activeTrials,
    trialsExpiringSoon: metrics.trialsExpiringSoon,
    expiredTrials: metrics.expiredTrials,
    convertedToPro: metrics.subscribedPro,
    trialConversionRatePercent: metrics.trialConversionRatePercent,
    emailsMidSent: metrics.emailsMidSent,
    emailsWarningSent: metrics.emailsWarningSent,
    emailsExpiredSent: metrics.emailsExpiredSent,
  };
}

function mapProfileToActivity(row: {
  id: string;
  full_name: string | null;
  is_subscribed: boolean | null;
  trial_ends_at: string | null;
  created_at: string | null;
}): AdminActivityEvent {
  const subscribed = row.is_subscribed === true;
  const trialActive = !subscribed && isTrialActive(row.trial_ends_at);
  const name = row.full_name?.trim() || "Artisan";

  if (subscribed) {
    return {
      id: `profile-${row.id}`,
      type: "upgrade_pro",
      title: "Abonnement Pro actif",
      detail: `${name} — Abonné Stripe`,
      occurredAt: row.created_at ?? new Date().toISOString(),
    };
  }

  if (trialActive) {
    return {
      id: `profile-${row.id}`,
      type: "trial_active",
      title: "Essai Pro en cours",
      detail: `${name} — Essai 14 jours`,
      occurredAt: row.created_at ?? new Date().toISOString(),
    };
  }

  return {
    id: `profile-${row.id}`,
    type: "signup",
    title: "Nouvelle inscription",
    detail: `${name} — Plan Essentiel`,
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

  const [profilesRes, profiles7dRes, leadsRes, urgencyRes, recentProfilesRes, recentLeadsRes, planRowsRes] =
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
        .select("id, full_name, is_subscribed, trial_ends_at, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("leads")
        .select("id, client_name, work_type, zone, delay_status, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("profiles")
        .select(
          "id, created_at, is_subscribed, trial_ends_at, trial_email_mid_sent_at, trial_email_warning_sent_at, trial_email_expired_sent_at, stripe_subscription_id",
        ),
    ]);

  if (profilesRes.error || planRowsRes.error) {
    return fallback;
  }

  profilesLive = true;

  const planRows = (planRowsRes.data ?? []) as ProfilePlanRow[];
  const metrics = computePlanMetrics(planRows);
  const totalArtisans = profilesRes.count ?? planRows.length;
  const artisansDelta7d = profiles7dRes.count ?? 0;
  const trialFunnel = buildTrialFunnel(metrics);

  let totalLeads = fallback.kpis.totalLeads;
  let urgencyLeads = fallback.kpis.urgencyLeads;

  if (!leadsRes.error) {
    leadsLive = true;
    totalLeads = leadsRes.count ?? 0;
    urgencyLeads = urgencyRes.error ? 0 : (urgencyRes.count ?? 0);
  }

  const apiUsage =
    (await tryLoadApiUsageFromDb(metrics.subscribedPro)) ??
    buildMockApiUsage(metrics.subscribedPro);

  const storage = (await tryLoadStorageFromDb()) ?? fallback.storage;

  const activity: AdminActivityEvent[] = [
    ...(recentProfilesRes.data ?? []).map(mapProfileToActivity),
    ...(recentLeadsRes.data ?? []).map(mapLeadToActivity),
  ]
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 10);

  const recentActivity = activity.length > 0 ? activity : fallback.recentActivity;

  return {
    generatedAt: new Date().toISOString(),
    kpis: {
      totalArtisans,
      artisansDelta7d,
      subscribedPro: metrics.subscribedPro,
      activeTrials: metrics.activeTrials,
      activeEssential: metrics.activeEssential,
      conversionRatePercent: metrics.conversionRatePercent,
      trialConversionRatePercent: metrics.trialConversionRatePercent,
      mrrEur: metrics.subscribedPro * PRO_MONTHLY_SUBSCRIPTION_EUR,
      totalLeads,
      urgencyLeads,
    },
    trialFunnel,
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
