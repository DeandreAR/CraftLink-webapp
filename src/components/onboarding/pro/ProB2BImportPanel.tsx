"use client";

import { useCallback, useMemo, useState, type CSSProperties } from "react";
import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { OnboardingImportSkeleton } from "@/components/onboarding/OnboardingImportSkeleton";
import { LandingCta } from "@/components/landing/LandingCta";
import { isProImportDegradedError } from "@/lib/onboarding/proImport/api/clientErrors";
import { MAX_MAGIC_IMPORT_SUCCESS } from "@/lib/onboarding/proImport/api/magicImportQuota";
import { resolveImportClientMessage } from "@/lib/onboarding/proImport/resolveImportClientMessage";
import {
  runProImportPipeline,
  type ProImportPipelineResult,
} from "@/lib/onboarding/proImport/runProImport";

type ProB2BImportPanelProps = {
  copy: OnboardingDictionary;
  magicImportSuccessCount?: number;
  onSuccess: (result: ProImportPipelineResult) => void;
  onError: (message: string) => void;
  onFallbackToManual: () => void;
};

const PLATFORMS: ProImportPlatform[] = ["google", "instagram", "facebook"];

export function ProB2BImportPanel({
  copy,
  magicImportSuccessCount = 0,
  onSuccess,
  onError,
  onFallbackToManual,
}: ProB2BImportPanelProps) {
  const imp = copy.import;
  const [platform, setPlatform] = useState<ProImportPlatform>("google");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [brandColor, setBrandColor] = useState<string | null>(null);
  const [localUsed, setLocalUsed] = useState(magicImportSuccessCount);

  const importsRemaining = useMemo(
    () => Math.max(0, MAX_MAGIC_IMPORT_SUCCESS - localUsed),
    [localUsed],
  );
  const canImport = importsRemaining > 0;

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
    if (loading || !canImport) return;
    setLoading(true);
    setBrandColor(null);
    try {
      const result = await runProImportPipeline(platform, identifier);
      setBrandColor(result.brandColor);
      if (result.magicImportSuccessCount != null) {
        setLocalUsed(result.magicImportSuccessCount);
      } else {
        setLocalUsed((prev) => Math.min(MAX_MAGIC_IMPORT_SUCCESS, prev + 1));
      }
      onSuccess(result);
    } catch (error) {
      if (isProImportDegradedError(error)) {
        onError(resolveImportClientMessage(platform, error, imp));
        onFallbackToManual();
        return;
      }
      onError(resolveImportClientMessage(platform, error, imp));
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    canImport,
    platform,
    identifier,
    imp,
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
      <p className="text-xs text-neutral-600">
        {imp.importRemainingHint.replace("{count}", String(importsRemaining))}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <label className="sr-only" htmlFor="pro-import-platform">
          {imp.platformLabel}
        </label>
        <select
          id="pro-import-platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as ProImportPlatform)}
          disabled={!canImport}
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
          disabled={!canImport}
          placeholder={placeholder}
          aria-label={imp.identifierLabel}
          className={`${authFieldClassName} mt-0 min-w-0 flex-1`}
        />
      </div>

      {platform === "google" ? (
        <p className="text-xs text-neutral-600">{imp.googleImportHint}</p>
      ) : null}

      {!canImport ? (
        <p className="text-sm font-medium text-neutral-700">{imp.importQuotaExceeded}</p>
      ) : null}

      <LandingCta
        type="button"
        onClick={() => void handleGenerate()}
        disabled={!canImport}
        className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
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
