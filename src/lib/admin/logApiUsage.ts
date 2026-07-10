import { createAdminClient } from "@/lib/supabase/admin";

export type ApiUsageLogEntry = {
  provider: string;
  model: string;
  operation: string;
  estimated_cost_usd: number;
  workspace_id?: string | null;
  success?: boolean;
  error_message?: string | null;
  input_tokens?: number;
  output_tokens?: number;
};

/** Journalise une consommation API (fire-and-forget, ne bloque pas la requête métier). */
export async function logApiUsage(entry: ApiUsageLogEntry): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  await supabase.from("api_usage_logs").insert({
    provider: entry.provider,
    model: entry.model,
    operation: entry.operation,
    estimated_cost_usd: entry.estimated_cost_usd,
    workspace_id: entry.workspace_id ?? null,
    success: entry.success ?? true,
    error_message: entry.error_message ?? null,
    input_tokens: entry.input_tokens ?? 0,
    output_tokens: entry.output_tokens ?? 0,
  });
}
