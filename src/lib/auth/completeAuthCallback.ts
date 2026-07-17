import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { defaultLocale } from "@/i18n/config";
import { accountConfirmedPath, authPath } from "@/lib/auth/paths";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return accountConfirmedPath(defaultLocale);
  }
  return raw;
}

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return (
    value === "signup" ||
    value === "invite" ||
    value === "magiclink" ||
    value === "recovery" ||
    value === "email_change" ||
    value === "email"
  );
}

/**
 * Confirme e-mail / échange session puis redirige.
 * Utilise token_hash (flux CraftLink) ou code PKCE (liens legacy Supabase).
 * Les cookies de session sont posés sur la réponse de redirect (critique en prod).
 */
export async function completeAuthCallback(
  request: NextRequest,
  nextPath?: string,
): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash")?.trim();
  const typeParam = requestUrl.searchParams.get("type");
  const code = requestUrl.searchParams.get("code")?.trim();
  const next = safeNextPath(nextPath ?? requestUrl.searchParams.get("next"));
  const loginUrl = new URL(authPath(defaultLocale, "login"), requestUrl.origin);

  if (!tokenHash && !code) {
    loginUrl.searchParams.set("error", "confirmation_missing");
    return NextResponse.redirect(loginUrl);
  }

  const redirectResponse = NextResponse.redirect(new URL(next, requestUrl.origin));

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          redirectResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  let error: { message: string } | null = null;

  if (tokenHash && isEmailOtpType(typeParam)) {
    const result = await supabase.auth.verifyOtp({
      type: typeParam,
      token_hash: tokenHash,
    });
    error = result.error;
  } else if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else if (tokenHash) {
    // Défaut signup si type omis (liens CraftLink).
    const result = await supabase.auth.verifyOtp({
      type: "signup",
      token_hash: tokenHash,
    });
    error = result.error;
  } else {
    loginUrl.searchParams.set("error", "confirmation_missing");
    return NextResponse.redirect(loginUrl);
  }

  if (error) {
    console.error("[auth.callback]", error.message);
    loginUrl.searchParams.set("error", "confirmation_failed");
    return NextResponse.redirect(loginUrl);
  }

  return redirectResponse;
}
