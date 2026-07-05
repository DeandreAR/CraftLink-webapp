"use client";

import { useCallback, useState, type CSSProperties } from "react";
import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { OnboardingImportSkeleton } from "@/components/onboarding/OnboardingImportSkeleton";
import { LandingCta } from "@/components/landing/LandingCta";
import { SERVER_CONFIG_ERROR } from "@/lib/onboarding/proImport/api/constants";
import { isProImportDegradedError } from "@/lib/onboarding/proImport/api/clientErrors";
import {
  runProImportPipeline,
  type ProImportPipelineResult,
} from "@/lib/onboarding/proImport/runProImport";

type ProB2BImportPanelProps = {
  copy: OnboardingDictionary;
  onSuccess: (result: ProImportPipelineResult) => void;
  onError: (message: string) => void;
  /** Bascule fluide vers le parcours manuel (quota API / réseau). */
  onFallbackToManual: () => void;
};

const PLATFORMS: ProImportPlatform[] = ["google", "instagram", "facebook"];

export function ProB2BImportPanel({
  copy,
  onSuccess,
  onError,
  onFallbackToManual,
}: ProB2BImportPanelProps) {
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
    } catch (error) {
      if (isProImportDegradedError(error)) {
        onFallbackToManual();
        return;
      }
      const message =
        error instanceof Error && error.message === SERVER_CONFIG_ERROR
          ? imp.serverConfigError
          : error instanceof Error
            ? error.message
            : imp.importError;
      onError(message);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    platform,
    identifier,
    imp.importError,
    imp.serverConfigError,
    onSuccess,
    onError,
    onFallbackToManual,
  ]);

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

      {platform === "google" ? (
        <p className="text-xs text-neutral-600">{imp.googleImportHint}</p>
      ) : null}

      <LandingCta
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
      </LandingCta>
    </div>
  );
}
