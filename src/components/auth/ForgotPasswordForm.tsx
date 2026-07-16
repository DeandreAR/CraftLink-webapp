"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  requestPasswordResetAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";
import type { Locale } from "@/i18n/config";
import type { AuthForgotPasswordDictionary } from "@/i18n/types";
import { authPath } from "@/lib/auth/paths";

const initial: AuthActionState = {};

type ForgotPasswordFormProps = {
  lang: Locale;
  copy: AuthForgotPasswordDictionary;
};

export function ForgotPasswordForm({ lang, copy }: ForgotPasswordFormProps) {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initial);
  const emailSent = state.success === "password_reset_email_sent";

  return (
    <div className="space-y-6">
      {state.error ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      {emailSent ? (
        <p
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {copy.success}
        </p>
      ) : (
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="locale" value={lang} />

          <div>
            <label htmlFor="email" className={authLabelClassName}>
              {copy.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
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
      )}

      <p className="text-center text-sm text-neutral-600">
        <Link href={authPath(lang, "login")} className="font-semibold text-black underline-offset-2 hover:underline">
          {copy.backToSignIn}
        </Link>
      </p>
    </div>
  );
}
