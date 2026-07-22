"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signInAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";
import type { AuthSignInDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { forgotPasswordPath } from "@/lib/auth/paths";

const initial: AuthActionState = {};

type SignInFormProps = {
  lang: Locale;
  copy: AuthSignInDictionary;
  authError?: string | null;
  nextPath?: string | null;
};

function resolveAuthCallbackMessage(
  code: string | null | undefined,
  copy: AuthSignInDictionary,
): string | null {
  if (code === "confirmation_failed") return copy.confirmationError;
  if (code === "confirmation_missing") return copy.confirmationMissing;
  return null;
}

export function SignInForm({ lang, copy, authError, nextPath }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, initial);
  const callbackMessage = resolveAuthCallbackMessage(authError, copy);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="locale" value={lang} />
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      {callbackMessage ? (
        <p
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="alert"
        >
          {callbackMessage}
        </p>
      ) : null}

      {state.error ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

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

      <div>
        <label htmlFor="password" className={authLabelClassName}>
          {copy.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className={authFieldClassName}
        />
        <p className="mt-2 text-right">
          <Link
            href={forgotPasswordPath(lang)}
            className="text-sm font-semibold text-[#212129] underline underline-offset-2 hover:text-[#EFA188]"
          >
            {copy.forgotPassword}
          </Link>
        </p>
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
