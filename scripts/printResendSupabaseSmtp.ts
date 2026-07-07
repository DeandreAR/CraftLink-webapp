/**
 * Affiche la config SMTP Resend à copier dans Supabase Auth.
 * Usage : npm run resend:supabase-smtp
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { buildAppUrl, getAppUrl } from "../src/config/app";
import { buildAuthCallbackUrl } from "../src/lib/auth/emailConfirmationRedirect";
import { authPath } from "../src/lib/auth/paths";
import { defaultLocale } from "../src/i18n/config";
import { buildResendSupabaseSmtpConfig } from "../src/config/resend";

async function main() {
  loadEnvLocal();

  const smtp = buildResendSupabaseSmtpConfig();
  if (!smtp) {
    console.error("❌ RESEND_API_KEY manquante dans .env.local");
    process.exit(1);
  }

  const callbackUrl = buildAuthCallbackUrl(authPath(defaultLocale, "onboarding"));
  const appUrl = getAppUrl();

  console.log("\n═══ Resend — e-mails Auth (inscription) ═══\n");
  console.log("L'inscription envoie déjà les confirmations via l'API Resend (pas le SMTP Supabase).\n");
  console.log(`  Expéditeur auth (.env)   : ${smtp.senderEmail}`);
  console.log(`  Domaine à valider Resend : ${smtp.senderEmail.split("@")[1] ?? "?"}`);
  console.log("\n── SMTP Supabase (optionnel, ex. reset MDP natif) ──\n");
  console.log("Dashboard Supabase → Authentication → Emails → SMTP Settings\n");
  console.log(`  Enable Custom SMTP     : ON`);
  console.log(`  Host                   : ${smtp.host}`);
  console.log(`  Port number            : ${smtp.port}`);
  console.log(`  Username               : ${smtp.username}`);
  console.log(`  Password               : ${smtp.password.slice(0, 8)}… (votre RESEND_API_KEY complète)`);
  console.log(`  Sender email           : ${smtp.senderEmail}`);
  console.log(`  Sender name            : ${smtp.senderName}`);
  console.log("\n── Authentication → URL Configuration ──\n");
  console.log(`  Site URL               : ${appUrl}`);
  console.log(`  Redirect URLs (+)      : ${callbackUrl}`);
  if (appUrl.includes("localhost")) {
    console.log(`  Redirect URLs (+)      : ${buildAppUrl("/auth/callback")}  (prod)`);
  }
  console.log("\n── Authentication → Emails → Confirm signup ──\n");
  console.log("  (Ignoré pour l'inscription — template lu depuis supabase/email-templates/confirm-signup.html)");
  console.log("\n── Resend Dashboard ──\n");
  console.log(`  Vérifiez que le domaine de ${smtp.senderEmail} est validé (Domains).`);
  console.log("\n✅ Variables .env.local détectées — inscription = API Resend.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
