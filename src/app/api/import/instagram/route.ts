import { getApifyToken } from "@/lib/env/serverSecrets";
import { mapInstagramResponseToUnified } from "@/lib/onboarding/proImport/api/serverMappers";
import { handleImportPost } from "@/lib/onboarding/proImport/api/routeHelpers";
import { fetchInstagramImportBundle } from "@/lib/onboarding/proImport/providers/apifyInstagram";

export const maxDuration = 120;

export async function POST(request: Request) {
  return handleImportPost(request, "instagram", getApifyToken(), async (identifier, token) => {
    const handle = identifier.trim().replace(/^@/, "");
    const { profile, shortcodes, followerCount } = await fetchInstagramImportBundle(handle, token);
    return mapInstagramResponseToUnified(profile, handle, shortcodes, followerCount);
  });
}
