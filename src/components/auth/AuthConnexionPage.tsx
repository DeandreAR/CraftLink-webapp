import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";
import { SignInForm } from "@/components/auth/SignInForm";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { AuthDictionary } from "@/i18n/types";

type AuthConnexionPageProps = {
  lang: Locale;
  copy: AuthDictionary;
  unavailable?: boolean;
  unavailableMessage?: string;
  authError?: string | null;
};

export function AuthConnexionPage({
  lang,
  copy,
  unavailable = false,
  unavailableMessage,
  authError,
}: AuthConnexionPageProps) {
  return (
    <AuthPageShell
      lang={lang}
      title={copy.signIn.title}
      subtitle={copy.signIn.subtitle}
      alternateHref={authPath(lang, "signup")}
      alternateLabel={copy.signIn.goToSignUp}
      backToHomeLabel={copy.shell.backToHome}
    >
      {unavailable ? (
        <AuthServiceUnavailable
          message={unavailableMessage ?? copy.serviceUnavailable}
        />
      ) : (
        <SignInForm lang={lang} copy={copy.signIn} authError={authError} />
      )}
    </AuthPageShell>
  );
}
