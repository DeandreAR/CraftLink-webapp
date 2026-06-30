import type { DashboardLead } from "@/domain/lead";
import type { LeadSchedule } from "@/domain/lead";
import { getDemoLeadVoice } from "@/lib/leads/demoLeadMedia";

type SeedLeadInput = Omit<DashboardLead, "id" | "requestNumber"> & {
  requestNumber?: number;
};

function scheduleDate(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function sched(
  dayOffset: number,
  preset: LeadSchedule["durationPreset"],
  value?: number,
): LeadSchedule {
  return {
    date: scheduleDate(dayOffset),
    durationPreset: preset,
    ...(value != null ? { durationValue: value } : {}),
  };
}

function voice(leadId: string, transcript: string, summary: string) {
  const generated = getDemoLeadVoice(leadId);
  const ext = generated?.audioUrl?.endsWith(".wav") ? "wav" : "mp3";
  return {
    audioUrl: generated?.audioUrl ?? `/demo/leads/${leadId}.${ext}`,
    transcript: generated?.transcript ?? transcript,
    summary: generated?.summary ?? summary,
  };
}

/** Jeu de données de démo pour `npm run seed:leads`. */
export function buildDemoLeadSeeds(): SeedLeadInput[] {
  const base = new Date();
  const daysAgo = (n: number) =>
    new Date(base.getTime() - n * 86_400_000).toISOString();

  return [
    {
      clientName: "Sophie Martin",
      clientPhone: "+33675590653",
      createdAt: daysAgo(0),
      workType: "Mise aux normes tableau électrique",
      zone: "Antony (92160)",
      delayStatus: "asap",
      workflowStatus: "active",
      contactStatus: "pending",
      description:
        "Appartement 65 m², disjoncteur qui saute au four. Souhaite un devis avant vendredi.",
      summary:
        "Appartement 65 m², disjoncteur qui saute au four. Souhaite un devis avant vendredi.",
      voice: voice(
        "ld-01",
        "Bonjour, j'ai un souci avec mon tableau électrique…",
        "Mise aux normes tableau électrique — disjoncteur qui saute au four.",
      ),
      photos: [
        { url: "https://picsum.photos/seed/craftlink-lead01-a/800/600", alt: "Photo 1" },
        { url: "https://picsum.photos/seed/craftlink-lead01-b/800/600", alt: "Photo 2" },
      ],
      schedule: sched(2, "hours", 3),
    },
    {
      clientName: "Karim Benali",
      clientPhone: "+33675590653",
      createdAt: daysAgo(1),
      workType: "Dépannage fuite sous évier",
      zone: "Massy (91300)",
      delayStatus: "urgent",
      workflowStatus: "active",
      contactStatus: "pending",
      description: "",
      summary: "Fuite active cuisine, accès facile, disponible cet après-midi.",
      voice: voice(
        "ld-02",
        "Bonjour, j'ai une fuite sous l'évier…",
        "Dépannage fuite sous évier en cuisine.",
      ),
      schedule: sched(0, "half_day"),
    },
    {
      clientName: "Claire Dupont",
      clientPhone: "+33675590653",
      createdAt: daysAgo(2),
      workType: "Pose de 4 prises supplémentaires",
      zone: "Sceaux (92330)",
      delayStatus: "planned",
      workflowStatus: "active",
      contactStatus: "pending",
      description: "Rénovation salon, perçage cloison placo.",
      summary: "Rénovation salon, perçage cloison placo.",
      photos: [
        { url: "https://picsum.photos/seed/craftlink-lead03-a/800/600", alt: "Photo 1" },
        { url: "https://picsum.photos/seed/craftlink-lead03-b/800/600", alt: "Photo 2" },
        { url: "https://picsum.photos/seed/craftlink-lead03-c/800/600", alt: "Photo 3" },
      ],
      schedule: sched(7, "full_day"),
    },
    {
      clientName: "Thomas Leroy",
      clientPhone: "+33675590653",
      createdAt: daysAgo(3),
      workType: "Installation borne IRVE",
      zone: "Palaiseau (91120)",
      delayStatus: "info",
      workflowStatus: "active",
      contactStatus: "pending",
      description: "Garage individuel, distance tableau 8 m.",
      summary: "Garage individuel, distance tableau 8 m.",
    },
    {
      clientName: "Nadia Rousseau",
      clientPhone: "+33675590653",
      createdAt: daysAgo(4),
      workType: "Recherche de panne partielle",
      zone: "Fontenay-aux-Roses (92260)",
      delayStatus: "urgent",
      workflowStatus: "active",
      contactStatus: "pending",
      description: "Plus de lumière chambre et SDB.",
      summary: "Plus de lumière chambre et SDB.",
      schedule: sched(1, "minutes", 90),
    },
  ];
}

export function mapSeedLeadToInsertRow(
  workspaceId: string,
  seed: SeedLeadInput,
): Record<string, unknown> {
  return {
    workspace_id: workspaceId,
    request_number: seed.requestNumber ?? 0,
    client_name: seed.clientName,
    client_phone: seed.clientPhone,
    created_at: seed.createdAt,
    work_type: seed.workType,
    zone: seed.zone,
    delay_status: seed.delayStatus,
    workflow_status: seed.workflowStatus,
    contact_status: seed.contactStatus,
    contacted_at: seed.contactedAt ?? null,
    description: seed.description,
    summary: seed.summary,
    voice: seed.voice ?? null,
    photos: seed.photos ?? [],
    schedule: seed.schedule ?? null,
  };
}
