import type { SupabaseClient, User } from "@supabase/supabase-js";
import type {
  AuthResult,
  SignInFormInput,
  SignUpFormInput,
} from "@/domain/auth";
import type { Profile } from "@/domain/profile";
import { defaultLocale } from "@/i18n/config";
import { buildAuthCallbackUrl } from "@/lib/auth/emailConfirmationRedirect";
import { authPath } from "@/lib/auth/paths";
import { formatAuthDebugMessage, formatConfigDebugMessage, logAuthError, AUTH_GENERIC_ERROR } from "@/lib/auth/debugError";
import { normalizeSupabaseConfirmationLink } from "@/lib/auth/requestAppUrl";
import { isMissingAuthSessionError } from "@/lib/supabase/authErrors";
import { sendSignupConfirmationEmail } from "@/lib/email/sendSignupConfirmationEmail";
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
  if (
    lower.includes("already been registered") ||
    lower.includes("already exists") ||
    lower.includes("duplicate")
  ) {
    return "Cet e-mail est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.";
  }
  if (lower.includes("error sending confirmation email")) {
    return "Impossible d'envoyer l'e-mail de confirmation. Réessayez dans quelques instants.";
  }
  if (lower.includes("password") && lower.includes("short")) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  return AUTH_GENERIC_ERROR;
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
      withSession.error,
      "Votre compte n'a pas pu être finalisé. Réessayez l'inscription ou contactez le support.",
    ),
    code: withSession.code ?? "profile_init_failed",
  };
}

export async function signUpWithProfile(
  _supabase: SupabaseClient,
  input: SignUpFormInput,
  options?: { appUrl?: string },
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

  const onboardingPath = authPath(defaultLocale, "onboarding");
  const appUrl = options?.appUrl ?? undefined;
  const redirectTo = buildAuthCallbackUrl(onboardingPath, appUrl);

  const admin = createAdminClient();
  if (!admin) {
    return {
      ok: false,
      error: formatConfigDebugMessage(
        "auth.signUp.admin",
        "Inscription momentanément indisponible. Réessayez plus tard ou contactez le support.",
        "SUPABASE_SERVICE_ROLE_KEY absente",
      ),
      code: "admin_client_missing",
    };
  }

  const { data: createData, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: {
      full_name: input.fullName?.trim() || null,
      whatsapp_number: input.proPhoneNumber?.trim() || null,
    },
  });

  if (createError) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signUp",
        createError,
        mapAuthError(createError.message),
      ),
      code: createError.code,
    };
  }

  if (!createData.user) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signUp",
        null,
        "Inscription impossible. Réessayez dans quelques instants.",
      ),
    };
  }

  const user = createData.user;

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { redirectTo },
  });

  const confirmationUrl = linkData?.properties?.action_link
    ? normalizeSupabaseConfirmationLink(linkData.properties.action_link, redirectTo)
    : undefined;
  if (linkError || !confirmationUrl) {
    await rollbackAuthUser(user.id);
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signUp.link",
        linkError,
        "Impossible de générer le lien de confirmation. Réessayez dans quelques instants.",
      ),
      code: linkError?.code ?? "confirmation_link_failed",
    };
  }

  const emailResult = await sendSignupConfirmationEmail({
    to: email,
    confirmationUrl,
    siteUrl: appUrl,
  });

  if (!emailResult.ok) {
    await rollbackAuthUser(user.id);
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.signUp.email",
        emailResult.error,
        "Impossible d'envoyer l'e-mail de confirmation. Vérifiez votre adresse e-mail ou réessayez dans quelques instants.",
      ),
      code: "confirmation_email_failed",
    };
  }

  const profileResult = await ensureProfileAfterSignUp(admin, user, input);
  if (!profileResult.ok) {
    return profileResult;
  }

  return {
    ok: true,
    data: {
      user,
      profile: profileResult.data,
      needsEmailConfirmation: true,
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
        "Profil artisan introuvable. Contactez le support ou réinscrivez-vous.",
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
      error: formatAuthDebugMessage("auth.signOut", error, "Impossible de se déconnecter. Réessayez."),
      code: error.code,
    };
  }
  return { ok: true, data: null };
}

export async function requestPasswordReset(
  supabase: SupabaseClient,
  email: string,
  options: { resetPasswordPath: string; appUrl?: string },
): Promise<AuthResult<null>> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { ok: false, error: "L’adresse e-mail est obligatoire." };
  }

  const redirectTo = buildAuthCallbackUrl(options.resetPasswordPath, options.appUrl);
  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo,
  });

  if (error) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.resetPasswordForEmail",
        error,
        "Impossible d’envoyer l’e-mail de réinitialisation. Réessayez dans quelques instants.",
      ),
      code: error.code,
    };
  }

  return { ok: true, data: null };
}

export async function updatePassword(
  supabase: SupabaseClient,
  password: string,
): Promise<AuthResult<User>> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`,
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      error: "Session expirée. Demandez un nouveau lien de réinitialisation.",
      code: "recovery_session_missing",
    };
  }

  const { data, error } = await supabase.auth.updateUser({ password });

  if (error) {
    return {
      ok: false,
      error: formatAuthDebugMessage(
        "auth.updateUser.password",
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
        "auth.updateUser.password",
        null,
        "Impossible de mettre à jour le mot de passe.",
      ),
    };
  }

  return { ok: true, data: data.user };
}
