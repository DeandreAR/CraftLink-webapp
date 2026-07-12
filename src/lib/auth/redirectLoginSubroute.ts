import { redirect } from "next/navigation";
import { defaultLocale, type Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";

type SearchParams = Record<string, string | string[] | undefined>;

function toQueryString(params: SearchParams, extra?: Record<string, string>): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") qs.set(key, value);
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      qs.set(key, value);
    }
  }
  const serialized = qs.toString();
  return serialized ? `?${serialized}` : "";
}

/** Redirige /login/reset-password → /auth/recovery ou /login?recovery=1 */
export function redirectLoginResetSubroute(lang: Locale, searchParams: SearchParams) {
  const tokenHash = searchParams.token_hash;
  const code = searchParams.code;

  if (typeof tokenHash === "string") {
    const qs = new URLSearchParams({ token_hash: tokenHash });
    if (lang !== defaultLocale) qs.set("locale", lang);
    redirect(`/auth/recovery?${qs.toString()}`);
  }

  if (typeof code === "string") {
    const qs = new URLSearchParams({ code });
    if (lang !== defaultLocale) qs.set("locale", lang);
    redirect(`/auth/recovery?${qs.toString()}`);
  }

  const suffix = toQueryString(searchParams, { recovery: "1" });
  redirect(`${authPath(lang, "login")}${suffix}`);
}

/** Redirige /login/forgot-password → /login?view=forgot-password */
export function redirectLoginForgotSubroute(lang: Locale, searchParams: SearchParams) {
  const suffix = toQueryString(searchParams, { view: "forgot-password" });
  redirect(`${authPath(lang, "login")}${suffix}`);
}
