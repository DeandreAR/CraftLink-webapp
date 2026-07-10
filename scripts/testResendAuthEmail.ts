/**
 * Envoie un e-mail de test (style confirmation compte) via l'API Resend.
 * Usage : TEST_EMAIL=you@example.com npm run resend:test-auth
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { getAppUrl } from "../src/config/app";
import { getResendAuthFromEmail, getResendApiKey } from "../src/config/resend";

async function main() {
  loadEnvLocal();

  const to = process.env.TEST_EMAIL?.trim();
  if (!to) {
    console.error("❌ Définissez TEST_EMAIL=votre@email.com");
    process.exit(1);
  }

  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY manquante dans .env.local");
    process.exit(1);
  }

  const from = getResendAuthFromEmail();
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const confirmUrl = `${getAppUrl()}/auth/callback?next=/onboarding&code=test-preview`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#737373;">CraftLink · test</p>
      <h1 style="font-size:22px;color:#171717;">Confirmez votre adresse e-mail</h1>
      <p style="color:#404040;line-height:1.6;">Ceci est un <strong>e-mail de test Resend</strong> (pas un vrai lien Supabase).</p>
      <p style="margin:24px 0;">
        <a href="${confirmUrl}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;border-radius:999px;font-weight:700;">
          Confirmer mon e-mail (test)
        </a>
      </p>
      <p style="font-size:12px;color:#737373;">Si cet e-mail arrive, Resend est OK — configurez ensuite le SMTP dans Supabase.</p>
    </div>
  `;

  console.log(`\n📤 From: ${from}`);
  console.log(`📥 To:   ${to}\n`);

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "[Test] Confirmez votre compte CraftLink",
    html,
  });

  if (error) {
    console.error("❌ Échec Resend:", error);
    process.exit(1);
  }

  console.log("✅ E-mail de test envoyé. ID:", data?.id);
  console.log("   L'inscription utilise l'API Resend — SMTP Supabase optionnel.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
