import type { DashboardLead } from "@/domain/lead";
import type { LeadSchedule } from "@/domain/lead";

type DemoLeadRow = Omit<DashboardLead, "workflowStatus" | "requestNumber">;

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
      clientPhone: "+33612030405",
      createdAt: daysAgo(0),
      workType: "Mise aux normes tableau électrique",
      zone: "Antony (92160)",
      delayStatus: "asap",
      summary:
        "Appartement 65 m², disjoncteur qui saute au four. Souhaite un devis avant vendredi.",
      schedule: sched(2, "hours", 3),
    },
    {
      id: "ld-02",
      clientName: "Karim Benali",
      clientPhone: "+33698765432",
      createdAt: daysAgo(1),
      workType: "Dépannage fuite sous évier",
      zone: "Massy (91300)",
      delayStatus: "urgent",
      summary: "Fuite active cuisine, accès facile, disponible cet après-midi.",
      schedule: sched(0, "half_day"),
    },
    {
      id: "ld-03",
      clientName: "Claire Dupont",
      clientPhone: "+33745112233",
      createdAt: daysAgo(2),
      workType: "Pose de 4 prises supplémentaires",
      zone: "Sceaux (92330)",
      delayStatus: "planned",
      summary: "Rénovation salon, perçage cloison placo, créneau semaine prochaine.",
      schedule: sched(7, "full_day"),
    },
    {
      id: "ld-04",
      clientName: "Thomas Leroy",
      clientPhone: "+33655443322",
      createdAt: daysAgo(3),
      workType: "Installation borne IRVE",
      zone: "Palaiseau (91120)",
      delayStatus: "info",
      summary: "Garage individuel, distance tableau 8 m, demande info aides.",
    },
    {
      id: "ld-05",
      clientName: "Nadia Rousseau",
      clientPhone: "+33677889900",
      createdAt: daysAgo(4),
      workType: "Recherche de panne partielle",
      zone: "Fontenay-aux-Roses (92260)",
      delayStatus: "urgent",
      summary: "Plus de lumière chambre et SDB, disjoncteur OK.",
      schedule: sched(1, "minutes", 90),
    },
    {
      id: "ld-06",
      clientName: "Philippe Garnier",
      clientPhone: "+33633445566",
      createdAt: daysAgo(5),
      workType: "Remplacement chauffe-eau",
      zone: "Châtenay-Malabry (92290)",
      delayStatus: "asap",
      summary: "Ballon 200 L, accès cave, évacuation ancien matériel souhaitée.",
    },
    {
      id: "ld-07",
      clientName: "Émilie Costa",
      clientPhone: "+33766778899",
      createdAt: daysAgo(6),
      workType: "Peinture murs salon",
      zone: "Antony (92160)",
      delayStatus: "planned",
      summary: "Surface ~35 m², préparation murs, teinte blanc cassé.",
    },
    {
      id: "ld-08",
      clientName: "Marc Olivier",
      clientPhone: "+33611223344",
      createdAt: daysAgo(7),
      workType: "Menuiserie — remplacement fenêtre",
      zone: "Bagneux (92220)",
      delayStatus: "info",
      summary: "Double vitrage PVC 120×140, RDC, devis comparatif.",
    },
    {
      id: "ld-09",
      clientName: "Julie Faure",
      clientPhone: "+33699887766",
      createdAt: daysAgo(8),
      workType: "Dépannage chauffage",
      zone: "Montrouge (92120)",
      delayStatus: "urgent",
      summary: "Radiateur salon froid, chaudière gaz en défaut.",
    },
    {
      id: "ld-10",
      clientName: "Ahmed Sy",
      clientPhone: "+33722334455",
      createdAt: daysAgo(9),
      workType: "Extension maçonnerie mur porteur",
      zone: "Wissous (91320)",
      delayStatus: "planned",
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
      summary: "Carrelage 60×60, surface 8 m², ragréage nécessaire.",
    },
  ];

  return rows.map((lead, index) => ({
    ...lead,
    requestNumber: 3801 + index,
    workflowStatus:
      lead.id === "ld-17"
        ? ("archived" as const)
        : lead.id === "ld-14"
          ? ("done" as const)
          : ("active" as const),
  }));
}

export async function getWorkspaceLeads(_workspaceId: string): Promise<DashboardLead[]> {
  await Promise.resolve();
  return buildDemoLeads();
}
