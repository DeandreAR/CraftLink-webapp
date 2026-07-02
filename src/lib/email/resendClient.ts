import { Resend } from "resend";

let resendClient: Resend | null | undefined;

/** Client Resend singleton (serveur uniquement). */
export function getResendClient(): Resend | null {
  if (resendClient !== undefined) return resendClient;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    resendClient = null;
    return null;
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

export const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL?.trim() ?? "CraftLink <notifications@craftlink.fr>";
