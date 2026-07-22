"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import type { ProImportPlatform } from "@/domain/onboarding";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName } from "@/components/auth/authFormStyles";
import { OnboardingImportSkeleton } from "@/components/onboarding/OnboardingImportSkeleton";
import { LandingCta } from "@/components/landing/LandingCta";
import { isProImportDegradedError } from "@/lib/onboarding/proImport/api/clientErrors";
import { MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL } from "@/lib/ai/aiGenerationQuotaShared";
import { resolveImportClientMessage } from "@/lib/onboarding/proImport/resolveImportClientMessage";
import {
  runProImportPipeline,
  type ProImportPipelineResult,
} from "@/lib/onboarding/proImport/runProImport";

type ProB2BImportPanelProps = {
  copy: OnboardingDictionary;
  aiGenerationsCount?: number;
  /** @deprecated Préférer aiGenerationsCount */
  magicImportSuccessCount?: number;
  onSuccess: (result: ProImportPipelineResult) => void;
  onError: (message: string) => void;
  onFallbackToManual: () => void;
};

const PLATFORMS: ProImportPlatform[] = ["google", "instagram", "facebook"];

type ImportQuotaState = {
  used: number;
  remaining: number;
  max: number;
};

export function ProB2BImportPanel({
  copy,
  aiGenerationsCount,
  magicImportSuccessCount = 0,
  onSuccess,
  onError,
  onFallbackToManual,
}: ProB2BImportPanelProps) {
  const imp = copy.import;
  const initialUsed = aiGenerationsCount ?? magicImportSuccessCount;
  const [platform, setPlatform] = useState<ProImportPlatform>("google");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [brandColor, setBrandColor] = useState<string | null>(null);
  const [quota, setQuota] = useState<ImportQuotaState>({
    used: initialUsed,
    remaining: Math.max(0, MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL - initialUsed),
    max: MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL,
  });

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/import/quota")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json || typeof json !== "object") return;
        const used =
          typeof json.aiGenerationsCount === "number"
            ? json.aiGenerationsCount
            : typeof json.used === "number"
              ? json.used
              : initialUsed;
        const max =
          typeof json.max === "number" ? json.max : MAX_AI_GENERATIONS_TRIAL_OR_ESSENTIAL;
        setQuota({
          used,
          remaining:
            typeof json.aiGenerationsRemaining === "number"
              ? json.aiGenerationsRemaining
              : typeof json.remaining === "number"
                ? json.remaining
                : Math.max(0, max - used),
          max,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [initialUsed]);

  const canImport = quota.remaining > 0;

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
      if (result.aiGenerationsCount != null) {
        const used = result.aiGenerationsCount;
        setQuota((prev) => ({
          ...prev,
          used,
          remaining:
            result.aiGenerationsRemaining ??
            Math.max(0, prev.max - used),
        }));
      } else {
        setQuota((prev) => {
          const used = Math.min(prev.max, prev.used + 1);
          return {
            ...prev,
            used,
            remaining: Math.max(0, prev.max - used),
          };
        });
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

  const badgeLabel = useMemo(
    () =>
      imp.generationsOfferedBadge
        .replace("{used}", String(quota.used))
        .replace("{max}", String(quota.max)),
    [imp.generationsOfferedBadge, quota.used, quota.max],
  );

  return (
    <div className="space-y-4" style={panelStyle}>
      <span className="inline-flex items-center rounded-full bg-[#efa188]/10 px-3 py-1 text-xs font-semibold text-[#efa188]">
        {badgeLabel}
      </span>

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
