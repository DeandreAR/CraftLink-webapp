@AGENTS.md
🏗️ CraftLink - Project Context & Rules
1. Vision & Produit
Objectif : SaaS de vitrine express pour artisans. Transformer les réseaux sociaux (Instagram, Facebook) en leads qualifiés.

Promesse : Une page pro prête en 2 minutes via un lien unique.

Tunnel de Capture Hybride : Le client peut envoyer un Vocal (transcrit par IA) OU du Texte.

Action : Redirection intelligente vers WhatsApp, SMS ou Appel avec le dossier client déjà structuré (Zone, Urgence, Projet).

2. Tech Stack & Standards (SOLID)
Framework : Next.js 14 (App Router).

Langage : TypeScript (Type-safe obligatoire).

Database & Auth : Supabase.

Style : Tailwind CSS + Framer Motion (pour les animations Bento).

Architecture : * Respecter les principes SOLID.

Séparer la logique métier (Services) des composants UI.

Clean Architecture : éviter l'over-engineering mais garantir l'extensibilité.

3. Design System (Mokaform Premium)
Esthétique : Minimaliste SaaS Web 3.0, Grid Bento, coins arrondis (24px-32px).

Couleurs :

Fond : Blanc pur (#FFFFFF).

Accent : #EFA188 (Pêche/Corail) pour les surlignages et accents.

CTA : Noir pur (#000000) avec texte blanc (Contraste fort).

Pastels : Menthe (#B2F5EA) et Lavande (#D6BCFA) pour les cartes de bénéfices.

Composants clés : Highlighter (effet marqueur), BentoCard, GlowButton.

4. Roadmap & Features (À garder en mémoire)
MVP 1 : Capture vocale/texte, Scoring IA, Redirection WhatsApp.

Prochainement : * Relanceur automatique (SMS après 24h).

QR Codes pour véhicules (Smart-Van).

Sync Portfolio Instagram.

Paiement d'acomptes via Stripe.

5. Instructions pour Cursor
Ton : Agis en tant que co-fondateur technique. Sois pragmatique, direct et critique.

Règle d'or : Ne jamais sacrifier la clarté pour le SEO. L'artisan doit comprendre l'outil en 15 secondes.

i18n : Le projet est multilingue (fr/en). Toujours utiliser les dictionnaires JSON pour les textes.

supprime toujours les composants non utilisés