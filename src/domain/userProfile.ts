/** Plan commercial CraftLink (dashboard & rétention médias). */
export type UserPlan = "ESSENTIEL" | "PRO";

/** Profil métier artisan pour quotas, restrictions et rétention. */
export interface UserProfile {
  plan: UserPlan;
  whatsappClicksThisMonth: number;
  voiceCaptureEnabled?: boolean;
}
