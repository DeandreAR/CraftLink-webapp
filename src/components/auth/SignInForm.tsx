"use client";

import { useActionState } from "react";
import {
  signInAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";
import type { AuthSignInDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const initial: AuthActionState = {};

type SignInFormProps = {
  lang: Locale;
  copy: AuthSignInDictionary;
};

export function SignInForm({ lang, copy }: SignInFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, initial);

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
