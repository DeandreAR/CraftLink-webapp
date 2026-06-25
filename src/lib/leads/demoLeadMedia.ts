import demoLeadMediaJson from "@/data/demoLeadMedia.json";
import type { LeadVoiceNote } from "@/domain/lead";

export type DemoLeadVoiceEntry = LeadVoiceNote & {
  workType: string;
};

type DemoLeadMediaFile = {
  generatedAt: string | null;
  voices: Record<string, DemoLeadVoiceEntry>;
};

const demoLeadMedia = demoLeadMediaJson as DemoLeadMediaFile;

/** Médias vocaux générés par `npm run demo:lead-media` (fichiers dans /public/demo/leads). */
export function getDemoLeadVoice(leadId: string): DemoLeadVoiceEntry | null {
  return demoLeadMedia.voices[leadId] ?? null;
}

export function isDemoLeadMediaReady(): boolean {
  return Boolean(demoLeadMedia.generatedAt && Object.keys(demoLeadMedia.voices).length > 0);
}
