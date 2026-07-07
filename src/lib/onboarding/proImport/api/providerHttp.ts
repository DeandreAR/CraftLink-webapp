import { ProviderDegradedError, isNetworkFailure } from "@/lib/onboarding/proImport/api/providerErrors";

/** Fetch tiers avec bascule mode dégradé sur panne réseau. */
export async function providerFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    if (isNetworkFailure(error)) {
      throw new ProviderDegradedError(undefined, { cause: error });
    }
    throw error;
  }
}
