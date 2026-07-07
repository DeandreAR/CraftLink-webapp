/**
 * Génère les audios de démo + résumés IA.
 *
 * Avec OPENAI_API_KEY dans .env.local :
 *   - TTS (voix française) → MP3 local
 *   - Whisper + GPT-4o mini → transcription & résumé
 *
 * Sans clé : WAV local (bip) + résumés statiques (pour tester le lecteur).
 *
 * Usage : npm run demo:lead-media
 */
import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { loadEnvLocal, listEnvLocalKeys } from "./loadEnvLocal";
import { DEMO_VOICE_LEADS } from "./demoLeadVoiceConfig";
import { processLeadVoice } from "../src/lib/leads/processLeadVoice";

const PUBLIC_DIR = path.join(process.cwd(), "public", "demo", "leads");
const OUTPUT_JSON = path.join(process.cwd(), "src", "data", "demoLeadMedia.json");

/** Résumés statiques si pas de clé OpenAI (alignés sur les transcripts de démo). */
const STATIC_SUMMARIES: Record<string, { workType: string; summary: string }> = {
  "ld-01": {
    workType: "Mise aux normes tableau électrique",
    summary:
      "Tableau électrique à remettre aux normes dans un appartement 65 m² à Antony. Disjoncteur qui saute à l'allumage du four. Devis souhaité avant vendredi.",
  },
  "ld-02": {
    workType: "Dépannage fuite sous évier",
    summary:
      "Fuite active sous l'évier de cuisine à Massy. Intervention urgente, accès facile. Client disponible cet après-midi.",
  },
};

/** WAV mono 16-bit avec tonalité — fichier valide pour le lecteur HTML. */
function buildToneWav(durationSeconds: number, frequencyHz = 440): Buffer {
  const sampleRate = 24_000;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate;
    const envelope = Math.min(1, t * 4) * Math.min(1, (durationSeconds - t) * 4);
    const sample = Math.sin(2 * Math.PI * frequencyHz * t) * envelope * 0.25 * 32_767;
    buffer.writeInt16LE(Math.round(sample), 44 + i * 2);
  }

  return buffer;
}

async function synthesizeSpeech(openai: OpenAI, text: string): Promise<Buffer> {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
    response_format: "mp3",
  });
  return Buffer.from(await response.arrayBuffer());
}

async function processFallback(lead: (typeof DEMO_VOICE_LEADS)[number]): Promise<{
  audioUrl: string;
  transcript: string;
  summary: string;
  workType: string;
}> {
  const fileName = `${lead.id}.wav`;
  const filePath = path.join(PUBLIC_DIR, fileName);
  const audioBuffer = buildToneWav(4, lead.id === "ld-01" ? 392 : 494);

  fs.writeFileSync(filePath, audioBuffer);
  console.log(`   🔊 WAV local (${(audioBuffer.length / 1024).toFixed(1)} Ko) → ${filePath}`);

  const staticFallback = STATIC_SUMMARIES[lead.id];
  return {
    audioUrl: `/demo/leads/${fileName}`,
    transcript: lead.transcript,
    summary: staticFallback.summary,
    workType: staticFallback.workType,
  };
}

async function processWithOpenAi(
  openai: OpenAI,
  lead: (typeof DEMO_VOICE_LEADS)[number],
): Promise<{
  audioUrl: string;
  transcript: string;
  summary: string;
  workType: string;
}> {
  const fileName = `${lead.id}.mp3`;
  const filePath = path.join(PUBLIC_DIR, fileName);

  console.log(`   🎙️  Synthèse TTS…`);
  const audioBuffer = await synthesizeSpeech(openai, lead.transcript);
  fs.writeFileSync(filePath, audioBuffer);
  console.log(`   ✓ MP3 (${(audioBuffer.length / 1024).toFixed(1)} Ko) → ${filePath}`);

  console.log(`   ⏳ Whisper + GPT-4o mini…`);
  const processed = await processLeadVoice(audioBuffer, "audio/mpeg");

  return {
    audioUrl: `/demo/leads/${fileName}`,
    transcript: processed.transcript,
    summary: processed.summary,
    workType: processed.workType,
  };
}

async function main() {
  loadEnvLocal();

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const hasKey = Boolean(apiKey);

  if (!hasKey) {
    const keys = listEnvLocalKeys();
    console.warn(
      "⚠️  OPENAI_API_KEY absent de .env.local — mode fallback (WAV + résumés statiques).",
    );
    console.warn(`   Variables trouvées : ${keys.join(", ") || "(aucune)"}`);
    console.warn("   Ajoutez exactement : OPENAI_API_KEY=sk-… puis sauvegardez le fichier.\n");
  }

  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });

  const openai = hasKey ? new OpenAI({ apiKey }) : null;
  const voices: Record<
    string,
    { audioUrl: string; transcript: string; summary: string; workType: string }
  > = {};

  for (const lead of DEMO_VOICE_LEADS) {
    console.log(`\n📋 ${lead.id}`);
    const result = openai
      ? await processWithOpenAi(openai, lead)
      : await processFallback(lead);
    voices[lead.id] = {
      audioUrl: result.audioUrl,
      transcript: result.transcript,
      summary: result.summary,
      workType: result.workType,
    };
    console.log(`   ✓ Travaux : ${result.workType}`);
    console.log(`   ✓ Résumé : ${result.summary.slice(0, 90)}…`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    mode: hasKey ? "openai-tts-whisper-gpt" : "local-wav-static",
    voices,
  };

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`\n✅ Terminé → ${OUTPUT_JSON}`);
}

main().catch((error) => {
  console.error("❌", error instanceof Error ? error.message : error);
  process.exit(1);
});
