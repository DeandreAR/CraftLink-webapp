import { mapInstagramResponseToUnified } from "@/lib/onboarding/proImport/api/serverMappers";
import { handleImportPost } from "@/lib/onboarding/proImport/api/routeHelpers";
import { fetchInstagramImportBundle } from "@/lib/onboarding/proImport/providers/rocketapiInstagram";

export async function POST(request: Request) {
  return handleImportPost(request, process.env.ROCKETAPI_KEY?.trim(), async (identifier, apiKey) => {
    const handle = identifier.trim().replace(/^@/, "");
    const { profile, shortcodes } = await fetchInstagramImportBundle(handle, apiKey);
    return mapInstagramResponseToUnified(profile, handle, shortcodes);
  });
}
