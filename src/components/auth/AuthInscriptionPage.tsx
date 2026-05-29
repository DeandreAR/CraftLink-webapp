import Link from "next/link";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";
import { SignUpForm } from "@/components/auth/SignUpForm";
import type { Locale } from "@/i18n/config";
import { authPath, onboardingPath } from "@/lib/auth/paths";
import type { AuthDictionary } from "@/i18n/types";

type AuthInscriptionPageProps = {
  lang: Locale;
  copy: AuthDictionary;
  unavailable?: boolean;
  unavailableMessage?: string;
};

export function AuthInscriptionPage({
  lang,
  copy,
  unavailable = false,
  unavailableMessage,
}: AuthInscriptionPageProps) {
  return (
    <AuthPageShell
      lang={lang}
      title={copy.signUp.title}
      subtitle={copy.signUp.subtitle}
      alternateHref={authPath(lang, "login")}
      alternateLabel={copy.signUp.goToSignIn}
      backToHomeLabel={copy.shell.backToHome}
    >
      {unavailable ? (
        <AuthServiceUnavailable
          message={unavailableMessage ?? copy.serviceUnavailable}
        />
      ) : (
        <>
          <SignUpForm lang={lang} copy={copy.signUp} />
          <p className="mt-6 text-center text-sm text-neutral-600">
            <Link
              href={onboardingPath(lang)}
              className="font-semibold text-black underline-offset-2 hover:underline"
            >
              {copy.signUp.setupVitrineLink}
            </Link>
          </p>
        </>
      )}
    </AuthPageShell>
  );
}
