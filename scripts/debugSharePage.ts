/**
 * Diagnostic page /share/:id
 * Usage : npx tsx scripts/debugSharePage.ts
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { createScriptAdminClient } from "./supabaseAdminClient";

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  console.log("\n🔧 Config");
  console.log("  NEXT_PUBLIC_APP_URL =", appUrl ?? "(non défini)");
  console.log("  SERVICE_ROLE        =", serviceKey ? "✓ présent" : "✗ manquant");

  if (!url || !serviceKey) {
    console.error("\n❌ Supabase incomplet.");
    process.exit(1);
  }

  const supabase = createScriptAdminClient(url, serviceKey);

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, request_number, client_name, work_type, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("\n❌ Lecture leads:", error.message);
    process.exit(1);
  }

  if (!leads?.length) {
    console.error("\n❌ Aucun lead en base.");
    process.exit(1);
  }

  console.log("\n📋 Derniers leads :\n");
  for (const lead of leads) {
    const sharePath = `/share/${lead.id}`;
    const shareUrl = `${appUrl ?? "http://localhost:3000"}${sharePath}`;
    console.log(`  #${lead.request_number} ${lead.client_name} — ${lead.work_type}`);
    console.log(`    ID:  ${lead.id}`);
    console.log(`    URL: ${shareUrl}\n`);
  }

  const latest = leads[0];
  const { data: row, error: fetchError } = await supabase
    .from("leads")
    .select(
      "id, workspace_id, request_number, client_name, client_phone, client_email, created_at, updated_at, work_type, zone, delay_status, workflow_status, contact_status, contacted_at, quote_sent_at, invoice_sent_at, description, summary, voice, photos, schedule, attachments",
    )
    .eq("id", latest.id)
    .maybeSingle();

  if (fetchError) {
    console.error("❌ Select lead (comme /share):", fetchError.message);
    process.exit(1);
  }

  if (!row) {
    console.error("❌ Lead introuvable par ID.");
    process.exit(1);
  }

  console.log("✅ Lead lisible via service role (page /share devrait fonctionner).");
  console.log(`\n→ Teste dans le navigateur : ${appUrl ?? "http://localhost:3000"}/share/${latest.id}\n`);
}

main().catch(console.error);
