/**
 * Types du concept Instagram — renvoyé tel quel par Gemini.
 * Le code n’impose aucun angle éditorial.
 */

export type CraftlinkInstagramConcept = {
  /** Nom artisan, ou "CraftLink" pour un post de marque */
  name: string;
  /** Métier, ou libellé court (ex. "Solution") */
  job: string;
  /** Phrase courte pour le visuel OG — max ~180 caractères */
  text_visuel: string;
  /** Légende Instagram complète */
  caption_insta: string;
};

export type PendingPostArtifacts = {
  stamp: string;
  imagePath: string;
  captionPath: string;
  concept: CraftlinkInstagramConcept;
};
