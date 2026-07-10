import { APIFY_AUTH_ERROR, IMPORT_PROVIDER_ERROR } from "@/lib/onboarding/proImport/api/constants";
import { providerFetch } from "@/lib/onboarding/proImport/api/providerHttp";
import { throwIfQuotaHttpStatus } from "@/lib/onboarding/proImport/api/providerErrors";

const APIFY_BASE = "https://api.apify.com/v2";
const APIFY_SYNC_TIMEOUT_MS = 120_000;

export function resolveApifyActorPath(actorId: string): string {
  return actorId.includes("~") ? actorId : actorId.replace("/", "~");
}

export async function runApifyActorSyncGetDatasetItems<T>(
  actorId: string,
  input: Record<string, unknown>,
  token: string,
): Promise<T[]> {
  const actorPath = resolveApifyActorPath(actorId);
  const url = `${APIFY_BASE}/acts/${actorPath}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;

  const response = await providerFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
    cache: "no-store",
    signal: AbortSignal.timeout(APIFY_SYNC_TIMEOUT_MS),
  });

  const text = await response.text();

  if (!response.ok) {
    throwIfQuotaHttpStatus(response.status, text);
    if (response.status === 401 || response.status === 403) {
      throw new Error(APIFY_AUTH_ERROR);
    }
    throw new Error(IMPORT_PROVIDER_ERROR);
  }

  if (!text.trim()) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(IMPORT_PROVIDER_ERROR);
  }

  return Array.isArray(parsed) ? (parsed as T[]) : [];
}
