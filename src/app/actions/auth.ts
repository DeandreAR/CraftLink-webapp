"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SignInFormInput, SignUpFormInput } from "@/domain/auth";
import { formatConfigDebugMessage, logAuthError, AUTH_SERVICE_UNAVAILABLE } from "@/lib/auth/debugError";
import { getAuthCallbackBaseUrl } from "@/lib/auth/requestAppUrl";
import {
  HONEYPOT_FIELD_NAME,
  isHoneypotTriggered,
} from "@/lib/auth/honeypot";
import { resolvePostAuthPath } from "@/lib/auth/onboardingStatus";
import { authPath } from "@/lib/auth/paths";
import {
  getSupabaseConfig,
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
  /** Inscription OK mais e-mail non confirmé — afficher l'écran « consultez votre boîte ». */
  emailConfirmationPending?: boolean;
  confirmationEmail?: string;
};

function configUnavailableMessage(): string {
  return formatConfigDebugMessage(
    "supabase.config",
    AUTH_SERVICE_UNAVAILABLE,
    "Configuration Supabase manquante ou placeholder",
  );
}

async function getServerSupabaseClient() {
  if (!getSupabaseConfig()) {
    return { error: configUnavailableMessage() as string };
  }
  try {
    return { client: await createClient() };
  } catch (error) {
    logAuthError("createClient", error);
    return {
      error: formatConfigDebugMessage(
        "supabase.createClient",
        AUTH_SERVICE_UNAVAILABLE,
        error instanceof Error ? error.message : error,
      ),
    };
  }
}

export async function signUpAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (isHoneypotTriggered(formData.get(HONEYPOT_FIELD_NAME))) {
    logAuthError("signUpAction", "Honeypot déclenché — soumission ignorée.");
    return {};
  }

  const input: SignUpFormInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    fullName: String(formData.get("fullName") ?? "") || undefined,
    proPhoneNumber: String(formData.get("proPhoneNumber") ?? "") || undefined,
  };

  const confirm = String(formData.get("confirmPassword") ?? "");
  if (input.password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const supabaseResult = await getServerSupabaseClient();
  if ("error" in supabaseResult && supabaseResult.error) {
    return { error: supabaseResult.error };
  }

  const supabase = supabaseResult.client!;
  const appUrl = getAuthCallbackBaseUrl(await headers());
  const result = await signUpWithProfile(supabase, input, { appUrl });

  if (!result.ok) {
    return { error: result.error };
  }

  if (result.data.needsEmailConfirmation) {
    return {
      emailConfirmationPending: true,
      confirmationEmail: input.email.trim().toLowerCase(),
    };
  }

  redirect(resolvePostAuthPath(localeFromForm(formData), result.data.profile));
}

export async function signInAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const input: SignInFormInput = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const supabaseResult = await getServerSupabaseClient();
  if ("error" in supabaseResult && supabaseResult.error) {
    return { error: supabaseResult.error };
  }

  const supabase = supabaseResult.client!;
  const result = await signInWithPassword(supabase, input);

  if (!result.ok) {
    return { error: result.error };
  }

  if (!result.data.profile) {
    return {
      error: formatConfigDebugMessage(
        "profile.missing.afterSignIn",
        "Connexion impossible : espace artisan introuvable. Contactez le support.",
        "Profil absent après connexion",
      ),
    };
  }

  redirect(resolvePostAuthPath(localeFromForm(formData), result.data.profile));
}

export async function signOutAction(formData: FormData) {
  const supabaseResult = await getServerSupabaseClient();
  if ("client" in supabaseResult && supabaseResult.client) {
    await signOut(supabaseResult.client);
  }
  redirect(authPath(localeFromForm(formData), "login"));
}
