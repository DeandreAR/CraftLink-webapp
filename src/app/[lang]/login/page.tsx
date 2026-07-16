import { notFound } from "next/navigation";
import { AuthLoginPage, type AuthLoginView } from "@/components/auth/AuthLoginPage";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { formatConfigDebugMessage, AUTH_SERVICE_UNAVAILABLE } from "@/lib/auth/debugError";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";
import { preparePasswordResetPage } from "@/lib/auth/preparePasswordResetPage";
import { redirectRecoveryExchange } from "@/lib/auth/redirectRecoveryExchange";
import { getSupabaseConfig } from "@/lib/supabase/env";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    error?: string;
    view?: string;
    recovery?: string;
    token_hash?: string;
    code?: string;
  }>;
};

function resolveLoginView(params: {
  view?: string;
  recovery?: string;
}): AuthLoginView {
  if (params.view === "forgot-password") return "forgot-password";
  if (params.recovery === "1") return "recovery";
  return "signin";
}

export default async function LangLoginPage({ params, searchParams }: Props) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const query = await searchParams;
  redirectRecoveryExchange(lang, query);

  const view = resolveLoginView(query);

  if (!getSupabaseConfig()) {
    const dict = await getDictionary(lang);
    return (
      <AuthLoginPage
        lang={lang}
        copy={dict.auth}
        view={view}
        unavailable
        unavailableMessage={formatConfigDebugMessage(
          "supabase.config",
          AUTH_SERVICE_UNAVAILABLE,
          "Configuration Supabase manquante ou placeholder",
        )}
      />
    );
  }

  if (view === "recovery") {
    const prepared = await preparePasswordResetPage(lang);
    const dict = await getDictionary(lang);
    return (
      <AuthLoginPage
        lang={lang}
        copy={dict.auth}
        view="recovery"
        recoverySessionReady={prepared.status === "ready"}
        unavailable={prepared.status === "unavailable"}
        unavailableMessage={
          prepared.status === "unavailable" ? prepared.message : undefined
        }
      />
    );
  }

  const prepared = await prepareAuthPage(lang);
  const dict = await getDictionary(lang);

  return (
    <AuthLoginPage
      lang={lang}
      copy={dict.auth}
      view={view}
      authError={query.error}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
