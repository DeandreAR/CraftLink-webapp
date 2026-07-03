/**
 * Test d'envoi Resend (accusé de réception).
 * Usage : TEST_EMAIL=you@example.com npx tsx scripts/testResend.ts
 */
import { loadEnvLocal } from "./loadEnvLocal";

async function main() {
  loadEnvLocal();

  const to = process.env.TEST_EMAIL?.trim();
  if (!to) {
    console.error("❌ Définissez TEST_EMAIL=...");
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.error("❌ RESEND_API_KEY manquante dans .env.local");
    process.exit(1);
  }

  const { getTransactionalFromEmail } = await import("../src/config/app");
  const { sendClientAcknowledgmentEmail } = await import(
    "../src/lib/email/sendClientAcknowledgmentEmail"
  );

  const from = getTransactionalFromEmail();
  console.log(`\n📤 From: ${from}`);
  console.log(`📥 To:   ${to}\n`);

  const result = await sendClientAcknowledgmentEmail(
    {
      id: "00000000-0000-4000-8000-000000000001",
      requestNumber: 3842,
      clientEmail: to,
    },
    {
      email: "artisan@example.com",
      businessName: "Lys Elec (test)",
    },
  );

  if (result.ok) {
    console.log("✅ E-mail envoyé avec succès.");
  } else {
    console.error("❌ Échec:", result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
