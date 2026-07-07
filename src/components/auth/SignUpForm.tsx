"use client";

import { useActionState, useCallback } from "react";
import {
  signUpAction,
  type AuthActionState,
} from "@/app/actions/auth";
import { SignUpEmailConfirmation } from "@/components/auth/SignUpEmailConfirmation";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { ProPhoneInput } from "@/components/auth/ProPhoneInput";
import { GlowButton } from "@/components/ui/GlowButton";
import { HONEYPOT_FIELD_NAME, isHoneypotTriggered } from "@/lib/auth/honeypot";
import { authPath } from "@/lib/auth/paths";
import type { AuthSignUpDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const initial: AuthActionState = {};

type SignUpFormProps = {
  lang: Locale;
  copy: AuthSignUpDictionary;
};

export function SignUpForm({ lang, copy }: SignUpFormProps) {
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(event.currentTarget);
      if (isHoneypotTriggered(formData.get(HONEYPOT_FIELD_NAME))) {
        event.preventDefault();
        return;
      }
    },
    [],
  );

  if (state.emailConfirmationPending && state.confirmationEmail) {
    return (
      <SignUpEmailConfirmation
        copy={copy}
        email={state.confirmationEmail}
        loginHref={authPath(lang, "login")}
      />
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="locale" value={lang} />

      <input
        type="text"
        name={HONEYPOT_FIELD_NAME}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        style={{ display: "none" }}
      />

      {state.error ? (
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {state.success}
        </p>
      ) : null}

      <div>
        <label htmlFor="fullName" className={authLabelClassName}>
          {copy.fullName}
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          className={authFieldClassName}
        />
      </div>

      <ProPhoneInput
        id="proPhoneNumber"
        name="proPhoneNumber"
        lang={lang}
        label={copy.proPhone}
        placeholder={copy.proPhonePlaceholder}
        labelClassName={authLabelClassName}
      />

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
          autoComplete="new-password"
          required
          minLength={8}
          className={authFieldClassName}
        />
        <p className="mt-1 text-xs text-neutral-500">{copy.passwordHint}</p>
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
