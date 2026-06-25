import type { DashboardLead, LeadPhoto, LeadVoiceNote } from "@/domain/lead";
import type { LeadSchedule } from "@/domain/lead";
import { getDemoLeadVoice } from "@/lib/leads/demoLeadMedia";

type DemoLeadRow = Omit<DashboardLead, "workflowStatus" | "requestNumber" | "contactStatus">;

function demoPhotos(seeds: string[]): LeadPhoto[] {
  return seeds.map((seed, index) => ({
    url: `https://picsum.photos/seed/craftlink-${seed}/800/600`,
    alt: `Photo client ${index + 1}`,
  }));
}

function demoVoice(leadId: string, transcript: string, summary: string): LeadVoiceNote {
  const generated = getDemoLeadVoice(leadId);
  const ext = generated?.audioUrl?.endsWith(".wav") ? "wav" : "mp3";
  return {
    audioUrl: generated?.audioUrl ?? `/demo/leads/${leadId}.${ext}`,
    transcript: generated?.transcript ?? transcript,
    summary: generated?.summary ?? summary,
  };
}

function applyGeneratedVoice(row: DemoLeadRow): DemoLeadRow {
  if (!row.voice) return row;
  const generated = getDemoLeadVoice(row.id);
  if (!generated) return row;
  return {
    ...row,
    workType: generated.workType,
    voice: {
      audioUrl: generated.audioUrl,
      transcript: generated.transcript,
      summary: generated.summary,
    },
  };
}

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

/**
 * Données de démonstration — remplacées par Supabase `leads` quand la table sera branchée.
 * Triés du plus récent au plus ancien (index 0 = lead le plus récent).
 */
function buildDemoLeads(): DashboardLead[] {
  const base = new Date();
  const daysAgo = (n: number) =>
    new Date(base.getTime() - n * 86_400_000).toISOString();

  const rows: DemoLeadRow[] = [
    {
      id: "ld-01",
      clientName: "Sophie Martin",
      clientPhone: "+33675590653",
      createdAt: daysAgo(0),
      workType: "Mise aux normes tableau électrique",
      zone: "Antony (92160)",
      delayStatus: "asap",
      description:
        "Appartement 65 m², disjoncteur qui saute au four. Souhaite un devis avant vendredi.",
      summary:
        "Appartement 65 m², disjoncteur qui saute au four. Souhaite un devis avant vendredi.",
      voice: demoVoice(
        "ld-01",
        "Bonjour, j'ai un souci avec mon tableau électrique dans mon appartement de soixante-cinq mètres carrés. Le disjoncteur saute dès que j'allume le four. Je voudrais un devis rapidement, idéalement avant vendredi.",
        "Mise aux normes tableau électrique — disjoncteur qui saute au four dans un appartement 65 m². Devis souhaité avant vendredi.",
      ),
      photos: demoPhotos(["lead01-a", "lead01-b"]),
      schedule: sched(2, "hours", 3),
    },
    {
      id: "ld-02",
      clientName: "Karim Benali",
      clientPhone: "+33675590653",
      createdAt: daysAgo(1),
      workType: "Dépannage fuite sous évier",
      zone: "Massy (91300)",
      delayStatus: "urgent",
      description: "",
      summary: "Fuite active cuisine, accès facile, disponible cet après-midi.",
      voice: demoVoice(
        "ld-02",
        "Bonjour, j'ai une fuite sous l'évier de la cuisine, c'est assez urgent. L'accès est facile et je suis disponible cet après-midi si possible.",
        "Dépannage fuite sous évier en cuisine — fuite active, accès facile, disponible cet après-midi.",
      ),
      schedule: sched(0, "half_day"),
    },
    {
      id: "ld-03",
      clientName: "Claire Dupont",
      clientPhone: "+33675590653",
      createdAt: daysAgo(2),
      workType: "Pose de 4 prises supplémentaires",
      zone: "Sceaux (92330)",
      delayStatus: "planned",
      description:
        "Rénovation salon, perçage cloison placo, créneau semaine prochaine. Photos des emplacements souhaités en pièce jointe.",
      summary:
        "Rénovation salon, perçage cloison placo, créneau semaine prochaine.",
      photos: demoPhotos(["lead03-a", "lead03-b", "lead03-c"]),
      schedule: sched(7, "full_day"),
    },
    {
      id: "ld-04",
      clientName: "Thomas Leroy",
      clientPhone: "+33675590653",
      createdAt: daysAgo(3),
      workType: "Installation borne IRVE",
      zone: "Palaiseau (91120)",
      delayStatus: "info",
      description: "Garage individuel, distance tableau 8 m, demande info aides.",
      summary: "Garage individuel, distance tableau 8 m, demande info aides.",
    },
    {
      id: "ld-05",
      clientName: "Nadia Rousseau",
      clientPhone: "+33675590653",
      createdAt: daysAgo(4),
      workType: "Recherche de panne partielle",
      zone: "Fontenay-aux-Roses (92260)",
      delayStatus: "urgent",
      description: "Plus de lumière chambre et SDB, disjoncteur OK.",
      summary: "Plus de lumière chambre et SDB, disjoncteur OK.",
      schedule: sched(1, "minutes", 90),
    },
    {
      id: "ld-06",
      clientName: "Philippe Garnier",
      clientPhone: "+33675590653",
      createdAt: daysAgo(5),
      workType: "Remplacement chauffe-eau",
      zone: "Châtenay-Malabry (92290)",
      delayStatus: "asap",
      description: "Ballon 200 L, accès cave, évacuation ancien matériel souhaitée.",
      summary: "Ballon 200 L, accès cave, évacuation ancien matériel souhaitée.",
    },
    {
      id: "ld-07",
      clientName: "Émilie Costa",
      clientPhone: "+33675590653",
      createdAt: daysAgo(6),
      workType: "Peinture murs salon",
      zone: "Antony (92160)",
      delayStatus: "planned",
      description: "Surface ~35 m², préparation murs, teinte blanc cassé.",
      summary: "Surface ~35 m², préparation murs, teinte blanc cassé.",
    },
    {
      id: "ld-08",
      clientName: "Marc Olivier",
      clientPhone: "+33675590653",
      createdAt: daysAgo(7),
      workType: "Menuiserie — remplacement fenêtre",
      zone: "Bagneux (92220)",
      delayStatus: "info",
      description: "Double vitrage PVC 120×140, RDC, devis comparatif.",
      summary: "Double vitrage PVC 120×140, RDC, devis comparatif.",
    },
    {
      id: "ld-09",
      clientName: "Julie Faure",
      clientPhone: "+33675590653",
      createdAt: daysAgo(8),
      workType: "Dépannage chauffage",
      zone: "Montrouge (92120)",
      delayStatus: "urgent",
      description: "Radiateur salon froid, chaudière gaz en défaut.",
      summary: "Radiateur salon froid, chaudière gaz en défaut.",
    },
    {
      id: "ld-10",
      clientName: "Ahmed Sy",
      clientPhone: "+33675590653",
      createdAt: daysAgo(9),
      workType: "Extension maçonnerie mur porteur",
      zone: "Wissous (91320)",
      delayStatus: "planned",
      description: "Ouverture 2,40 m vers jardin, étude structure demandée.",
      summary: "Ouverture 2,40 m vers jardin, étude structure demandée.",
    },
    {
      id: "ld-11",
      clientName: "Laura Petit",
      clientPhone: "+33644556677",
      createdAt: daysAgo(10),
      workType: "Éclairage extérieur terrasse",
      zone: "Antony (92160)",
      delayStatus: "asap",
      description: "6 spots LED, IP65, alimentation depuis cuisine.",
      summary: "6 spots LED, IP65, alimentation depuis cuisine.",
      schedule: sched(3, "hours", 4),
    },
    {
      id: "ld-12",
      clientName: "Henri Vidal",
      clientPhone: "+33655667788",
      createdAt: daysAgo(11),
      workType: "Débouchage canalisation",
      zone: "L'Haÿ-les-Roses (94240)",
      delayStatus: "urgent",
      description: "WC bouché R+1, accès facile, intervention rapide.",
      summary: "WC bouché R+1, accès facile, intervention rapide.",
    },
    {
      id: "ld-13",
      clientName: "Chloé Bernard",
      clientPhone: "+33788990011",
      createdAt: daysAgo(12),
      workType: "Domotique volets roulants",
      zone: "Sceaux (92330)",
      delayStatus: "info",
      description: "3 volets, motorisation existante à remplacer.",
      summary: "3 volets, motorisation existante à remplacer.",
    },
    {
      id: "ld-14",
      clientName: "Yann Moreau",
      clientPhone: "+33600112233",
      createdAt: daysAgo(13),
      workType: "Rénovation salle de bain",
      zone: "Antony (92160)",
      delayStatus: "planned",
      description: "Dépose complète, plomberie + électricité, surface 6 m².",
      summary: "Dépose complète, plomberie + électricité, surface 6 m².",
    },
    {
      id: "ld-15",
      clientName: "Isabelle Roche",
      clientPhone: "+33633442211",
      createdAt: daysAgo(14),
      workType: "Pose parquet chambre",
      zone: "Fresnes (94260)",
      delayStatus: "asap",
      description: "Parquet flottant 14 m², sous-couche incluse.",
      summary: "Parquet flottant 14 m², sous-couche incluse.",
    },
    {
      id: "ld-16",
      clientName: "David Nguyen",
      clientPhone: "+33755667788",
      createdAt: daysAgo(15),
      workType: "Climatisation split",
      zone: "Cachan (94230)",
      delayStatus: "info",
      description: "Pièce 20 m², mur extérieur, demande devis pose.",
      summary: "Pièce 20 m², mur extérieur, demande devis pose.",
    },
    {
      id: "ld-17",
      clientName: "Fatima El Amrani",
      clientPhone: "+33677880099",
      createdAt: daysAgo(16),
      workType: "Mise en sécurité installation",
      zone: "Antony (92160)",
      delayStatus: "urgent",
      description: "Prises sans terre détectées, logement locatif.",
      summary: "Prises sans terre détectées, logement locatif.",
    },
    {
      id: "ld-18",
      clientName: "Lucas Girard",
      clientPhone: "+33688991100",
      createdAt: daysAgo(17),
      workType: "Carrelage sol entrée",
      zone: "Massy (91300)",
      delayStatus: "planned",
      description: "Carrelage 60×60, surface 8 m², ragréage nécessaire.",
      summary: "Carrelage 60×60, surface 8 m², ragréage nécessaire.",
    },
  ];

  return rows.map((lead, index) => {
    const withVoice = applyGeneratedVoice(lead);
    return {
      ...withVoice,
      requestNumber: 3801 + index,
      contactStatus: "pending" as const,
      workflowStatus:
        lead.id === "ld-17"
          ? ("archived" as const)
          : lead.id === "ld-14"
            ? ("done" as const)
            : ("active" as const),
    };
  });
}

export async function getWorkspaceLeads(_workspaceId: string): Promise<DashboardLead[]> {
  await Promise.resolve();
  return buildDemoLeads();
}
