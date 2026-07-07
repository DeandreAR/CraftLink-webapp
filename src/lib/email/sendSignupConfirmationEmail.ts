import { getAppUrl } from "@/config/app";
import { getResendAuthFromEmail } from "@/config/resend";
import { renderSignupConfirmationHtml } from "@/lib/email/renderSignupConfirmationHtml";
import { getResendClient } from "@/lib/email/resendClient";

export type SendSignupConfirmationResult =
  | { ok: true }
  | { ok: false; error: string };

/** Envoie l'e-mail de confirmation d'inscription via l'API Resend (pas le SMTP Supabase). */
export async function sendSignupConfirmationEmail(input: {
  to: string;
  confirmationUrl: string;
  siteUrl?: string;
}): Promise<SendSignupConfirmationResult> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY manquante dans .env.local" };
  }

  const siteUrl = input.siteUrl ?? getAppUrl();
  const html = renderSignupConfirmationHtml({
    email: input.to,
    confirmationUrl: input.confirmationUrl,
    siteUrl,
  });

  const { error } = await resend.emails.send({
    from: getResendAuthFromEmail(),
    to: input.to,
    subject: "Confirmez votre compte CraftLink",
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
