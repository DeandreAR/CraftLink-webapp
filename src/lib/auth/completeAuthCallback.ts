import { NextResponse } from "next/server";
import { defaultLocale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(raw: string): string {
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return authPath(defaultLocale, "onboarding");
  }
  return raw;
}

/** Échange le code PKCE Supabase puis redirige vers la page cible. */
export async function completeAuthCallback(
  request: Request,
  nextPath: string,
): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(nextPath);
  const loginUrl = new URL(authPath(defaultLocale, "login"), requestUrl.origin);

  if (!code) {
    loginUrl.searchParams.set("error", "confirmation_missing");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    loginUrl.searchParams.set("error", "confirmation_failed");
    return NextResponse.redirect(loginUrl);
  }

  const destination = new URL(next, requestUrl.origin);
  if (!next.includes("reset-password")) {
    destination.searchParams.set("confirmed", "1");
  }
  return NextResponse.redirect(destination);
}
