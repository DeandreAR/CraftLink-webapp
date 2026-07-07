"use client";

import { LuPenLine, LuSparkles } from "react-icons/lu";
import type { OnboardingDictionary } from "@/i18n/types";
import { ProB2BImportPanel } from "@/components/onboarding/pro/ProB2BImportPanel";
import type { ProImportPipelineResult } from "@/lib/onboarding/proImport/runProImport";

type OnboardingProChoiceStepProps = {
  copy: OnboardingDictionary;
  onStartManual: () => void;
  onImportSuccess: (result: ProImportPipelineResult) => void;
  onImportError: (message: string) => void;
  onImportFallbackToManual: () => void;
};

export function OnboardingProChoiceStep({
  copy,
  onStartManual,
  onImportSuccess,
  onImportError,
  onImportFallbackToManual,
}: OnboardingProChoiceStepProps) {
  const p = copy.pro;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-black">{p.choiceTitle}</h2>
        <p className="mt-1 text-sm text-neutral-600">{p.choiceSubtitle}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <LuSparkles className="h-5 w-5 shrink-0 text-[#EFA188]" aria-hidden />
            <h3 className="text-base font-bold text-neutral-900">{p.autoCardTitle}</h3>
          </div>
          <p className="mb-4 text-sm text-neutral-600">{p.autoCardHint}</p>
          <ProB2BImportPanel
            copy={copy}
            onSuccess={onImportSuccess}
            onError={onImportError}
            onFallbackToManual={onImportFallbackToManual}
          />
        </article>

        <button
          type="button"
          onClick={onStartManual}
          className="flex flex-col rounded-[24px] border-2 border-neutral-200 bg-neutral-50/80 p-5 text-left transition hover:border-neutral-400 hover:bg-white hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <LuPenLine className="h-5 w-5 text-neutral-700" aria-hidden />
            <h3 className="text-base font-bold text-neutral-900">{p.manualCardTitle}</h3>
          </div>
          <p className="mt-2 flex-1 text-sm text-neutral-600">{p.manualCardHint}</p>
          <span className="mt-4 text-sm font-semibold text-[#c45c3e]">{p.manualCardCta}</span>
        </button>
      </div>
    </div>
  );
}
