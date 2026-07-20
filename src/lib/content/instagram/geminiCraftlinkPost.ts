import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CraftlinkInstagramConcept } from "./types";
import {
  CRAFTLINK_MARKETING_SYSTEM_INSTRUCTION,
  CRAFTLINK_MARKETING_USER_PROMPT,
} from "./prompts";

const GEMINI_MODEL = "gemini-3.5-flash";

/**
 * Retire les fences markdown éventuelles (```json ... ```) avant parse.
 */
export function stripMarkdownFences(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  }
  return text.trim();
}

/**
 * Parse technique uniquement — pas de filtre éditorial.
 * Tronque text_visuel à 180 car. pour rester compatible avec /api/og-image.
 */
export function parseCraftlinkConcept(raw: string): CraftlinkInstagramConcept {
  const cleaned = stripMarkdownFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `JSON Gemini invalide (${detail}). Réponse brute :\n${cleaned.slice(0, 500)}`,
    );
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Le JSON Gemini n’est pas un objet.");
  }

  const row = parsed as Record<string, unknown>;
  const name = typeof row.name === "string" ? row.name.trim() : "";
  const job = typeof row.job === "string" ? row.job.trim() : "";
  const textVisuel =
    typeof row.text_visuel === "string" ? row.text_visuel.trim() : "";
  const captionInsta =
    typeof row.caption_insta === "string" ? row.caption_insta.trim() : "";

  if (!name || !job || !textVisuel || !captionInsta) {
    throw new Error(
      "JSON Gemini incomplet : name, job, text_visuel et caption_insta sont requis.",
    );
  }

  const text_visuel =
    textVisuel.length > 180 ? `${textVisuel.slice(0, 179)}…` : textVisuel;

  return {
    name,
    job,
    text_visuel,
    caption_insta: captionInsta,
  };
}

/**
 * Appelle Gemini — l’IA décide du contenu ; le code ne fait que récupérer le JSON.
 */
export async function generateCraftlinkConcept(
  apiKey = process.env.GEMINI_API_KEY,
): Promise<CraftlinkInstagramConcept> {
  if (!apiKey?.trim()) {
    throw new Error(
      "GEMINI_API_KEY manquante. Ajoute-la dans .env.local puis relance.",
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: CRAFTLINK_MARKETING_SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 1,
    },
  });

  const result = await model.generateContent(CRAFTLINK_MARKETING_USER_PROMPT);
  const raw = result.response.text();

  if (!raw?.trim()) {
    throw new Error("Gemini a renvoyé une réponse vide.");
  }

  return parseCraftlinkConcept(raw);
}
