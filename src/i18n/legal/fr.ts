import type { LegalBundleDictionary } from "@/i18n/types";

export const legalFr: LegalBundleDictionary = {
  backToHome: "Retour à l’accueil",
  lastUpdated: "Dernière mise à jour",
  updatedDate: "22 mai 2026",
  pages: {
    mentionsLegales: {
      metaTitle: "Mentions légales — CraftLink",
      metaDescription:
        "Éditeur, hébergement et responsabilité du site CraftLink.",
      title: "Mentions légales",
      intro:
        "Conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN).",
      sections: [
        {
          title: "Éditeur du site",
          paragraphs: [
            "Le site craftlink (ci-après « le Site ») est édité par CraftLink, solution SaaS de vitrine et capture de leads pour artisans.",
            "Contact : contact@getcraftlink.com",
            "Statut juridique : société en cours d’immatriculation — les informations définitives (forme, capital, RCS) seront complétées dès immatriculation.",
          ],
        },
        {
          title: "Directeur de la publication",
          paragraphs: ["Le directeur de la publication est le représentant légal de CraftLink."],
        },
        {
          title: "Hébergement",
          paragraphs: [
            "Le Site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.",
            "Les données applicatives (comptes, leads) peuvent être traitées via Supabase (UE / infrastructures conformes aux clauses contractuelles types lorsque applicable).",
          ],
        },
        {
          title: "Propriété intellectuelle",
          paragraphs: [
            "L’ensemble des éléments du Site (textes, visuels, logo, structure, code) est protégé. Toute reproduction non autorisée est interdite.",
          ],
        },
        {
          title: "Responsabilité",
          paragraphs: [
            "CraftLink s’efforce d’assurer l’exactitude des informations publiées. L’éditeur ne saurait être tenu responsable des dommages liés à l’usage du Site ou à l’indisponibilité temporaire du service.",
          ],
        },
        {
          title: "Liens hypertextes",
          paragraphs: [
            "Le Site peut contenir des liens vers des sites tiers ; CraftLink n’exerce aucun contrôle sur leur contenu.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [
            "Pour toute question relative au Site : contact@getcraftlink.com",
          ],
        },
      ],
    },
    privacy: {
      metaTitle: "Politique de confidentialité — CraftLink",
      metaDescription:
        "RGPD : finalités, bases légales, durées de conservation et droits des personnes concernées.",
      title: "Politique de confidentialité",
      intro:
        "CraftLink s’engage à protéger les données personnelles conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.",
      sections: [
        {
          title: "Responsable de traitement",
          paragraphs: [
            "CraftLink agit en qualité de responsable de traitement pour les données collectées via le Site et l’espace artisan.",
            "Contact données personnelles : contact@getcraftlink.com",
          ],
        },
        {
          title: "Données collectées",
          list: [
            "Données d’identification artisan : nom, e-mail, téléphone, activité.",
            "Données de leads clients : coordonnées, description du besoin, zone, urgence, enregistrements vocaux le cas échéant.",
            "Données techniques : logs, adresse IP, identifiants de session, cookies (voir politique cookies).",
          ],
        },
        {
          title: "Finalités et bases légales",
          list: [
            "Fourniture du service (compte, page pro, capture de demandes) — exécution du contrat.",
            "Support et sécurité — intérêt légitime.",
            "Facturation et obligations légales — obligation légale.",
            "Mesure d’audience (si acceptée) — consentement.",
            "Prospection B2B limitée — intérêt légitime ou consentement selon le canal.",
          ],
        },
        {
          title: "Durées de conservation",
          list: [
            "Compte artisan actif : durée du contrat + 3 ans à des fins de preuve et relation client.",
            "Leads : selon paramètres du compte, 24 mois par défaut sauf suppression anticipée.",
            "Cookies : 13 mois maximum pour les traceurs soumis au consentement.",
            "Logs techniques : 12 mois.",
          ],
        },
        {
          title: "Destinataires et sous-traitants",
          paragraphs: [
            "Les données sont accessibles aux équipes habilitées de CraftLink et à nos sous-traitants (hébergement, base de données, transcription IA, messagerie) strictement pour les finalités décrites. Des garanties contractuelles (DPA / clauses types) sont mises en place lorsque requis.",
          ],
        },
        {
          title: "Transferts hors UE",
          paragraphs: [
            "Lorsque des outils impliquent un transfert hors Union européenne, CraftLink s’assure de mécanismes appropriés (décision d’adéquation, clauses contractuelles types, mesures complémentaires).",
          ],
        },
        {
          title: "Vos droits",
          list: [
            "Droit d’accès, de rectification, d’effacement, de limitation et d’opposition.",
            "Droit à la portabilité lorsque applicable.",
            "Droit de retirer votre consentement à tout moment (cookies, prospection).",
            "Droit d’introduire une réclamation auprès de la CNIL (www.cnil.fr).",
          ],
          paragraphs: [
            "Pour exercer vos droits : contact@getcraftlink.com — nous répondons sous un délai d’un mois.",
          ],
        },
        {
          title: "Sécurité",
          paragraphs: [
            "Mesures organisationnelles et techniques : chiffrement en transit (HTTPS), contrôle d’accès, sauvegardes, journalisation.",
          ],
        },
        {
          title: "Mineurs",
          paragraphs: [
            "Le service s’adresse aux professionnels. Nous ne collectons pas sciemment de données concernant des mineurs.",
          ],
        },
      ],
    },
    cookies: {
      metaTitle: "Politique cookies — CraftLink",
      metaDescription:
        "Types de cookies, finalités, durée et gestion de votre consentement.",
      title: "Politique cookies",
      intro:
        "Lors de votre visite, des traceurs peuvent être déposés sur votre terminal. Vous pouvez accepter, refuser ou paramétrer les cookies non essentiels via le bandeau affiché sur le Site.",
      sections: [
        {
          title: "Qu’est-ce qu’un cookie ?",
          paragraphs: [
            "Un cookie est un petit fichier texte enregistré sur votre appareil. Des technologies similaires (localStorage, pixels) peuvent être utilisées avec les mêmes finalités.",
          ],
        },
        {
          title: "Cookies strictement nécessaires",
          paragraphs: [
            "Indispensables au fonctionnement du Site (session, sécurité, mémorisation de vos choix cookies). Ils ne requièrent pas de consentement.",
          ],
          list: [
            "craftlink_cookie_consent — mémorise votre choix — 13 mois — CraftLink",
          ],
        },
        {
          title: "Cookies de mesure d’audience",
          paragraphs: [
            "Déposés uniquement si vous les acceptez. Ils permettent de comprendre l’usage du Site (pages vues, parcours) afin d’améliorer le service.",
          ],
          list: [
            "Outils analytics (ex. solution privacy-friendly ou Google Analytics si activé) — durée selon l’outil — voir bandeau de consentement.",
          ],
        },
        {
          title: "Cookies marketing",
          paragraphs: [
            "Déposés uniquement si vous les acceptez. Ils servent à mesurer l’efficacité de campagnes ou à proposer du contenu personnalisé.",
          ],
        },
        {
          title: "Gérer vos préférences",
          paragraphs: [
            "Vous pouvez modifier votre choix à tout moment en supprimant le stockage local du navigateur ou en rouvrant le panneau depuis le lien « Cookies » en pied de page.",
            "Vous pouvez aussi configurer votre navigateur pour bloquer les cookies.",
          ],
        },
      ],
    },
    terms: {
      metaTitle: "Conditions générales d’utilisation — CraftLink",
      metaDescription:
        "CGU du service CraftLink : objet, accès, obligations et responsabilités.",
      title: "Conditions générales d’utilisation (CGU)",
      intro:
        "Les présentes CGU régissent l’accès et l’utilisation du service CraftLink par les artisans et visiteurs du Site.",
      sections: [
        {
          title: "Objet",
          paragraphs: [
            "CraftLink fournit une page professionnelle, un lien unique de capture (texte et vocal), un classement des demandes et des redirections vers les messageries de l’artisan.",
          ],
        },
        {
          title: "Accès au service",
          paragraphs: [
            "L’inscription implique la fourniture d’informations exactes. L’artisan est responsable de la confidentialité de ses identifiants.",
          ],
        },
        {
          title: "Obligations de l’artisan",
          list: [
            "Utiliser le service conformément aux lois en vigueur et aux droits des clients.",
            "Obtenir les autorisations nécessaires pour enregistrer et traiter les données de ses prospects.",
            "Ne pas publier de contenus illicites, trompeurs ou portant atteinte à des tiers.",
          ],
        },
        {
          title: "Données et contenus",
          paragraphs: [
            "L’artisan reste responsable des données qu’il collecte via sa page. CraftLink agit comme sous-traitant pour le traitement des leads selon les conditions contractuelles et la politique de confidentialité.",
          ],
        },
        {
          title: "Tarification",
          paragraphs: [
            "Les offres Essentiel, Pro et Options sont décrites sur le Site. CraftLink peut faire évoluer ses tarifs avec information préalable des abonnés.",
          ],
        },
        {
          title: "Disponibilité",
          paragraphs: [
            "CraftLink vise une haute disponibilité sans garantie d’absence d’interruption. Des maintenances peuvent être programmées.",
          ],
        },
        {
          title: "Propriété intellectuelle",
          paragraphs: [
            "CraftLink concède une licence d’usage non exclusive de la plateforme. Les contenus fournis par l’artisan lui restent propriétaires ; il accorde à CraftLink les droits nécessaires à l’hébergement et à l’affichage.",
          ],
        },
        {
          title: "Responsabilité",
          paragraphs: [
            "CraftLink n’est pas partie aux relations contractuelles entre l’artisan et son client final. La responsabilité de CraftLink est limitée aux dommages directs, dans la limite des montants payés sur les 12 derniers mois, sauf faute lourde ou dol.",
          ],
        },
        {
          title: "Résiliation",
          paragraphs: [
            "L’artisan peut résilier son abonnement selon les modalités indiquées à l’inscription. CraftLink peut suspendre un compte en cas de violation grave des CGU.",
          ],
        },
        {
          title: "Droit applicable",
          paragraphs: [
            "Les CGU sont soumises au droit français. En cas de litige, les tribunaux français seront compétents, sous réserve des règles impératives applicables aux consommateurs le cas échéant.",
          ],
        },
        {
          title: "Contact",
          paragraphs: ["contact@getcraftlink.com"],
        },
      ],
    },
  },
};
