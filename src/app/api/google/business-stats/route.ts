import { NextResponse } from "next/server";
import { estimateSerpApiGoogleImportUsd } from "@/lib/admin/apiCostEstimates";
import { logApiUsage } from "@/lib/admin/logApiUsage";
import { mapGoogleResponseToUnified } from "@/lib/onboarding/proImport/api/serverMappers";
import {
  badRequestResponse,
  providerErrorResponse,
  resolveProviderImportError,
  serverConfigErrorResponse,
} from "@/lib/onboarding/proImport/api/routeHelpers";
import { getImportAuthContext } from "@/lib/onboarding/proImport/api/importAuth";
import { IMPORT_INVALID_IDENTIFIER } from "@/lib/onboarding/proImport/api/constants";
import { fetchGoogleFromSerpApi } from "@/lib/onboarding/proImport/providers/serpapiGoogle";

/** Récupère note + avis Google à partir d’un lien GMB (hors quota import magique). */
export async function POST(request: Request) {
  const apiKey = process.env.SERPAPI_KEY?.trim();
  if (!apiKey) {
    return serverConfigErrorResponse();
  }

  const auth = await getImportAuthContext();
  if (auth instanceof NextResponse) {
    return auth;
  }

  let identifier = "";
  let fallbackQuery = "";
  try {
    const body = (await request.json()) as {
      identifier?: string;
      fallbackQuery?: string;
    };
    identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    fallbackQuery = typeof body.fallbackQuery === "string" ? body.fallbackQuery.trim() : "";
  } catch {
    return badRequestResponse(IMPORT_INVALID_IDENTIFIER);
  }

  if (identifier.length < 2) {
    return badRequestResponse(IMPORT_INVALID_IDENTIFIER);
  }

  try {
    const raw = await fetchGoogleFromSerpApi(identifier, apiKey, { fallbackQuery });
    const data = mapGoogleResponseToUnified(raw, identifier);

    void logApiUsage({
      provider: "serpapi",
      model: "google_maps",
      operation: "Enrichissement fiche Google (avis + note)",
      estimated_cost_usd: estimateSerpApiGoogleImportUsd(),
      workspace_id: auth.userId,
    }).catch(() => {});

    return NextResponse.json({
      rating: data.rating,
      reviews: data.reviews,
      googleBusinessUrl: data.googleBusinessUrl,
    });
  } catch (error) {
    const degraded = resolveProviderImportError(error);
    if (degraded) {
      return degraded;
    }
    return providerErrorResponse(error);
  }
}
