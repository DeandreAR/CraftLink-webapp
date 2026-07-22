import { NextResponse } from "next/server";
import type { ProImportPlatform } from "@/domain/onboarding";
import {
  estimateApifyFacebookImportUsd,
  estimateApifyInstagramImportUsd,
  estimateSerpApiGoogleImportUsd,
} from "@/lib/admin/apiCostEstimates";
import { logApiUsage } from "@/lib/admin/logApiUsage";
import {
  IMPORT_INVALID_IDENTIFIER,
  IMPORT_PROVIDER_ERROR,
  PROVIDER_DEGRADED_MESSAGE,
  PROVIDER_QUOTA_EXHAUSTED,
  SERVER_CONFIG_ERROR,
} from "@/lib/onboarding/proImport/api/constants";
import { sanitizeImportErrorForClient } from "@/lib/onboarding/proImport/api/importErrorCodes";
import {
  getImportAuthContext,
} from "@/lib/onboarding/proImport/api/importAuth";
import { isMeaningfulImportResult } from "@/lib/onboarding/proImport/api/isMeaningfulImport";
import {
  AI_GENERATION_QUOTA_EXCEEDED,
  AI_GENERATION_QUOTA_MESSAGE,
  aiGenerationsRemaining,
  canUseAiGeneration,
  getMaxAiGenerations,
  incrementAiGenerationsCount,
  normalizeAiGenerationsCount,
} from "@/lib/ai/aiGenerationQuota";
import {
  ProviderDegradedError,
  isNetworkFailure,
  throwIfQuotaInProviderError,
} from "@/lib/onboarding/proImport/api/providerErrors";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";

export { SERVER_CONFIG_ERROR, PROVIDER_QUOTA_EXHAUSTED };

function importApiUsageMeta(platform: ProImportPlatform): {
  provider: string;
  model: string;
  operation: string;
  estimated_cost_usd: number;
} {
  switch (platform) {
    case "instagram":
      return {
        provider: "apify",
        model: "instagram-import",
        operation: "Import Instagram (posts + abonnés)",
        estimated_cost_usd: estimateApifyInstagramImportUsd(),
      };
    case "facebook":
      return {
        provider: "apify",
        model: "facebook-posts-scraper",
        operation: "Import Facebook (publications)",
        estimated_cost_usd: estimateApifyFacebookImportUsd(),
      };
    case "google":
      return {
        provider: "serpapi",
        model: "google_maps",
        operation: "Import Google (fiche + avis)",
        estimated_cost_usd: estimateSerpApiGoogleImportUsd(),
      };
  }
}

export function serverConfigErrorResponse(): NextResponse {
  return NextResponse.json({ error: SERVER_CONFIG_ERROR }, { status: 500 });
}

export function successImportResponse(
  data: UnifiedImportData,
  meta?: {
    aiGenerationsCount?: number;
    aiGenerationsRemaining?: number | null;
    unlimited?: boolean;
  },
): NextResponse {
  return NextResponse.json({
    success: true as const,
    data,
    aiGenerationsCount: meta?.aiGenerationsCount,
    aiGenerationsRemaining: meta?.aiGenerationsRemaining,
    unlimited: meta?.unlimited,
    magicImportSuccessCount: meta?.aiGenerationsCount,
    magicImportRemaining: meta?.aiGenerationsRemaining,
  });
}

export function providerDegradedResponse(
  message: string = PROVIDER_DEGRADED_MESSAGE,
): NextResponse {
  return NextResponse.json({
    success: false as const,
    error_type: PROVIDER_QUOTA_EXHAUSTED,
    message,
  });
}

export function resolveProviderImportError(error: unknown): NextResponse | null {
  if (error instanceof ProviderDegradedError) {
    return providerDegradedResponse(error.message);
  }
  if (isNetworkFailure(error)) {
    return providerDegradedResponse();
  }
  if (error instanceof Error) {
    try {
      throwIfQuotaInProviderError(error.message);
    } catch (degraded) {
      if (degraded instanceof ProviderDegradedError) {
        return providerDegradedResponse(degraded.message);
      }
    }
  }
  return null;
}

export function providerErrorResponse(error: unknown): NextResponse {
  const raw = error instanceof Error ? error.message : IMPORT_PROVIDER_ERROR;
  return NextResponse.json(
    { error: sanitizeImportErrorForClient(raw) },
    { status: 502 },
  );
}

export async function handleImportPost(
  request: Request,
  platform: ProImportPlatform,
  apiKey: string | undefined,
  importFn: (identifier: string, key: string) => Promise<UnifiedImportData>,
): Promise<NextResponse> {
  if (!apiKey) {
    return serverConfigErrorResponse();
  }

  const auth = await getImportAuthContext();
  if (auth instanceof NextResponse) {
    return auth;
  }

  const used = normalizeAiGenerationsCount(auth.aiGenerationsCount);

  if (!canUseAiGeneration(auth, used)) {
    return NextResponse.json(
      { error: AI_GENERATION_QUOTA_EXCEEDED, message: AI_GENERATION_QUOTA_MESSAGE },
      { status: 403 },
    );
  }

  const parsed = await parseImportIdentifier(request);
  if (isNextResponse(parsed)) {
    return parsed;
  }

  try {
    const data = await importFn(parsed.identifier, apiKey);

    if (!isMeaningfulImportResult(data, platform)) {
      return NextResponse.json({ error: IMPORT_PROVIDER_ERROR }, { status: 502 });
    }

    const max = getMaxAiGenerations(auth);
    const nextCount = await incrementAiGenerationsCount(auth.userId);
    const aiGenerationsCount = nextCount ?? used + 1;

    void logApiUsage({
      ...importApiUsageMeta(platform),
      workspace_id: auth.userId,
    }).catch(() => {});

    return successImportResponse(data, {
      unlimited: false,
      aiGenerationsCount,
      aiGenerationsRemaining: aiGenerationsRemaining(aiGenerationsCount, max),
    });
  } catch (error) {
    const degraded = resolveProviderImportError(error);
    if (degraded) {
      return degraded;
    }
    return providerErrorResponse(error);
  }
}

export function badRequestResponse(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function parseImportIdentifier(
  request: Request,
): Promise<{ identifier: string } | NextResponse> {
  try {
    const body = (await request.json()) as { identifier?: string };
    const identifier =
      typeof body.identifier === "string" ? body.identifier.trim() : "";

    if (identifier.length < 2) {
      return badRequestResponse(IMPORT_INVALID_IDENTIFIER);
    }

    return { identifier };
  } catch {
    return badRequestResponse(IMPORT_INVALID_IDENTIFIER);
  }
}

export function isNextResponse(
  value: { identifier: string } | NextResponse,
): value is NextResponse {
  return value instanceof NextResponse;
}
