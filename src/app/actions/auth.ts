"use server";

import { redirect } from "next/navigation";
import type { SignInFormInput, SignUpFormInput } from "@/domain/auth";
import { authPath } from "@/lib/auth/paths";
import {
  getSupabaseConfig,
  SUPABASE_UNAVAILABLE_MESSAGE,
} from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  signInWithPassword,
  signOut,
  signUpWithProfile,
} from "@/services/authService";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

function localeFromForm(formData: FormData): Locale {
  const raw = String(formData.get("locale") ?? defaultLocale);
  return isLocale(raw) ? raw : defaultLocale;
}

export type AuthActionState = {
  error?: string;
  success?: string;
};

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const input: SignUpFormInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    fullName: String(formData.get("fullName") ?? "") || undefined,
    whatsappNumber: String(formData.get("whatsappNumber") ?? "") || undefined,
  };

  const confirm = String(formData.get("confirmPassword") ?? "");
  if (input.password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (!getSupabaseConfig()) {
    return { error: SUPABASE_UNAVAILABLE_MESSAGE };
  }

  const supabase = await createClient();
  const result = await signUpWithProfile(supabase, input);

  if (!result.ok) {
    return { error: result.error };
  }

  if (result.data.needsEmailConfirmation) {
    return {
      success:
        "Compte créé. Vérifiez votre e-mail pour confirmer, puis connectez-vous.",
    };
  }

  redirect(authPath(localeFromForm(formData), "dashboard"));
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const input: SignInFormInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  if (!getSupabaseConfig()) {
    return { error: SUPABASE_UNAVAILABLE_MESSAGE };
  }

  const supabase = await createClient();
  const result = await signInWithPassword(supabase, input);

  if (!result.ok) {
    return { error: result.error };
  }

  if (!result.data.profile) {
    return {
      error:
        "Connexion réussie mais espace artisan manquant. Contactez le support.",
    };
  }

  redirect(authPath(localeFromForm(formData), "dashboard"));
}

export async function signOutAction(formData: FormData) {
  const supabase = await createClient();
  await signOut(supabase);
  redirect(authPath(localeFromForm(formData), "login"));
}
