"use client";

import { StripeCheckoutButton } from "@/components/stripe/StripeCheckoutButton";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { authPath } from "@/lib/auth/paths";
import { ESSENTIAL_WHATSAPP_CLICK_LIMIT } from "@/lib/dashboard/whatsappQuota";

type WhatsAppUpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  copy: DashboardDictionary;
  locale: Locale;
  clicksUsed: number;
};

export function WhatsAppUpgradeModal({
  open,
  onClose,
  copy,
  locale,
  clicksUsed,
}: WhatsAppUpgradeModalProps) {
  const m = copy.leads.upgradeModal;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-upgrade-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-2xl border border-neutral-200 bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c45c3e]">
          {m.eyebrow}
        </p>
        <h2 id="whatsapp-upgrade-title" className="mt-2 text-xl font-bold text-black">
          {m.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {m.body.replace("{limit}", String(ESSENTIAL_WHATSAPP_CLICK_LIMIT))}
        </p>
        <p className="mt-3 rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-700">
          {m.usage
            .replace("{used}", String(clicksUsed))
            .replace("{limit}", String(ESSENTIAL_WHATSAPP_CLICK_LIMIT))}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-neutral-800">
          {m.proBenefits.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-[#25D366]" aria-hidden>
                ✓
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-2">
          <StripeCheckoutButton
            priceKey="pro_monthly"
            locale={locale}
            successPath={authPath(locale, "dashboard")}
            className="w-full justify-center"
          >
            {m.cta}
          </StripeCheckoutButton>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl py-2.5 text-sm font-medium text-neutral-500 hover:text-black"
          >
            {m.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
