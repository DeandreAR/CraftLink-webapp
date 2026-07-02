import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  AuthResult,
  SignInFormInput,
  SignUpFormInput,
} from "@/domain/auth";
import type { Profile } from "@/domain/profile";
import { buildAppUrl } from "@/config/app";
import { defaultLocale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { formatAuthDebugMessage, logAuthError } from "@/lib/auth/debugError";
import { isMissingAuthSessionError } from "@/lib/supabase/authErrors";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createProfileForNewUser,
  getProfileByUserId,
} from "@/services/profileService";

const MIN_PASSWORD_LENGTH = 8;

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirmez votre e-mail avant de vous connecter (vérifiez votre boîte de réception).";
  }
  if (lower.includes("user already registered")) {
    return "Cet e-mail est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.";
  }
  if (lower.includes("password") && lower.includes("short")) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  return message;
}

async function rollbackAuthUser(userId: string): Promise<void> {
  const admin = createAdminClient();
  if (!admin) {
    logAuthError(
      "rollbackAuthUser",
      "SUPABASE_SERVICE_ROLE_KEY absente — impossible de supprimer l’utilisateur Auth en rollback.",
    );
    return;
  }
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    logAuthError("rollbackAuthUser", error);
  }
}

/**
 * Insère le profil avec le client session ; en secours, client admin (service role).
 * Compatible trigger SQL `on_auth_user_created` (évite double insert + rollback).
 */
async function ensureProfileAfterSignUp(
  sessionClient: SupabaseClient,
  user: User,
  input: SignUpFormInput,
): Promise<AuthResult<Profile>> {
  const createInput = {
    userId: user.id,
    fullName: input.fullName,
    proPhoneNumber: input.proPhoneNumber,
  };

  const existing = await getProfileByUserId(sessionClient, user.id);
  if (existing.ok && existing.data) {
    return { ok: true, data: existing.data };
  }
  if (!existing.ok) {
    return existing;
  }

  const withSession = await createProfileForNewUser(sessionClient, createInput);
  if (withSession.ok) {
    return withSession;
  }

  const admin = createAdminClient();
  if (admin) {
    const withAdmin = await createProfileForNewUser(admin, createInput);
    if (withAdmin.ok) {
      return withAdmin;
    }
    logAuthError("ensureProfileAfterSignUp.admin", {
      error: withAdmin.error,
      code: withAdmin.code,
    });
  } else {
    logAuthError(
      "ensureProfileAfterSignUp",
      "SUPABASE_SERVICE_ROLE_KEY absente — secours admin indisponible après échec insert session.",
    );
  }

  const finalCheck = await getProfileByUserId(sessionClient, user.id);
  if (finalCheck.ok && finalCheck.data) {
    return { ok: true, data: finalCheck.data };
  }

  await rollbackAuthUser(user.id);

  return {
    ok: false,
    error: formatAuthDebugMessage(
      "profile_init",
      null,
      withSession.error ??
        "Votre compte a été créé mais l’initialisation de l’espace artisan a échoué. Réessayez l’inscription ou contactez le support.",
    ),
    code: withSession.code ?? "profile_init_failed",
  };
}

export async function signUpWithProfile(
  supabase: SupabaseClient,
  input: SignUpFormInput,
): Promise<AuthResult<{ user: User; profile: Profile; needsEmailConfirmation: boolean }>> {
  const email = input.email.trim().toLowerCase();
  const password = input.password;

  if (!email) {
    return { ok: false, error: "L’adresse e-mail est obligatoire." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildAppUrl(authPath(defaultLocale, "onboarding")),
      data: {
        full_name: input.fullName?.trim() || null,
        whatsapp_number: input.proPhoneNumber?.trim() || null,
      },
    },
  });

  if (error) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signUp",
        error,
        mapAuthError(error.message),
      ),
      code: error.code,
    };
  }

  if (!data.user) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signUp",
        null,
        "Inscription impossible. Réessayez dans quelques instants.",
      ),
    };
  }

  const profileResult = await ensureProfileAfterSignUp(supabase, data.user, input);
  if (!profileResult.ok) {
    return profileResult;
  }

  const needsEmailConfirmation = !data.session;

  return {
    ok: true,
    data: {
      user: data.user,
      profile: profileResult.data,
      needsEmailConfirmation,
    },
  };
}

export async function signInWithPassword(
  supabase: SupabaseClient,
  input: SignInFormInput,
): Promise<AuthResult<{ user: User; profile: Profile | null }>> {
  const email = input.email.trim().toLowerCase();

  if (!email) {
    return { ok: false, error: "L’adresse e-mail est obligatoire." };
  }
  if (!input.password) {
    return { ok: false, error: "Le mot de passe est obligatoire." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });

  if (error) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signIn",
        error,
        mapAuthError(error.message),
      ),
      code: error.code,
    };
  }

  if (!data.user) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signIn",
        null,
        "Connexion impossible.",
      ),
    };
  }

  const profileResult = await getProfileByUserId(supabase, data.user.id);
  if (!profileResult.ok) {
    return profileResult;
  }

  if (!profileResult.data) {
    const repaired = await createProfileForNewUser(supabase, {
      userId: data.user.id,
      fullName: (data.user.user_metadata?.full_name as string | undefined) ?? undefined,
      proPhoneNumber:
        (data.user.user_metadata?.whatsapp_number as string | undefined) ?? undefined,
    });
    if (!repaired.ok) {
      return repaired;
    }
    return {
      ok: true,
      data: { user: data.user, profile: repaired.data },
    };
  }

  return {
    ok: true,
    data: { user: data.user, profile: profileResult.data },
  };
}

export type SessionWithProfile = {
  user: User;
  profile: Profile;
};

export async function getSessionWithProfile(
  supabase: SupabaseClient,
): Promise<AuthResult<SessionWithProfile | null>> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    if (isMissingAuthSessionError(userError)) {
      return { ok: true, data: null };
    }

    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.getUser",
        userError,
        "Session invalide.",
      ),
      code: userError.code,
    };
  }

  if (!user) {
    return { ok: true, data: null };
  }

  const profileResult = await getProfileByUserId(supabase, user.id);
  if (!profileResult.ok) {
    return profileResult;
  }

  if (!profileResult.data) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "profile.missing",
        null,
        "Profil artisan introuvable (workspace_id). Contactez le support ou réinscrivez-vous.",
      ),
      code: "profile_missing",
    };
  }

  return {
    ok: true,
    data: { user, profile: profileResult.data },
  };
}

export async function signOut(supabase: SupabaseClient): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      ok: false,
      error: formatAuthDebugMessage("auth.signOut", error, error.message),
      code: error.code,
    };
  }
  return { ok: true, data: null };
}
