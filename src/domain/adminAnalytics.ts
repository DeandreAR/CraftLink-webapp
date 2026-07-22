/** Journal futur `api_usage_logs` — structure cible Supabase. */
export type ApiUsageLogRow = {
  id: string;
  created_at: string;
  provider: "openai" | "apify" | "serpapi" | string;
  model: string;
  operation: "whisper_transcribe" | "chat_completion" | "import_scrape" | string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost_usd: number;
  workspace_id: string | null;
  success: boolean;
  error_message: string | null;
};

export type AdminKpiSnapshot = {
  totalArtisans: number;
  artisansDelta7d: number;
  /** Abonnements Stripe actifs (`is_subscribed`). */
  subscribedPro: number;
  /** Essais 14j encore valides (non abonnés). */
  activeTrials: number;
  /** Ni abonné ni essai actif. */
  activeEssential: number;
  /** Inscriptions → abonnés payants. */
  conversionRatePercent: number;
  /** Essais terminés (convertis ou expirés) → abonnés. */
  trialConversionRatePercent: number;
  mrrEur: number;
  totalLeads: number;
  urgencyLeads: number;
};

/** Funnel essai Pro 14 jours → abonnement. */
export type AdminTrialFunnelSnapshot = {
  trialsStarted: number;
  trialsStarted7d: number;
  trialsStarted30d: number;
  activeTrials: number;
  trialsExpiringSoon: number;
  expiredTrials: number;
  convertedToPro: number;
  trialConversionRatePercent: number;
  emailsMidSent: number;
  emailsWarningSent: number;
  emailsExpiredSent: number;
};

export type ApiModelUsageRow = {
  provider: string;
  model: string;
  operation: string;
  requestCount: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
};

export type ApiUsageSummary = {
  monthLabel: string;
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  totalCostEur: number;
  proSubscriberCount: number;
  avgApiCostPerProUserEur: number;
  marginPerProUserEur: number;
  proSubscriptionEur: number;
  byModel: ApiModelUsageRow[];
  /** true tant que `api_usage_logs` n'est pas branchée. */
  isMock: boolean;
};

export type AdminActivityEventType =
  | "signup"
  | "trial_active"
  | "upgrade_pro"
  | "urgency_lead"
  | "api_failure";

export type AdminActivityEvent = {
  id: string;
  type: AdminActivityEventType;
  title: string;
  detail: string;
  occurredAt: string;
};

export type AdminStorageSnapshot = {
  galleryObjectCount: number;
  galleryBytes: number;
  galleryLimitBytes: number;
  usagePercent: number;
  isMock: boolean;
};

export type AdminAnalyticsDataSource = {
  profilesLive: boolean;
  leadsLive: boolean;
  storageLive: boolean;
  apiUsageMock: boolean;
};

export type AdminAnalyticsDashboard = {
  generatedAt: string;
  kpis: AdminKpiSnapshot;
  trialFunnel: AdminTrialFunnelSnapshot;
  storage: AdminStorageSnapshot;
  apiUsage: ApiUsageSummary;
  recentActivity: AdminActivityEvent[];
  dataSource: AdminAnalyticsDataSource;
};
