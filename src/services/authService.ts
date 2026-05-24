import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  AuthResult,
  SignInFormInput,
  SignUpFormInput,
} from "@/domain/auth";
import type { Profile } from "@/domain/profile";
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
  if (!admin) return;
  await admin.auth.admin.deleteUser(userId);
}

/**
 * Insère le profil avec le client session ; en secours, client admin (service role).
 */
async function ensureProfileAfterSignUp(
  sessionClient: SupabaseClient,
  user: User,
  input: SignUpFormInput,
): Promise<AuthResult<Profile>> {
  const createInput = {
    userId: user.id,
    fullName: input.fullName,
    whatsappNumber: input.whatsappNumber,
  };

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
  }

  await rollbackAuthUser(user.id);

  return {
    ok: false,
    error:
      "Votre compte a été créé mais l’initialisation de l’espace artisan a échoué. Aucun espace partiel n’a été conservé : réessayez l’inscription ou contactez le support.",
    code: "profile_init_failed",
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
      data: {
        full_name: input.fullName?.trim() || null,
        whatsapp_number: input.whatsappNumber?.trim() || null,
      },
    },
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message), code: error.code };
  }

  if (!data.user) {
    return {
      ok: false,
      error: "Inscription impossible. Réessayez dans quelques instants.",
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
    return { ok: false, error: mapAuthError(error.message), code: error.code };
  }

  if (!data.user) {
    return { ok: false, error: "Connexion impossible." };
  }

  const profileResult = await getProfileByUserId(supabase, data.user.id);
  if (!profileResult.ok) {
    return profileResult;
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
    return { ok: false, error: "Session invalide.", code: userError.code };
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
      error:
        "Profil artisan introuvable. Contactez le support ou réinscrivez-vous.",
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
    return { ok: false, error: error.message, code: error.code };
  }
  return { ok: true, data: null };
}
