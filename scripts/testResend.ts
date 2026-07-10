/**
 * Test d'envoi Resend (accusé de réception).
 * Usage :
 *   TEST_EMAIL=you@example.com npx tsx scripts/testResend.ts
 *   TEST_EMAIL=you@example.com LEAD_ID=<uuid> npx tsx scripts/testResend.ts
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { createScriptAdminClient } from "./supabaseAdminClient";

async function resolveLeadId(
  supabase: ReturnType<typeof createScriptAdminClient>,
): Promise<{ id: string; requestNumber: number } | null> {
  const fromEnv = process.env.LEAD_ID?.trim();
  if (fromEnv) {
    const { data } = await supabase
      .from("leads")
      .select("id, request_number")
      .eq("id", fromEnv)
      .maybeSingle();
    if (data) {
      return { id: data.id, requestNumber: data.request_number as number };
    }
    console.warn(`⚠️  LEAD_ID=${fromEnv} introuvable — dernier lead utilisé.`);
  }

  const { data } = await supabase
    .from("leads")
    .select("id, request_number")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return { id: data.id, requestNumber: data.request_number as number };
}

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

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    console.error("❌ Supabase service role requis pour résoudre un vrai lead.");
    process.exit(1);
  }

  const supabase = createScriptAdminClient(url, serviceKey);
  const lead = await resolveLeadId(supabase);
  if (!lead) {
    console.error("❌ Aucun lead en base — soumettez d'abord un formulaire vitrine.");
    process.exit(1);
  }

  const { getAppUrl, getTransactionalFromEmail } = await import("../src/config/app");
  const { buildLeadShareUrl } = await import("../src/lib/leads/buildLeadShareUrl");
  const { sendClientAcknowledgmentEmail } = await import(
    "../src/lib/email/sendClientAcknowledgmentEmail"
  );

  const from = getTransactionalFromEmail();
  const shareUrl = buildLeadShareUrl(lead.id);

  console.log(`\n📤 From:      ${from}`);
  console.log(`📥 To:        ${to}`);
  console.log(`🔗 Share URL: ${shareUrl}`);
  console.log(`🌐 App URL:   ${getAppUrl()}`);
  console.log(`📁 Lead:      #${lead.requestNumber} (${lead.id})\n`);

  const result = await sendClientAcknowledgmentEmail(
    {
      id: lead.id,
      requestNumber: lead.requestNumber,
      clientEmail: to,
    },
    {
      email: "artisan@example.com",
      businessName: "Lys Elec (test)",
    },
  );

  if (result.ok) {
    console.log("✅ E-mail envoyé. Ouvrez le lien ci-dessus pour vérifier la page /share.");
  } else {
    console.error("❌ Échec:", result.error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
