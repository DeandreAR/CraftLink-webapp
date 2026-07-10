/**
 * Insère les leads de démo dans Supabase pour un workspace.
 *
 * Usage :
 *   npm run seed:leads
 *   SEED_WORKSPACE_ID=<uuid-profil> npm run seed:leads
 *   SEED_FORCE=1 npm run seed:leads   # supprime puis ré-insère
 *
 * Prérequis : SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL dans .env.local
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { createScriptAdminClient } from "./supabaseAdminClient";
import { buildDemoLeadSeeds, mapSeedLeadToInsertRow } from "../src/lib/leads/demoLeadsSeed";

async function resolveWorkspaceId(
  supabase: ReturnType<typeof createScriptAdminClient>,
): Promise<string | null> {
  const fromEnv = process.env.SEED_WORKSPACE_ID?.trim();
  if (fromEnv) return fromEnv;

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, workspace_id, full_name")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("❌ Impossible de lire profiles :", error.message);
    return null;
  }

  if (!profiles?.length) {
    console.error("❌ Aucun profil trouvé. Créez un compte artisan d'abord.");
    return null;
  }

  console.log("ℹ️  SEED_WORKSPACE_ID non défini — profils disponibles :\n");
  for (const profile of profiles) {
    const ws = profile.workspace_id ?? profile.id;
    console.log(`   • ${profile.full_name ?? "Sans nom"}`);
    console.log(`     id / workspace → ${ws}\n`);
  }

  if (profiles.length === 1) {
    const ws = profiles[0].workspace_id ?? profiles[0].id;
    console.log(`→ Utilisation automatique du seul profil : ${ws}\n`);
    return ws;
  }

  console.error(
    "❌ Plusieurs profils : relancez avec SEED_WORKSPACE_ID=<uuid ci-dessus>",
  );
  return null;
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const force = process.env.SEED_FORCE === "1" || process.env.SEED_FORCE === "true";

  if (!url || !serviceKey) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
    process.exit(1);
  }

  const supabase = createScriptAdminClient(url, serviceKey);
  const workspaceId = await resolveWorkspaceId(supabase);

  if (!workspaceId) {
    process.exit(1);
  }

  const { data: existing, error: countError } = await supabase
    .from("leads")
    .select("id")
    .eq("workspace_id", workspaceId);

  if (countError) {
    console.error("❌ Table leads inaccessible :", countError.message);
    console.error("   Appliquez les migrations dans supabase/migrations/");
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    if (!force) {
      console.log(
        `ℹ️  ${existing.length} lead(s) déjà présents pour workspace ${workspaceId}.`,
      );
      console.log("   Pour ré-insérer : SEED_FORCE=1 npm run seed:leads");
      process.exit(0);
    }

    const { error: deleteError } = await supabase
      .from("leads")
      .delete()
      .eq("workspace_id", workspaceId);

    if (deleteError) {
      console.error("❌ Suppression échouée :", deleteError.message);
      process.exit(1);
    }
    console.log(`🗑️  ${existing.length} lead(s) supprimés (SEED_FORCE).`);
  }

  const seeds = buildDemoLeadSeeds();
  const rows = seeds.map((seed) => mapSeedLeadToInsertRow(workspaceId, seed));

  const { data, error } = await supabase.from("leads").insert(rows).select("id, request_number, client_name");

  if (error) {
    console.error("❌ Insertion échouée :", error.message);
    if (error.message.includes("workspace_id")) {
      console.error(
        "   Vérifiez que SEED_WORKSPACE_ID = l'id de votre profil (auth.users.id).",
      );
    }
    process.exit(1);
  }

  console.log(`✅ ${data?.length ?? 0} leads insérés pour workspace ${workspaceId}`);
  data?.forEach((row) => {
    console.log(`   • #${row.request_number} ${row.client_name} → /share/${row.id}`);
  });
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
