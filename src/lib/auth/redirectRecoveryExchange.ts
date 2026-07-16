import { redirect } from "next/navigation";
import { defaultLocale, type Locale } from "@/i18n/config";

type RecoveryExchangeParams = {
  token_hash?: string;
  code?: string;
};

/** Redirige vers le Route Handler qui pose la session recovery. */
export function redirectRecoveryExchange(lang: Locale, params: RecoveryExchangeParams): void {
  const tokenHash = params.token_hash?.trim();
  const code = params.code?.trim();

  if (tokenHash) {
    const qs = new URLSearchParams({ token_hash: tokenHash });
    if (lang !== defaultLocale) qs.set("locale", lang);
    redirect(`/auth/recovery?${qs.toString()}`);
  }

  if (code) {
    const qs = new URLSearchParams({ code });
    if (lang !== defaultLocale) qs.set("locale", lang);
    redirect(`/auth/recovery?${qs.toString()}`);
  }
}
