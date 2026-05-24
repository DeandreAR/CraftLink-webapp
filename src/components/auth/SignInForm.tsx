"use client";

import { useActionState } from "react";
import {
  signInAction,
  type AuthActionState,
} from "@/app/actions/auth";
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
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {state.success}
        </p>
      ) : null}

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-neutral-800">
          {copy.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-black focus:border-black focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-semibold text-neutral-800">
          {copy.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none ring-black focus:border-black focus:ring-2"
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
