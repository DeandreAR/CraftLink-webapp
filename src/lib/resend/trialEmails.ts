import "server-only";

import {
  renderTrialEmailHtml,
  TRIAL_EMAIL_SUBJECTS,
  type TrialEmailKind,
  type TrialEmailTemplateInput,
} from "@/emails/trial-emails";
import { getResendFromEmail } from "@/config/resend";
import { getResendClient } from "@/lib/email/resendClient";

export type SendTrialEmailResult =
  | { ok: true }
  | { ok: false; error: string };

export async function sendTrialEmail(
  kind: TrialEmailKind,
  to: string,
  templateInput: TrialEmailTemplateInput,
): Promise<SendTrialEmailResult> {
  const resend = getResendClient();
  if (!resend) {
    return { ok: false, error: "RESEND_API_KEY manquante" };
  }

  const html = renderTrialEmailHtml(kind, templateInput);
  const subject = TRIAL_EMAIL_SUBJECTS[kind];

  const { error } = await resend.emails.send({
    from: getResendFromEmail(),
    to,
    subject,
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
