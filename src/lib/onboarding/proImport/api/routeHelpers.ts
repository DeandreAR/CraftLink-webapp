import { NextResponse } from "next/server";
import {
  PROVIDER_DEGRADED_MESSAGE,
  PROVIDER_QUOTA_EXHAUSTED,
  SERVER_CONFIG_ERROR,
} from "@/lib/onboarding/proImport/api/constants";
import {
  ProviderDegradedError,
  isNetworkFailure,
  throwIfQuotaInProviderError,
} from "@/lib/onboarding/proImport/api/providerErrors";
import type { UnifiedImportData } from "@/lib/onboarding/proImport/api/unifiedImportData";

export { SERVER_CONFIG_ERROR, PROVIDER_QUOTA_EXHAUSTED };

export function serverConfigErrorResponse(): NextResponse {
  return NextResponse.json({ error: SERVER_CONFIG_ERROR }, { status: 500 });
}

export function successImportResponse(data: UnifiedImportData): NextResponse {
  return NextResponse.json({ success: true as const, data });
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
  const message = error instanceof Error ? error.message : "Import impossible.";
  return NextResponse.json({ error: message }, { status: 502 });
}

export async function handleImportPost(
  request: Request,
  apiKey: string | undefined,
  importFn: (identifier: string, key: string) => Promise<UnifiedImportData>,
): Promise<NextResponse> {
  if (!apiKey) {
    return serverConfigErrorResponse();
  }

  const parsed = await parseImportIdentifier(request);
  if (isNextResponse(parsed)) {
    return parsed;
  }

  try {
    const data = await importFn(parsed.identifier, apiKey);
    return successImportResponse(data);
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
      return badRequestResponse("Identifiant invalide.");
    }

    return { identifier };
  } catch {
    return badRequestResponse("Corps de requête invalide.");
  }
}

export function isNextResponse(
  value: { identifier: string } | NextResponse,
): value is NextResponse {
  return value instanceof NextResponse;
}
