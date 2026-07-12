import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { AuthDictionary } from "@/i18n/types";

type AuthResetPasswordPageProps = {
  lang: Locale;
  copy: AuthDictionary;
  sessionReady: boolean;
  unavailable?: boolean;
  unavailableMessage?: string;
};

export function AuthResetPasswordPage({
  lang,
  copy,
  sessionReady,
  unavailable = false,
  unavailableMessage,
}: AuthResetPasswordPageProps) {
  return (
    <AuthPageShell
      lang={lang}
      title={copy.resetPassword.title}
      subtitle={copy.resetPassword.subtitle}
      alternateHref={authPath(lang, "login")}
      alternateLabel={copy.resetPassword.backToSignIn}
      backToHomeLabel={copy.shell.backToHome}
    >
      {unavailable ? (
        <AuthServiceUnavailable
          message={unavailableMessage ?? copy.serviceUnavailable}
        />
      ) : (
        <ResetPasswordForm lang={lang} copy={copy.resetPassword} sessionReady={sessionReady} />
      )}
    </AuthPageShell>
  );
}
