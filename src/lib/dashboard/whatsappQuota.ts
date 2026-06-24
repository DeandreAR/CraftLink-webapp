import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { isCraftlinkPro } from "@/domain/craftlinkPlan";

/** Limite mensuelle de partages WhatsApp sur le plan Essentiel. */
export const ESSENTIAL_WHATSAPP_CLICK_LIMIT = 10;

/** Clé mois locale (YYYY-MM) — alignée fuseau artisan. */
export function currentWhatsappMonthKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function normalizeWhatsappClickCount(
  clicks: number,
  storedMonthKey: string | null | undefined,
): number {
  const safe = Number.isFinite(clicks) ? Math.max(0, clicks) : 0;
  if (!storedMonthKey || storedMonthKey !== currentWhatsappMonthKey()) {
    return 0;
  }
  return safe;
}

export function canOpenWhatsAppContact(
  plan: CraftlinkPlan,
  clicksThisMonth: number,
): boolean {
  if (isCraftlinkPro(plan)) return true;
  return clicksThisMonth < ESSENTIAL_WHATSAPP_CLICK_LIMIT;
}

export function whatsappClicksRemaining(
  plan: CraftlinkPlan,
  clicksThisMonth: number,
): number | null {
  if (isCraftlinkPro(plan)) return null;
  return Math.max(0, ESSENTIAL_WHATSAPP_CLICK_LIMIT - clicksThisMonth);
}

export function isWhatsAppQuotaExhausted(
  plan: CraftlinkPlan,
  clicksThisMonth: number,
): boolean {
  return !canOpenWhatsAppContact(plan, clicksThisMonth);
}
