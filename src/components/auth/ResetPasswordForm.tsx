"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updatePasswordAction, type AuthActionState } from "@/app/actions/auth";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";
import type { Locale } from "@/i18n/config";
import type { AuthResetPasswordDictionary } from "@/i18n/types";
import { authPath, forgotPasswordPath } from "@/lib/auth/paths";

const initial: AuthActionState = {};

type ResetPasswordFormProps = {
  lang: Locale;
  copy: AuthResetPasswordDictionary;
  sessionReady: boolean;
};

export function ResetPasswordForm({ lang, copy, sessionReady }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState(updatePasswordAction, initial);

  if (!sessionReady) {
    return (
      <div className="space-y-6">
        <p
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          {copy.sessionMissing}
        </p>
        <p className="text-center text-sm text-neutral-600">
          <Link
            href={forgotPasswordPath(lang)}
            className="font-semibold text-black underline-offset-2 hover:underline"
          >
            {copy.requestNewLink}
          </Link>
        </p>
        <p className="text-center text-sm text-neutral-600">
          <Link href={authPath(lang, "login")} className="font-semibold text-black underline-offset-2 hover:underline">
            {copy.backToSignIn}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={lang} />

      {state.error ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div>
        <label htmlFor="password" className={authLabelClassName}>
          {copy.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={authFieldClassName}
        />
        <p className="mt-1.5 text-xs text-neutral-500">{copy.passwordHint}</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className={authLabelClassName}>
          {copy.confirmPassword}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className={authFieldClassName}
        />
      </div>

      <GlowButton
        type="submit"
        disabled={pending}
        className="w-full justify-center disabled:opacity-60"
      >
        {pending ? copy.submitting : copy.submit}
      </GlowButton>
    </form>
  );
}
