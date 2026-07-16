import { getTransactionalFromEmail } from "@/config/app";

/**
 * Resend — expéditeurs et config SMTP optionnelle (reset MDP natif Supabase).
 *
 * L'inscription et la réinitialisation MDP envoient les e-mails via l'API Resend
 * (`sendSignupConfirmationEmail.ts`, `sendPasswordResetEmail.ts`).
 */
export const RESEND_SMTP = {
  host: "smtp.resend.com",
  port: 465,
  username: "resend",
} as const;

export function getResendApiKey(): string | undefined {
  return process.env.RESEND_API_KEY?.trim() || undefined;
}

/** Expéditeur e-mails transactionnels app (accusés leads, etc.). */
export function getResendFromEmail(): string {
  return getTransactionalFromEmail();
}

/**
 * Expéditeur e-mails Auth Supabase (confirmation d'inscription, reset MDP).
 * Par défaut = même adresse que les transactionnels.
 */
export function getResendAuthFromEmail(): string {
  return (
    process.env.RESEND_AUTH_FROM_EMAIL?.trim() ??
    process.env.RESEND_FROM_EMAIL?.trim() ??
    getTransactionalFromEmail()
  );
}

export type ResendSupabaseSmtpConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  senderEmail: string;
  senderName: string;
};

/** Parse « CraftLink <noreply@domain.com> » → nom + adresse. */
export function parseSenderFromHeader(from: string): { name: string; email: string } {
  const match = from.match(/^(.+?)\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: "CraftLink", email: from.trim() };
}

export function buildResendSupabaseSmtpConfig(): ResendSupabaseSmtpConfig | null {
  const apiKey = getResendApiKey();
  if (!apiKey) return null;

  const { name, email } = parseSenderFromHeader(getResendAuthFromEmail());

  return {
    host: RESEND_SMTP.host,
    port: RESEND_SMTP.port,
    username: RESEND_SMTP.username,
    password: apiKey,
    senderEmail: email,
    senderName: name,
  };
}
