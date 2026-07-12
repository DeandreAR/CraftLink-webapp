import { NextResponse } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { logAuthError } from "@/lib/auth/debugError";
import { forgotPasswordPath, loginRecoveryPath } from "@/lib/auth/paths";
import { createClient } from "@/lib/supabase/server";

function resolveLocale(raw: string | null): Locale {
  if (raw && isLocale(raw)) return raw;
  return defaultLocale;
}

/** Échange token/code recovery (Route Handler — cookies persistés sur la redirect). */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash")?.trim();
  const code = requestUrl.searchParams.get("code")?.trim();
  const lang = resolveLocale(requestUrl.searchParams.get("locale"));

  if (!tokenHash && !code) {
    const forgot = new URL(forgotPasswordPath(lang), requestUrl.origin);
    forgot.searchParams.set("error", "recovery_missing");
    return NextResponse.redirect(forgot);
  }

  const supabase = await createClient();

  const error = tokenHash
    ? (
        await supabase.auth.verifyOtp({
          type: "recovery",
          token_hash: tokenHash,
        })
      ).error
    : (
        await supabase.auth.exchangeCodeForSession(code!)
      ).error;

  if (error) {
    logAuthError("auth.recovery.exchange", error);
    const forgot = new URL(forgotPasswordPath(lang), requestUrl.origin);
    forgot.searchParams.set("error", "recovery_failed");
    return NextResponse.redirect(forgot);
  }

  return NextResponse.redirect(new URL(loginRecoveryPath(lang), requestUrl.origin));
}
