import type { VitrineDictionary } from "@/i18n/types";

export const vitrineFr: VitrineDictionary = {
  details: {
    back: "Retour à la présentation",
    servicesTitle: "Prestations",
    servicesHint: "Sélectionnez ce qui correspond à votre besoin",
    captureTitle: "Votre demande",
  },
  form: {
    fullName: "Votre nom",
    fullNamePlaceholder: "Jean Dupont",
    phone: "Téléphone",
    phonePlaceholder: "06 12 34 56 78",
    urgency: "Urgence",
    urgencyOptions: {
      urgent: "Urgent (sous 24h)",
      this_week: "Cette semaine",
      flexible: "Pas urgent",
    },
    project: "Décrivez votre besoin",
    projectPlaceholder: "Type de panne, surface, accès, contraintes…",
    collaborationToggle: "Je suis un pro, je souhaite collaborer",
    proCompanyName: "Nom de l’entreprise",
    proCompanyPlaceholder: "Raison sociale ou enseigne",
    proProject: "Projet de collaboration",
    proProjectPlaceholder: "Nature du partenariat, volume, calendrier…",
    submit: "Envoyer ma demande",
    submitting: "Envoi en cours…",
    successTitle: "Demande envoyée",
    successBody:
      "L’artisan a reçu votre demande structurée et vous recontacte rapidement.",
    errorTitle: "Envoi impossible",
    errorBody: "Vérifiez votre connexion et réessayez.",
    smsAck: "✓ Vous recevrez instantanément un SMS de confirmation dès validation.",
  },
  voice: {
    title: "Décrivez votre projet à la voix",
    record: "Enregistrer ma demande à la voix",
    recording: "Enregistrement en cours…",
    stop: "Appuyez pour terminer",
    added: "Message vocal enregistré",
  },
  services: {
    priceHt: "HT",
  },
  poweredBy: "Propulsé par CraftLink",
};
