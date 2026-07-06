import type {
  AdminActivityEvent,
  AdminAnalyticsDashboard,
  ApiUsageSummary,
} from "@/domain/adminAnalytics";
import {
  estimateChatCostUsd,
  estimateWhisperCostUsd,
  PRO_MONTHLY_SUBSCRIPTION_EUR,
  usdToEur,
} from "@/lib/admin/apiCostEstimates";

function buildMockApiUsage(proSubscriberCount: number): ApiUsageSummary {
  const whisperRequests = 142;
  const gptRequests = 118;
  const gptInputTokens = 186_400;
  const gptOutputTokens = 42_800;

  const whisperUsd = estimateWhisperCostUsd(whisperRequests);
  const gptUsd = estimateChatCostUsd("gpt-4o-mini", gptInputTokens, gptOutputTokens);
  const totalCostUsd = whisperUsd + gptUsd;
  const totalCostEur = usdToEur(totalCostUsd);
  const avgApiCostPerProUserEur =
    proSubscriberCount > 0 ? totalCostEur / proSubscriberCount : 0;
  const marginPerProUserEur = PRO_MONTHLY_SUBSCRIPTION_EUR - avgApiCostPerProUserEur;

  const now = new Date();
  const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return {
    monthLabel,
    totalRequests: whisperRequests + gptRequests,
    totalInputTokens: gptInputTokens,
    totalOutputTokens: gptOutputTokens,
    totalCostUsd,
    totalCostEur,
    proSubscriberCount,
    avgApiCostPerProUserEur,
    marginPerProUserEur,
    proSubscriptionEur: PRO_MONTHLY_SUBSCRIPTION_EUR,
    isMock: true,
    byModel: [
      {
        provider: "OpenAI",
        model: "whisper-1",
        operation: "Transcription audio (leads vocaux)",
        requestCount: whisperRequests,
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostUsd: whisperUsd,
      },
      {
        provider: "OpenAI",
        model: "gpt-4o-mini",
        operation: "Qualification & résumé IA",
        requestCount: gptRequests,
        inputTokens: gptInputTokens,
        outputTokens: gptOutputTokens,
        estimatedCostUsd: gptUsd,
      },
    ],
  };
}

function buildMockActivity(): AdminActivityEvent[] {
  const base = Date.now();

  return [
    {
      id: "evt-01",
      type: "signup",
      title: "Nouvelle inscription",
      detail: "Électricité Martin — Plan Essentiel",
      occurredAt: new Date(base - 12 * 60_000).toISOString(),
    },
    {
      id: "evt-02",
      type: "urgency_lead",
      title: "Urgence WhatsApp",
      detail: "Clic urgence sur vitrine plombier-paris-15",
      occurredAt: new Date(base - 38 * 60_000).toISOString(),
    },
    {
      id: "evt-03",
      type: "upgrade_pro",
      title: "Passage Pro",
      detail: "Menuiserie Dubois — Stripe checkout réussi",
      occurredAt: new Date(base - 2 * 3_600_000).toISOString(),
    },
    {
      id: "evt-04",
      type: "api_failure",
      title: "Échec API OpenAI",
      detail: "whisper-1 — timeout transcription (lead #3847)",
      occurredAt: new Date(base - 4 * 3_600_000).toISOString(),
    },
    {
      id: "evt-05",
      type: "signup",
      title: "Nouvelle inscription",
      detail: "Chauffage Lefèvre — onboarding complété",
      occurredAt: new Date(base - 6 * 3_600_000).toISOString(),
    },
    {
      id: "evt-06",
      type: "urgency_lead",
      title: "Lead formulaire urgent",
      detail: "Fuite sous évier — Massy (92100)",
      occurredAt: new Date(base - 9 * 3_600_000).toISOString(),
    },
    {
      id: "evt-07",
      type: "upgrade_pro",
      title: "Passage Pro",
      detail: "Peinture Rousseau — offre Bêta mensuelle",
      occurredAt: new Date(base - 14 * 3_600_000).toISOString(),
    },
    {
      id: "evt-08",
      type: "signup",
      title: "Nouvelle inscription",
      detail: "Serrurerie Benali — import Instagram",
      occurredAt: new Date(base - 20 * 3_600_000).toISOString(),
    },
    {
      id: "evt-09",
      type: "api_failure",
      title: "Échec API RocketAPI",
      detail: "Import Instagram — profil introuvable (@atelier_demo)",
      occurredAt: new Date(base - 28 * 3_600_000).toISOString(),
    },
    {
      id: "evt-10",
      type: "signup",
      title: "Nouvelle inscription",
      detail: "Couverture Garnier — Plan Essentiel",
      occurredAt: new Date(base - 36 * 3_600_000).toISOString(),
    },
  ];
}

/** Données fictives isolées — remplacées par Supabase quand les KPIs live échouent. */
export function buildMockAdminAnalyticsDashboard(): AdminAnalyticsDashboard {
  const activePro = 23;
  const activeEssential = 87;
  const totalArtisans = activePro + activeEssential;

  return {
    generatedAt: new Date().toISOString(),
    kpis: {
      totalArtisans,
      artisansDelta7d: 9,
      activePro,
      activeEssential,
      conversionRatePercent: totalArtisans > 0 ? (activePro / totalArtisans) * 100 : 0,
      mrrEur: activePro * PRO_MONTHLY_SUBSCRIPTION_EUR,
      totalLeads: 1_284,
      urgencyLeads: 96,
    },
    apiUsage: buildMockApiUsage(activePro),
    recentActivity: buildMockActivity(),
    dataSource: {
      profilesLive: false,
      leadsLive: false,
      apiUsageMock: true,
    },
  };
}

export { buildMockApiUsage };
