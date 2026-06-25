import OpenAI from "openai";
import { toFile } from "openai/uploads";

export type ProcessLeadVoiceResult = {
  transcript: string;
  summary: string;
  workType: string;
};

const SUMMARY_SYSTEM_PROMPT = `Tu aides un artisan à structurer une demande client reçue par message vocal.
Réponds UNIQUEMENT en JSON valide avec les clés :
- "workType" : intitulé court des travaux (max 8 mots, ex. "Mise aux normes tableau électrique")
- "summary" : résumé clair en 2 à 4 phrases (zone, urgence, détails utiles)`;

function parseVoiceSummaryJson(raw: string): Pick<ProcessLeadVoiceResult, "summary" | "workType"> {
  try {
    const parsed = JSON.parse(raw) as { workType?: string; summary?: string };
    return {
      workType: parsed.workType?.trim() || "Demande client",
      summary: parsed.summary?.trim() || "",
    };
  } catch {
    return { workType: "Demande client", summary: raw.trim() };
  }
}

function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY manquant.");
  }
  return new OpenAI({ apiKey });
}

/** Résumé GPT-4o mini d'une transcription texte (sans repasser par Whisper). */
export async function summarizeLeadTranscript(
  transcript: string,
  openai = createOpenAIClient(),
): Promise<Pick<ProcessLeadVoiceResult, "summary" | "workType">> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Transcription du message vocal client :\n\n${transcript.trim()}`,
      },
    ],
  });

  const rawSummary = completion.choices[0]?.message?.content ?? "";
  return parseVoiceSummaryJson(rawSummary);
}

/** Transcription Whisper + résumé GPT-4o mini d'un message vocal client. */
export async function processLeadVoice(
  audio: Buffer,
  mimeType: string,
): Promise<ProcessLeadVoiceResult> {
  const openai = createOpenAIClient();
  const extension = mimeType.includes("mp4")
    ? "mp4"
    : mimeType.includes("mpeg")
      ? "mp3"
      : "webm";

  const transcription = await openai.audio.transcriptions.create({
    file: await toFile(audio, `lead-voice.${extension}`, { type: mimeType }),
    model: "whisper-1",
    language: "fr",
  });

  const transcript = transcription.text.trim();
  if (!transcript) {
    throw new Error("Transcription vide.");
  }

  const { workType, summary } = await summarizeLeadTranscript(transcript, openai);

  return {
    transcript,
    workType,
    summary: summary || transcript,
  };
}
