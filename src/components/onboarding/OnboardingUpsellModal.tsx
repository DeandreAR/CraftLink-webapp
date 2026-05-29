"use client";

import type { OnboardingPlan } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { GlowButton } from "@/components/ui/GlowButton";

type OnboardingUpsellModalProps = {
  open: boolean;
  copy: OnboardingDictionary;
  onClose: () => void;
  onChoose: (plan: OnboardingPlan) => void;
  loading?: boolean;
};

export function OnboardingUpsellModal({
  open,
  copy,
  onClose,
  onChoose,
  loading = false,
}: OnboardingUpsellModalProps) {
  if (!open) return null;

  const u = copy.upsell;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upsell-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
        <h2 id="upsell-title" className="text-xl font-bold text-black">
          {u.title}
        </h2>
        <p className="mt-2 text-sm text-neutral-600">{u.subtitle}</p>

        <div className="mt-6 grid gap-4">
          <article className="rounded-[24px] border-2 border-neutral-200 p-5">
            <h3 className="text-base font-bold">{u.essentialName}</h3>
            <p className="mt-1 text-2xl font-extrabold">{u.essentialPrice}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-neutral-600">
              {u.essentialFeatures.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
            <GlowButton
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={() => onChoose("FREE")}
              className="mt-4 w-full justify-center"
            >
              {u.chooseEssential}
            </GlowButton>
          </article>

          <article className="rounded-[24px] border-2 border-black bg-black p-5 text-white">
            <h3 className="text-base font-bold">{u.proName}</h3>
            <p className="mt-1 text-2xl font-extrabold">{u.proPrice}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-white/85">
              {u.proFeatures.map((f) => (
                <li key={f}>· {f}</li>
              ))}
            </ul>
            <GlowButton
              type="button"
              disabled={loading}
              onClick={() => onChoose("PRO")}
              className="mt-4 w-full justify-center bg-white text-black hover:scale-[1.02]"
            >
              {u.choosePro}
            </GlowButton>
          </article>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="mt-4 w-full text-center text-sm text-neutral-500 hover:text-black"
        >
          {u.cancel}
        </button>
      </div>
    </div>
  );
}
