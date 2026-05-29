"use client";

import { useState } from "react";
import { LuFacebook, LuGlobe, LuInstagram, LuPenLine, LuSparkles } from "react-icons/lu";
import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";

type OnboardingProChoiceStepProps = {
  copy: OnboardingDictionary;
  onStartManual: () => void;
  onStartAuto: (platform: ProImportPlatform, identifier: string) => void;
};

const PLATFORMS: {
  id: ProImportPlatform;
  labelKey: "platformGoogle" | "platformInstagram" | "platformFacebook";
  placeholderKey: "placeholderGoogle" | "placeholderInstagram" | "placeholderFacebook";
  Icon: typeof LuGlobe;
}[] = [
  { id: "google", labelKey: "platformGoogle", placeholderKey: "placeholderGoogle", Icon: LuGlobe },
  {
    id: "instagram",
    labelKey: "platformInstagram",
    placeholderKey: "placeholderInstagram",
    Icon: LuInstagram,
  },
  {
    id: "facebook",
    labelKey: "platformFacebook",
    placeholderKey: "placeholderFacebook",
    Icon: LuFacebook,
  },
];

export function OnboardingProChoiceStep({
  copy,
  onStartManual,
  onStartAuto,
}: OnboardingProChoiceStepProps) {
  const p = copy.pro;
  const imp = copy.import;
  const [platform, setPlatform] = useState<ProImportPlatform>("instagram");
  const [identifier, setIdentifier] = useState("");

  const active = PLATFORMS.find((item) => item.id === platform) ?? PLATFORMS[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-black">{p.choiceTitle}</h2>
        <p className="mt-1 text-sm text-neutral-600">{p.choiceSubtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="flex flex-col rounded-[24px] border-2 border-black bg-black p-5 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <LuSparkles className="h-5 w-5 shrink-0 text-[#EFA188]" aria-hidden />
            <h3 className="text-base font-bold">{p.autoCardTitle}</h3>
          </div>
          <p className="mt-2 text-sm text-white/80">{p.autoCardHint}</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="flex shrink-0 gap-1.5">
              {PLATFORMS.map(({ id, labelKey, Icon }) => {
                const selected = platform === id;
                return (
                  <button
                    key={id}
                    type="button"
                    title={imp[labelKey]}
                    onClick={() => setPlatform(id)}
                    className={`flex items-center justify-center rounded-xl border px-3 py-2 transition ${
                      selected
                        ? "border-white bg-white text-black"
                        : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={imp[active.placeholderKey]}
              className={`${authFieldClassName} mt-0 border-white/20 bg-white/10 text-white placeholder:text-white/50`}
            />
          </div>

          <GlowButton
            type="button"
            onClick={() => onStartAuto(platform, identifier)}
            className="mt-4 w-full justify-center bg-white text-black hover:scale-[1.02]"
          >
            {imp.generate}
          </GlowButton>
        </article>

        <button
          type="button"
          onClick={onStartManual}
          className="flex flex-col rounded-[24px] border-2 border-neutral-200 bg-white p-5 text-left transition hover:border-neutral-400 hover:shadow-md"
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
