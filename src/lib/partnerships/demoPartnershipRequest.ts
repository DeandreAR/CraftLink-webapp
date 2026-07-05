import type { DashboardPartnershipRequest } from "@/domain/partnershipRequest";

export const DEMO_PARTNERSHIP_REQUEST_ID = "demo-partnership-01";

export function isDemoPartnershipRequest(id: string): boolean {
  return id.startsWith("demo-");
}

/** Demande fictive pour prévisualiser l’onglet Partenariats en développement. */
export function buildDemoPartnershipRequest(): DashboardPartnershipRequest {
  const createdAt = new Date(Date.now() - 2 * 86_400_000).toISOString();

  return {
    id: DEMO_PARTNERSHIP_REQUEST_ID,
    companyName: "Leroy Merlin Pro",
    contactName: "Camille Dupont",
    jobTitle: "Responsable partenariats artisans",
    email: "camille.dupont@leroymerlin.fr",
    phone: "+33 6 12 34 56 78",
    partnershipType: "advertising",
    budgetRange: "from_5k_to_15k",
    budgetApproximate: null,
    message:
      "Bonjour,\n\nNous lançons une campagne « Artisans de confiance » sur la région parisienne et votre vitrine correspond parfaitement à notre cible.\n\nNous aimerions un partenariat média : mise en avant de votre page sur notre newsletter Pro (12 000 abonnés) + un code promo exclusif pour vos clients.\n\nSeriez-vous disponible pour un échange de 20 min cette semaine ?\n\nBien cordialement,\nCamille",
    workflowStatus: "A_TRAITER",
    createdAt,
    updatedAt: createdAt,
  };
}
