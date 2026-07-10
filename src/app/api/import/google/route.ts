import { mapGoogleResponseToUnified } from "@/lib/onboarding/proImport/api/serverMappers";
import { handleImportPost } from "@/lib/onboarding/proImport/api/routeHelpers";
import { fetchGoogleFromSerpApi } from "@/lib/onboarding/proImport/providers/serpapiGoogle";

export async function POST(request: Request) {
  return handleImportPost(request, "google", process.env.SERPAPI_KEY?.trim(), async (identifier, apiKey) => {
    const raw = await fetchGoogleFromSerpApi(identifier, apiKey);
    return mapGoogleResponseToUnified(raw, identifier);
  });
}
