import { AuthLoginPage, type AuthLoginView } from "@/components/auth/AuthLoginPage";
import { defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import { formatConfigDebugMessage, AUTH_SERVICE_UNAVAILABLE } from "@/lib/auth/debugError";
import { prepareAuthPage } from "@/lib/auth/prepareAuthPage";
import { preparePasswordResetPage } from "@/lib/auth/preparePasswordResetPage";
import { redirectRecoveryExchange } from "@/lib/auth/redirectRecoveryExchange";
import { getSupabaseConfig } from "@/lib/supabase/env";

type Props = {
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

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  redirectRecoveryExchange(defaultLocale, params);

  const view = resolveLoginView(params);

  if (!getSupabaseConfig()) {
    const dict = await getDictionary(defaultLocale);
    return (
      <AuthLoginPage
        lang={defaultLocale}
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
    const prepared = await preparePasswordResetPage(defaultLocale);
    const dict = await getDictionary(defaultLocale);
    return (
      <AuthLoginPage
        lang={defaultLocale}
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

  const prepared = await prepareAuthPage(defaultLocale);
  const dict = await getDictionary(defaultLocale);

  return (
    <AuthLoginPage
      lang={defaultLocale}
      copy={dict.auth}
      view={view}
      authError={params.error}
      unavailable={prepared.status === "unavailable"}
      unavailableMessage={
        prepared.status === "unavailable" ? prepared.message : undefined
      }
    />
  );
}
