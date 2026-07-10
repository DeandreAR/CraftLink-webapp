import type { OnboardingPlan } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";

type OnboardingPlanBadgeProps = {
  plan: OnboardingPlan;
  copy: OnboardingDictionary;
  locked?: boolean;
  onPlanChange: (plan: OnboardingPlan) => void;
};

export function OnboardingPlanBadge({
  plan,
  copy,
  locked = false,
  onPlanChange,
}: OnboardingPlanBadgeProps) {
  const b = copy.badge;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
      <p className="text-sm font-semibold text-neutral-800">
        {b.label}{" "}
        <span className="text-black">
          {plan === "FREE" ? b.essential : b.pro}
        </span>
      </p>
      {locked ? (
        <span className="rounded-xl border border-neutral-200 bg-white px-3 py-1.5 text-xs font-bold text-black">
          {copy.plan.pro}
        </span>
      ) : (
        <div className="flex rounded-xl border border-neutral-200 bg-white p-0.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => onPlanChange("FREE")}
            className={`rounded-lg px-3 py-1.5 transition ${
              plan === "FREE" ? "bg-black text-white" : "text-neutral-600 hover:text-black"
            }`}
          >
            {copy.plan.free}
          </button>
          <button
            type="button"
            onClick={() => onPlanChange("PRO")}
            className={`rounded-lg px-3 py-1.5 transition ${
              plan === "PRO" ? "bg-black text-white" : "text-neutral-600 hover:text-black"
            }`}
          >
            {copy.plan.pro}
          </button>
        </div>
      )}
    </div>
  );
}
