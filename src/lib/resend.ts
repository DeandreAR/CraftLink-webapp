/**
 * Point d'entrée Resend — séquence e-mails essai Pro.
 * @see src/lib/resend/trialEmails.ts
 * @see src/emails/trial-emails.ts
 */
export { sendTrialEmail, type SendTrialEmailResult } from "@/lib/resend/trialEmails";
export {
  renderTrialEmailHtml,
  TRIAL_EMAIL_SUBJECTS,
  type TrialEmailKind,
  type TrialEmailTemplateInput,
} from "@/emails/trial-emails";
