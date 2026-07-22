/**
 * Envoie les 3 e-mails de la séquence essai Pro (prévisualisation).
 * Usage :
 *   npm run trial:send-preview
 *   TEST_EMAIL=you@example.com npm run trial:send-preview
 */
import { loadEnvLocal } from "./loadEnvLocal";
import {
  renderTrialEmailHtml,
  TRIAL_EMAIL_SUBJECTS,
  type TrialEmailKind,
} from "../src/emails/trial-emails";
import { getResendFromEmail, getResendApiKey } from "../src/config/resend";
import { buildTrialAbonnementCtaUrl } from "../src/lib/email/trial/urls";

const KINDS: TrialEmailKind[] = ["mid_trial", "warning", "expired"];

async function main() {
  loadEnvLocal();

  const to = process.env.TEST_EMAIL?.trim() || "andry.ramarolahy@gmail.com";
  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY manquante dans .env.local");
    process.exit(1);
  }

  const from = getResendFromEmail();
  const ctaUrl = buildTrialAbonnementCtaUrl();
  const trialEndsAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  console.log(`\n📤 From: ${from}`);
  console.log(`📥 To:   ${to}`);
  console.log(`🔗 CTA:  ${ctaUrl}\n`);

  for (const kind of KINDS) {
    const subject = `[Preview] ${TRIAL_EMAIL_SUBJECTS[kind]}`;
    const html = renderTrialEmailHtml(kind, {
      recipientName: "Andry",
      ctaUrl,
      leadsCount: kind === "mid_trial" ? 3 : undefined,
      trialEndsAt,
    });

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`❌ ${kind}:`, error.message);
      process.exit(1);
    }

    console.log(`✅ ${kind} — ${subject}`);
    console.log(`   ID: ${data?.id ?? "—"}\n`);
  }

  console.log("Les 3 e-mails de prévisualisation ont été envoyés.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
