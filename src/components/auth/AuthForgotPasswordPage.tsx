import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { AuthDictionary } from "@/i18n/types";

type AuthForgotPasswordPageProps = {
  lang: Locale;
  copy: AuthDictionary;
  unavailable?: boolean;
  unavailableMessage?: string;
};

export function AuthForgotPasswordPage({
  lang,
  copy,
  unavailable = false,
  unavailableMessage,
}: AuthForgotPasswordPageProps) {
  return (
    <AuthPageShell
      lang={lang}
      title={copy.forgotPassword.title}
      subtitle={copy.forgotPassword.subtitle}
      alternateHref={authPath(lang, "login")}
      alternateLabel={copy.forgotPassword.backToSignIn}
      backToHomeLabel={copy.shell.backToHome}
    >
      {unavailable ? (
        <AuthServiceUnavailable
          message={unavailableMessage ?? copy.serviceUnavailable}
        />
      ) : (
        <ForgotPasswordForm lang={lang} copy={copy.forgotPassword} />
      )}
    </AuthPageShell>
  );
}
