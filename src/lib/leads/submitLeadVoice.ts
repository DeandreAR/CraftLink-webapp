import type { ProcessLeadVoiceResult } from "@/lib/leads/processLeadVoice";

export type ProcessLeadVoiceResponse =
  | ({ ok: true } & ProcessLeadVoiceResult)
  | { ok: false; error: string };

/** Envoie un enregistrement vocal au pipeline Whisper + GPT-4o mini. */
export async function submitLeadVoiceForProcessing(
  audio: Blob,
  fileName = "lead-voice.webm",
): Promise<ProcessLeadVoiceResponse> {
  const formData = new FormData();
  formData.append("audio", audio, fileName);

  const response = await fetch("/api/leads/process-voice", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as ProcessLeadVoiceResponse;
  return payload;
}
