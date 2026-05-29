"use client";

import { useState } from "react";
import { LuFacebook, LuGlobe, LuInstagram } from "react-icons/lu";
import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { OnboardingImportSkeleton } from "@/components/onboarding/OnboardingImportSkeleton";
import { GlowButton } from "@/components/ui/GlowButton";
import { simulateProImport } from "@/lib/onboarding/simulateProImport";
import type { OnboardingProfileDraft } from "@/domain/onboarding";

type OnboardingProImportStepProps = {
  copy: OnboardingDictionary;
  profile: OnboardingProfileDraft;
  onImported: (patch: Partial<OnboardingProfileDraft>) => void;
  onManual: () => void;
};

const PLATFORMS: {
  id: ProImportPlatform;
  labelKey: "platformGoogle" | "platformInstagram" | "platformFacebook";
  placeholderKey: "placeholderGoogle" | "placeholderInstagram" | "placeholderFacebook";
  Icon: typeof LuGlobe;
}[] = [
  {
    id: "google",
    labelKey: "platformGoogle",
    placeholderKey: "placeholderGoogle",
    Icon: LuGlobe,
  },
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

export function OnboardingProImportStep({
  copy,
  profile,
  onImported,
  onManual,
}: OnboardingProImportStepProps) {
  const imp = copy.import;
  const [platform, setPlatform] = useState<ProImportPlatform>(
    profile.importPlatform ?? "instagram",
  );
  const [identifier, setIdentifier] = useState(profile.importIdentifier ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = PLATFORMS.find((p) => p.id === platform) ?? PLATFORMS[0];

  const handleGenerate = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await simulateProImport(platform, identifier);
      onImported({ ...result.profile, plan: "PRO" });
    } catch {
      setError(imp.importError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <OnboardingImportSkeleton hint={imp.loadingHint} />;
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-black">{imp.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">{imp.lead}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex shrink-0 gap-1.5 sm:flex-col sm:gap-2">
          {PLATFORMS.map(({ id, labelKey, Icon }) => {
            const selected = platform === id;
            return (
              <button
                key={id}
                type="button"
                title={imp[labelKey]}
                onClick={() => setPlatform(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-semibold transition sm:flex-none sm:px-4 ${
                  selected
                    ? "border-black bg-black text-white"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">{imp[labelKey]}</span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0 flex-1">
          <label className="sr-only" htmlFor="import-identifier">
            {imp.identifierLabel}
          </label>
          <input
            id="import-identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder={imp[active.placeholderKey]}
            className={`${authFieldClassName} mt-0`}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <GlowButton
        type="button"
        onClick={() => void handleGenerate()}
        className="w-full justify-center"
      >
        {imp.generate}
      </GlowButton>

      <button
        type="button"
        onClick={onManual}
        className="mx-auto block text-sm font-medium text-neutral-500 underline-offset-2 hover:text-black hover:underline"
      >
        {imp.manualLink}
      </button>
    </div>
  );
}
