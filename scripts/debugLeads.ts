/**
 * Diagnostic leads / workspace — lecture service role.
 * Usage : npm run debug:leads
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { createScriptAdminClient } from "./supabaseAdminClient";

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceKey) {
    console.error("❌ Variables Supabase manquantes.");
    process.exit(1);
  }

  const supabase = createScriptAdminClient(url, serviceKey);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, workspace_id, full_name")
    .limit(20);

  if (profilesError) {
    console.error("❌ profiles:", profilesError.message);
  } else {
    console.log("\n📋 Profiles (utilisez id comme SEED_WORKSPACE_ID) :");
    profiles?.forEach((p) => {
      const ws = p.workspace_id ?? p.id;
      console.log(`  ${p.full_name ?? "—"}`);
      console.log(`    profile.id       = ${p.id}`);
      console.log(`    workspace_id     = ${p.workspace_id ?? "(null → fallback id)"}`);
      console.log(`    → seed avec      = ${ws}`);
      console.log("");
    });
  }

  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("id, workspace_id, request_number, client_name, workflow_status")
    .order("created_at", { ascending: false })
    .limit(20);

  if (leadsError) {
    console.error("❌ leads:", leadsError.message);
    console.error("   → Appliquez les migrations supabase/migrations/");
    process.exit(1);
  }

  const fullSelect =
    "id, workspace_id, request_number, client_name, client_phone, created_at, updated_at, work_type, zone, delay_status, workflow_status, contact_status, contacted_at, description, summary, voice, photos, schedule";
  const { error: fullSelectError } = await supabase.from("leads").select(fullSelect).limit(1);
  if (fullSelectError) {
    console.error("\n⚠️  Select dashboard (colonnes CRM) échoue :", fullSelectError.message);
    console.error("   → Exécutez supabase/migrations/20260625140000_leads_rls_fix.sql");
  } else {
    console.log("\n✓ Colonnes CRM présentes (select dashboard OK)");
  }

  console.log(`\n📦 Leads en base (${leads?.length ?? 0} affichés, max 20):`);
  if (!leads?.length) {
    console.log("  (aucun) — lancez npm run seed:leads");
  } else {
    const byWorkspace = new Map<string, number>();
    for (const lead of leads) {
      byWorkspace.set(lead.workspace_id, (byWorkspace.get(lead.workspace_id) ?? 0) + 1);
      console.log(
        `  #${lead.request_number} ${lead.client_name} | workspace=${lead.workspace_id}`,
      );
    }
    console.log("\n  Répartition par workspace_id:");
    for (const [ws, count] of byWorkspace) {
      const match = profiles?.some((p) => (p.workspace_id ?? p.id) === ws);
      console.log(`    ${ws} → ${count} lead(s)${match ? " ✓ profil correspond" : " ⚠ aucun profil"}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
