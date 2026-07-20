/**
 * Script CLI — post Instagram CraftLink validé (texte fixe → OG → disque).
 *
 * Usage :
 *   1. Lance `npm run dev` (pour /api/og-image)
 *   2. `npm run generate-post`
 *
 * Pour cette version : pas d’appel Gemini — texte de lancement officiel validé.
 */

import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "../loadEnvLocal";
import type { CraftlinkInstagramConcept } from "../../src/lib/content/instagram/types";
import { fetchOgImageBuffer } from "../../src/lib/content/instagram/fetchOgImage";
import { savePendingPost } from "../../src/lib/content/instagram/savePendingPost";

/** Texte de lancement officiel validé dans Google AI Studio — ne pas inventer. */
const approvedPost: CraftlinkInstagramConcept = {
  name: "CraftLink",
  job: "Lancement Officiel",
  text_visuel:
    "Professionnels du bâtiment : centralisez vos demandes clients (SMS, WhatsApp, DMs) sur un tableau de bord unique.",
  caption_insta: `📝 Le Post Instagram de Lancement Officiel
📈 Professionnels du bâtiment : comment gérez-vous le flux de vos demandes d'interventions au quotidien ?
Entre les chantiers actifs, la direction de vos équipes et les exigences techniques, les sollicitations de vos clients se dispersent continuellement sur de multiples canaux.
📩 Une demande de devis reçue par DM Instagram, une confirmation de travaux par SMS, ou encore une photo technique envoyée sur WhatsApp...
Cette fragmentation des échanges ralentit votre réactivité, crée un risque d'oubli et empiète lourdement sur vos soirées et votre temps de repos. Gérer la communication ne devrait pas pénaliser la quality de vos chantiers, ni votre sérénité.
⚖️ C'est pour structurer votre activité et restaurer votre efficacité que nous avons conçu CraftLink.
CraftLink est le hub de messagerie et le portail client exclusivement dédié aux professionnels du bâtiment. Notre plateforme centralise l'intégralité de vos flux de discussion (Instagram, SMS, WhatsApp, Messenger) sur un tableau de bord unique, épuré et hautement professionnel.
🛠️ Les bénéfices pour votre entreprise :
Centralisation complète : Plus besoin de jongler entre quatre applications différentes.
Sérénité retrouvée : Un suivi clair pour chaque client, sans aucun oubli.
Image de marque renforcée : Des réponses rapides, structurées et professionnelles.
🚀 Pour notre lancement officiel, nous ouvrons notre programme exclusif "Early Bird" aux entreprises désireuses de moderniser leur gestion de la relation client et de structurer leur croissance.
👉 Le lien d'inscription est disponible directement dans notre bio : getcraftlink.com 💼
Rejoignez nos premiers utilisateurs partenaires dès aujourd'hui et reprenez le contrôle de vos soirées !
#artisan #electricien #plombier #renovation #chantier #entrepreneur #craftlink #independant #btp #gestiondechantier #relationclient #professionnel`,
};

/** Charge aussi `.env` si présent (sans écraser `.env.local`). */
function loadEnvFallback(): void {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  loadEnvFallback();

  const concept = approvedPost;
  console.log("[instagram-content] 1/3 — Texte validé (pas d’appel Gemini)");
  console.log("[instagram-content] Post :", {
    name: concept.name,
    job: concept.job,
    text_visuel: concept.text_visuel,
  });

  console.log("[instagram-content] 2/3 — Génération PNG via /api/og-image…");
  const imageBuffer = await fetchOgImageBuffer(concept);

  console.log("[instagram-content] 3/3 — Sauvegarde dans public/pending_posts/…");
  const artifacts = await savePendingPost(concept, imageBuffer);

  console.log("[instagram-content] OK");
  console.log(`  image   → ${artifacts.imagePath}`);
  console.log(`  caption → ${artifacts.captionPath}`);
  console.log("--- caption_insta ---");
  console.log(concept.caption_insta);
}

main().catch((error) => {
  console.error(
    "[instagram-content] ÉCHEC :",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
