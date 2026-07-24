"use client";

import { HEADER_SOLID_PRESETS } from "@/domain/recommendedProduct";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import { serializeGradientValue } from "@/lib/vitrine/resolveVitrineHeaderMedia";
import { uploadBannerImage } from "@/lib/vitrine/bannerStorage";
import { compressGalleryImage } from "@/lib/portfolio/compressGalleryImage";
import { useRef, useState } from "react";

type HeaderAppearanceEditorProps = {
  profile: OnboardingProfileDraft;
  workspaceId: string;
  onChange: (patch: Partial<OnboardingProfileDraft>) => void;
  copy: {
    title: string;
    layoutTitle: string;
    layoutStandard: string;
    layoutStandardHint: string;
    layoutOverlay: string;
    layoutOverlayHint: string;
    bgTitle: string;
    bgSolid: string;
    bgGradient: string;
    bgImage: string;
    gradientFrom: string;
    gradientTo: string;
    uploadBanner: string;
    uploading: string;
  };
};

export function HeaderAppearanceEditor({
  profile,
  workspaceId,
  onChange,
  copy,
}: HeaderAppearanceEditorProps) {
  const visual = profile.visual;
  const layout = visual.headerLayoutType ?? "banner_overlay";
  const bgType = visual.headerBgType ?? "solid";
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  let gradientFrom = "#EFA188";
  let gradientTo = "#FFF5F0";
  if (visual.headerBgValue) {
    try {
      const parsed = JSON.parse(visual.headerBgValue) as { from?: string; to?: string };
      if (parsed.from && parsed.to) {
        gradientFrom = parsed.from;
        gradientTo = parsed.to;
      }
    } catch {
      // ignore
    }
  }

  const patchVisual = (patch: Partial<OnboardingProfileDraft["visual"]>) => {
    onChange({ visual: { ...visual, ...patch } });
  };

  const handleBannerUpload = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const compressed = await compressGalleryImage(file);
      const { publicUrl } = await uploadBannerImage(workspaceId, compressed, "image/webp");
      patchVisual({
        headerBgType: "image",
        headerBgValue: publicUrl,
        bannerPreviewUrl: publicUrl,
        useBrandGradientBanner: false,
      });
    } catch {
      // ignore
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-4">
      <div>
        <h3 className="text-sm font-bold text-neutral-900">{copy.title}</h3>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {copy.layoutTitle}
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(
            [
              {
                id: "standard" as const,
                label: copy.layoutStandard,
                hint: copy.layoutStandardHint,
              },
              {
                id: "banner_overlay" as const,
                label: copy.layoutOverlay,
                hint: copy.layoutOverlayHint,
              },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => patchVisual({ headerLayoutType: option.id })}
              className={`rounded-2xl border p-3 text-left transition ${
                layout === option.id
                  ? "border-[#EFA188] bg-[#FFF5F0] ring-1 ring-[#EFA188]/40"
                  : "border-neutral-200 bg-neutral-50 hover:border-neutral-300"
              }`}
            >
              <p className="text-sm font-semibold text-neutral-900">{option.label}</p>
              <p className="mt-1 text-[11px] text-neutral-500">{option.hint}</p>
              <div
                className={`mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white ${
                  option.id === "banner_overlay" ? "pt-0" : "p-2"
                }`}
              >
                <div
                  className={`bg-neutral-200 ${
                    option.id === "banner_overlay" ? "h-10" : "h-6 rounded-lg"
                  }`}
                />
                {option.id === "banner_overlay" ? (
                  <div className="-mt-3 flex justify-center">
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-[#EFA188]" />
                  </div>
                ) : (
                  <div className="mt-2 flex justify-center">
                    <div className="h-5 w-5 rounded-full bg-[#EFA188]" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {copy.bgTitle}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              { id: "solid" as const, label: copy.bgSolid },
              { id: "gradient" as const, label: copy.bgGradient },
              { id: "image" as const, label: copy.bgImage },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (option.id === "solid") {
                  patchVisual({
                    headerBgType: "solid",
                    headerBgValue: visual.headerBgValue?.startsWith("#")
                      ? visual.headerBgValue
                      : "#FFFFFF",
                    useBrandGradientBanner: false,
                  });
                } else if (option.id === "gradient") {
                  patchVisual({
                    headerBgType: "gradient",
                    headerBgValue: serializeGradientValue(gradientFrom, gradientTo),
                    useBrandGradientBanner: true,
                  });
                } else {
                  patchVisual({
                    headerBgType: "image",
                    headerBgValue: visual.bannerPreviewUrl,
                    useBrandGradientBanner: false,
                  });
                }
              }}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                bgType === option.id
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {bgType === "solid" ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {HEADER_SOLID_PRESETS.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => patchVisual({ headerBgType: "solid", headerBgValue: hex })}
                className={`h-9 w-9 rounded-full border-2 ${
                  visual.headerBgValue === hex ? "border-[#EFA188]" : "border-neutral-200"
                }`}
                style={{ backgroundColor: hex }}
                aria-label={hex}
              />
            ))}
            <input
              type="color"
              value={visual.headerBgValue?.startsWith("#") ? visual.headerBgValue : "#FFFFFF"}
              onChange={(e) =>
                patchVisual({ headerBgType: "solid", headerBgValue: e.target.value })
              }
              className="h-9 w-12 cursor-pointer rounded border border-neutral-200 bg-white"
            />
          </div>
        ) : null}

        {bgType === "gradient" ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label className="text-xs text-neutral-600">
              {copy.gradientFrom}
              <input
                type="color"
                value={gradientFrom}
                onChange={(e) =>
                  patchVisual({
                    headerBgType: "gradient",
                    headerBgValue: serializeGradientValue(e.target.value, gradientTo),
                    useBrandGradientBanner: true,
                  })
                }
                className="mt-1 block h-10 w-full cursor-pointer rounded border border-neutral-200"
              />
            </label>
            <label className="text-xs text-neutral-600">
              {copy.gradientTo}
              <input
                type="color"
                value={gradientTo}
                onChange={(e) =>
                  patchVisual({
                    headerBgType: "gradient",
                    headerBgValue: serializeGradientValue(gradientFrom, e.target.value),
                    useBrandGradientBanner: true,
                  })
                }
                className="mt-1 block h-10 w-full cursor-pointer rounded border border-neutral-200"
              />
            </label>
            <div
              className="col-span-2 h-14 rounded-xl border border-neutral-200"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
              }}
            />
          </div>
        ) : null}

        {bgType === "image" ? (
          <div className="mt-3 space-y-2">
            {(visual.headerBgValue || visual.bannerPreviewUrl) && (
              <div
                className="h-28 rounded-xl border border-neutral-200 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${visual.headerBgValue || visual.bannerPreviewUrl})`,
                }}
              />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => void handleBannerUpload(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 hover:border-[#EFA188]/50 disabled:opacity-50"
            >
              {uploading ? copy.uploading : copy.uploadBanner}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
