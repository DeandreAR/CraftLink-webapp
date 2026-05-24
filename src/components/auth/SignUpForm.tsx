"use client";

import { useActionState } from "react";
import {
  signUpAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { GlowButton } from "@/components/ui/GlowButton";
import type { AuthSignUpDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const initial: AuthActionState = {};

type SignUpFormProps = {
  lang: Locale;
  copy: AuthSignUpDictionary;
};

export function SignUpForm({ lang, copy }: SignUpFormProps) {
  const [state, formAction, pending] = useActionState(signUpAction, initial);

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
        <label htmlFor="fullName" className="text-sm font-semibold text-neutral-800">
          {copy.fullName}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black"
        />
      </div>

      <div>
        <label htmlFor="whatsappNumber" className="text-sm font-semibold text-neutral-800">
          {copy.whatsapp}
        </label>
        <input
          id="whatsappNumber"
          name="whatsappNumber"
          type="tel"
          autoComplete="tel"
          placeholder="33612345678"
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black"
        />
      </div>

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
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black"
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
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black"
        />
        <p className="mt-1 text-xs text-neutral-500">{copy.passwordHint}</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-neutral-800"
        >
          {copy.confirmPassword}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1.5 w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black"
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
