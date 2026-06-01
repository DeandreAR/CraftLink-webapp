"use client";

import { useCallback, useState, type CSSProperties } from "react";
import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { OnboardingImportSkeleton } from "@/components/onboarding/OnboardingImportSkeleton";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  runProImportPipeline,
  type ProImportPipelineResult,
} from "@/lib/onboarding/proImport/runProImport";

type ProB2BImportPanelProps = {
  copy: OnboardingDictionary;
  onSuccess: (result: ProImportPipelineResult) => void;
  onError: (message: string) => void;
};

const PLATFORMS: ProImportPlatform[] = ["google", "instagram", "facebook"];

export function ProB2BImportPanel({ copy, onSuccess, onError }: ProB2BImportPanelProps) {
  const imp = copy.import;
  const [platform, setPlatform] = useState<ProImportPlatform>("google");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [brandColor, setBrandColor] = useState<string | null>(null);

  const placeholder =
    platform === "google"
      ? imp.placeholderGoogle
      : platform === "instagram"
        ? imp.placeholderInstagram
        : imp.placeholderFacebook;

  const platformLabel = (p: ProImportPlatform) => {
    if (p === "google") return imp.platformGoogle;
    if (p === "instagram") return imp.platformInstagram;
    return imp.platformFacebook;
  };

  const handleGenerate = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setBrandColor(null);
    try {
      const result = await runProImportPipeline(platform, identifier);
      setBrandColor(result.brandColor);
      onSuccess(result);
    } catch {
      onError(imp.importError);
    } finally {
      setLoading(false);
    }
  }, [loading, platform, identifier, imp.importError, onSuccess, onError]);

  if (loading) {
    return <OnboardingImportSkeleton hint={imp.loadingHint} />;
  }

  const panelStyle: CSSProperties | undefined = brandColor
    ? ({ ["--primary-color" as string]: brandColor } as CSSProperties)
    : undefined;

  return (
    <div className="space-y-4" style={panelStyle}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="pro-import-platform">
          {imp.platformLabel}
        </label>
        <select
          id="pro-import-platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as ProImportPlatform)}
          className={`${authFieldClassName} mt-0 shrink-0 sm:max-w-[240px]`}
        >
          {PLATFORMS.map((id) => (
            <option key={id} value={id}>
              {platformLabel(id)}
            </option>
          ))}
        </select>

        <input
          id="pro-import-identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleGenerate();
            }
          }}
          placeholder={placeholder}
          aria-label={imp.identifierLabel}
          className={`${authFieldClassName} mt-0 min-w-0 flex-1`}
        />
      </div>

      <GlowButton
        type="button"
        onClick={() => void handleGenerate()}
        className="w-full justify-center"
        style={
          brandColor
            ? { backgroundColor: "var(--primary-color)", borderColor: "var(--primary-color)" }
            : undefined
        }
      >
        {imp.generate}
      </GlowButton>
    </div>
  );
}
