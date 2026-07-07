import type { CraftlinkPlan } from "@/domain/craftlinkPlan";

/** Rétention médias plan Essentiel (jours). */
export const ESSENTIAL_MEDIA_RETENTION_DAYS = 10;

/** Rétention médias plan Pro (jours). */
export const PRO_MEDIA_RETENTION_DAYS = 60;

function retentionDaysForPlan(plan: CraftlinkPlan): number {
  return plan === "PRO" ? PRO_MEDIA_RETENTION_DAYS : ESSENTIAL_MEDIA_RETENTION_DAYS;
}

/**
 * Indique si les fichiers médias (audio / photos) d'un lead sont expirés.
 * @returns `true` si la limite de rétention est dépassée.
 */
export function checkFileExpiration(
  createdAt: Date,
  plan: CraftlinkPlan,
  now: Date = new Date(),
): boolean {
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + retentionDaysForPlan(plan));
  return now.getTime() > expiresAt.getTime();
}

export function mediaRetentionDaysRemaining(
  createdAt: Date,
  plan: CraftlinkPlan,
  now: Date = new Date(),
): number {
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + retentionDaysForPlan(plan));
  const ms = expiresAt.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
