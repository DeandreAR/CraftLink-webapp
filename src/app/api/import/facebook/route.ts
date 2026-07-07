import { mapFacebookResponseToUnified } from "@/lib/onboarding/proImport/api/serverMappers";
import { handleImportPost } from "@/lib/onboarding/proImport/api/routeHelpers";
import { fetchFacebookFromRapidApi } from "@/lib/onboarding/proImport/providers/rapidapiFacebook";

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

export async function POST(request: Request) {
  const apiKey = process.env.RAPIDAPI_KEY?.trim();
  const host = readEnv(
    "RAPIDAPI_FACEBOOK_HOST",
    "facebook-pages-scraper2.p.rapidapi.com",
  );
  const path = readEnv("RAPIDAPI_FACEBOOK_PATH", "/pages");

  return handleImportPost(request, apiKey, async (identifier, key) => {
    const raw = await fetchFacebookFromRapidApi(identifier, key, host, path);
    return mapFacebookResponseToUnified(raw);
  });
}
