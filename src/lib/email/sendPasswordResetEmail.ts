import { getAppUrl } from "@/config/app";
import { getResendAuthFromEmail } from "@/config/resend";
import { renderPasswordResetHtml } from "@/lib/email/renderPasswordResetHtml";
import { getResendClient } from "@/lib/email/resendClient";

export type SendPasswordResetEmailResult =
  | { ok: true }
  | { ok: false; error: string };

/** Envoie l'e-mail de réinitialisation via l'API Resend (pas le SMTP Supabase). */
export async function sendPasswordResetEmail(input: {
  to: string;
  confirmationUrl: string;
  siteUrl?: string;
}): Promise<SendPasswordResetEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY manquante dans .env.local" };
  }

  const siteUrl = input.siteUrl ?? getAppUrl();
  const html = renderPasswordResetHtml({
    email: input.to,
    confirmationUrl: input.confirmationUrl,
    siteUrl,
  });

  const { error } = await resend.emails.send({
    from: getResendAuthFromEmail(),
    to: input.to,
    subject: "Réinitialisez votre mot de passe CraftLink",
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
