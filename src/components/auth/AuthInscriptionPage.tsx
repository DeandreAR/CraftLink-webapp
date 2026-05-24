import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";
import { SignUpForm } from "@/components/auth/SignUpForm";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { AuthDictionary } from "@/i18n/types";

type AuthInscriptionPageProps = {
  lang: Locale;
  copy: AuthDictionary;
  unavailable?: boolean;
};

export function AuthInscriptionPage({
  lang,
  copy,
  unavailable = false,
}: AuthInscriptionPageProps) {
  return (
    <AuthPageShell
      lang={lang}
      title={copy.signUp.title}
      subtitle={copy.signUp.subtitle}
      alternateHref={authPath(lang, "login")}
      alternateLabel={copy.signUp.goToSignIn}
    >
      {unavailable ? (
        <AuthServiceUnavailable message={copy.serviceUnavailable} />
      ) : (
        <SignUpForm lang={lang} copy={copy.signUp} />
      )}
    </AuthPageShell>
  );
}
