/**
 * Passe un profil artisan en plan PRO (test).
 * Usage : npx tsx scripts/setProPlan.ts
 *         SET_PRO_EMAIL=you@example.com npx tsx scripts/setProPlan.ts
 */
import { loadEnvLocal } from "./loadEnvLocal";
import { createScriptAdminClient } from "./supabaseAdminClient";

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const targetEmail = process.env.SET_PRO_EMAIL?.trim().toLowerCase();

  if (!url || !serviceKey) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.");
    process.exit(1);
  }

  const supabase = createScriptAdminClient(url, serviceKey);

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, plan_tier, page_slug")
    .order("created_at", { ascending: true });

  if (error || !profiles?.length) {
    console.error("❌ Impossible de lire profiles:", error?.message ?? "vide");
    process.exit(1);
  }

  type Row = (typeof profiles)[number] & { email?: string };

  const enriched: Row[] = [];
  for (const profile of profiles) {
    const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
    enriched.push({ ...profile, email: authData?.user?.email ?? undefined });
  }

  console.log("\n📋 Profils :\n");
  for (const p of enriched) {
    console.log(`  • ${p.full_name ?? "—"} (${p.email ?? "sans email"})`);
    console.log(`    plan_tier = ${p.plan_tier ?? "—"} | slug = ${p.page_slug ?? "—"}\n`);
  }

  const target =
    (targetEmail ? enriched.find((p) => p.email?.toLowerCase() === targetEmail) : null) ??
    (enriched.length === 1 ? enriched[0] : null);

  if (!target) {
    console.error(
      "❌ Plusieurs profils — relancez avec SET_PRO_EMAIL=<email> ou un seul compte en base.",
    );
    process.exit(1);
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ plan_tier: "PRO" })
    .eq("id", target.id);

  if (updateError) {
    console.error("❌ Mise à jour échouée:", updateError.message);
    process.exit(1);
  }

  console.log(`✅ ${target.full_name ?? target.email} → plan_tier = PRO`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
