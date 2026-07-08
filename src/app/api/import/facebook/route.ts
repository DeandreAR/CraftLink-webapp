import { mapFacebookResponseToUnified } from "@/lib/onboarding/proImport/api/serverMappers";
import { handleImportPost } from "@/lib/onboarding/proImport/api/routeHelpers";
import { fetchFacebookFromApify } from "@/lib/onboarding/proImport/providers/apifyFacebook";

export const maxDuration = 120;

export async function POST(request: Request) {
  return handleImportPost(request, "facebook", process.env.APIFY_TOKEN?.trim(), async (identifier, token) => {
    const raw = await fetchFacebookFromApify(identifier, token);
    return mapFacebookResponseToUnified(raw);
  });
}
