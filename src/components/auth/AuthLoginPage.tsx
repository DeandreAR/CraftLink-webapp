import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { AuthServiceUnavailable } from "@/components/auth/AuthServiceUnavailable";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { SignInForm } from "@/components/auth/SignInForm";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import type { AuthDictionary } from "@/i18n/types";

export type AuthLoginView = "signin" | "forgot-password" | "recovery";

type AuthLoginPageProps = {
  lang: Locale;
  copy: AuthDictionary;
  view: AuthLoginView;
  authError?: string | null;
  unavailable?: boolean;
  unavailableMessage?: string;
  recoverySessionReady?: boolean;
  nextPath?: string | null;
};

export function AuthLoginPage({
  lang,
  copy,
  view,
  authError,
  unavailable = false,
  unavailableMessage,
  recoverySessionReady = false,
  nextPath,
}: AuthLoginPageProps) {
  const shell =
    view === "forgot-password"
      ? {
          title: copy.forgotPassword.title,
          subtitle: copy.forgotPassword.subtitle,
          alternateHref: authPath(lang, "login"),
          alternateLabel: copy.forgotPassword.backToSignIn,
        }
      : view === "recovery"
        ? {
            title: copy.resetPassword.title,
            subtitle: copy.resetPassword.subtitle,
            alternateHref: authPath(lang, "login"),
            alternateLabel: copy.resetPassword.backToSignIn,
          }
        : {
            title: copy.signIn.title,
            subtitle: copy.signIn.subtitle,
            alternateHref: authPath(lang, "signup"),
            alternateLabel: copy.signIn.goToSignUp,
          };

  return (
    <AuthPageShell
      lang={lang}
      title={shell.title}
      subtitle={shell.subtitle}
      alternateHref={shell.alternateHref}
      alternateLabel={shell.alternateLabel}
      backToHomeLabel={copy.shell.backToHome}
    >
      {unavailable ? (
        <AuthServiceUnavailable
          message={unavailableMessage ?? copy.serviceUnavailable}
        />
      ) : view === "forgot-password" ? (
        <ForgotPasswordForm lang={lang} copy={copy.forgotPassword} />
      ) : view === "recovery" ? (
        <ResetPasswordForm
          lang={lang}
          copy={copy.resetPassword}
          sessionReady={recoverySessionReady}
        />
      ) : (
        <SignInForm lang={lang} copy={copy.signIn} authError={authError} nextPath={nextPath} />
      )}
    </AuthPageShell>
  );
}
