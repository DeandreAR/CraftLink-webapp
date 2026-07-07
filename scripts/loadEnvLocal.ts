import fs from "node:fs";
import path from "node:path";

function readEnvLines(): string[] {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return [];
  const content = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  return content.split("\n");
}

/** Charge `.env.local` dans process.env (pour les scripts npm). */
export function loadEnvLocal(): void {
  for (const line of readEnvLines()) {
    const trimmed = line.trim().replace(/^export\s+/, "");
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    const hashIdx = value.indexOf(" #");
    if (hashIdx !== -1) {
      value = value.slice(0, hashIdx).trim();
    }
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

/** Retourne les noms de variables définies dans `.env.local` (debug). */
export function listEnvLocalKeys(): string[] {
  const keys: string[] = [];
  for (const line of readEnvLines()) {
    const trimmed = line.trim().replace(/^export\s+/, "");
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    keys.push(trimmed.slice(0, eq).trim());
  }
  return keys;
}
