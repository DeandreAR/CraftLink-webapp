/** Journal futur `api_usage_logs` — structure cible Supabase. */
export type ApiUsageLogRow = {
  id: string;
  created_at: string;
  provider: "openai" | "anthropic" | "rocketapi" | string;
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
  activePro: number;
  activeEssential: number;
  conversionRatePercent: number;
  mrrEur: number;
  totalLeads: number;
  urgencyLeads: number;
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

export type AdminAnalyticsDataSource = {
  profilesLive: boolean;
  leadsLive: boolean;
  apiUsageMock: boolean;
};

export type AdminAnalyticsDashboard = {
  generatedAt: string;
  kpis: AdminKpiSnapshot;
  apiUsage: ApiUsageSummary;
  recentActivity: AdminActivityEvent[];
  dataSource: AdminAnalyticsDataSource;
};
