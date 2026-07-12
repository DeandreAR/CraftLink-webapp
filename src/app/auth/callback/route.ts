import { defaultLocale } from "@/i18n/config";
import { completeAuthCallback } from "@/lib/auth/completeAuthCallback";
import { authPath } from "@/lib/auth/paths";

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return authPath(defaultLocale, "onboarding");
  }
  return raw;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  return completeAuthCallback(request, safeNextPath(requestUrl.searchParams.get("next")));
}
