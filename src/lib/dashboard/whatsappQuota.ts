import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { isCraftlinkPro } from "@/domain/craftlinkPlan";

/** Limite mensuelle de clics WhatsApp sur le plan Essentiel. */
export const ESSENTIAL_WHATSAPP_CLICK_LIMIT = 10;

export function currentWhatsappMonthKey(): string {
  const now = new Date();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${now.getUTCFullYear()}-${month}`;
}

export function normalizeWhatsappClickCount(
  clicks: number,
  storedMonthKey: string | null | undefined,
): number {
  if (!storedMonthKey || storedMonthKey !== currentWhatsappMonthKey()) {
    return 0;
  }
  return Math.max(0, clicks);
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
