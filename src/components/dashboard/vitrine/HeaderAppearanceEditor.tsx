"use client";

import { HEADER_SOLID_PRESETS, normalizeHeaderLayoutType } from "@/domain/recommendedProduct";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import type { HeaderLayoutType } from "@/domain/recommendedProduct";
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
    layoutBanner: string;
    layoutBannerHint: string;
    layoutBrand: string;
    layoutBrandHint: string;
    layoutAvatar: string;
    layoutAvatarHint: string;
    layoutPageBrand: string;
    layoutPageBrandHint: string;
    bgTitle: string;
    bgSolid: string;
    bgGradient: string;
    bgImage: string;
    gradientFrom: string;
    gradientTo: string;
    uploadBanner: string;
    uploading: string;
    avatarBorderLabel: string;
  };
};

type LayoutOptionId = Exclude<HeaderLayoutType, "standard">;

/** Couleurs fixes des miniatures — indépendantes du CTA devis. */
const PREVIEW_ACCENT = "#EFA188";
const PREVIEW_BANNER = "#c4b5a5";
const PREVIEW_WASH = "#fff5f0";

function LayoutPreview({ id }: { id: LayoutOptionId }) {
  if (id === "banner_overlay") {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="h-10" style={{ backgroundColor: PREVIEW_BANNER }}>
          <div className="flex h-full items-end justify-center pb-1">
            <span className="rounded bg-black/35 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white">
              Bannière
            </span>
          </div>
        </div>
        <div className="-mt-3 flex flex-col items-center pb-2">
          <div
            className="h-7 w-7 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: PREVIEW_ACCENT }}
          />
          <span className="mt-1 text-[8px] font-medium text-neutral-500">Photo</span>
        </div>
      </div>
    );
  }

  if (id === "brand_cover") {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div
          className="flex h-12 flex-col items-center justify-center px-1 text-center"
          style={{
            background: `linear-gradient(135deg, ${PREVIEW_ACCENT} 0%, ${PREVIEW_WASH} 100%)`,
          }}
        >
          <span className="text-[9px] font-extrabold text-neutral-900">Nom</span>
          <span className="text-[7px] text-neutral-600">En-tête seulement</span>
        </div>
        <div className="space-y-1 bg-white p-1.5">
          <div className="h-1.5 rounded bg-neutral-100" />
          <div className="h-1.5 w-2/3 rounded bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (id === "page_brand") {
    return (
      <div
        className="flex h-[4.75rem] flex-col overflow-hidden rounded-xl border border-neutral-200 px-1.5 py-1.5"
        style={{
          background: `linear-gradient(180deg, ${PREVIEW_ACCENT} 0%, ${PREVIEW_WASH} 100%)`,
        }}
      >
        <span className="text-center text-[9px] font-extrabold text-neutral-900">
          Nom entreprise
        </span>
        <span className="mt-0.5 text-center text-[7px] font-semibold uppercase tracking-wide text-neutral-600">
          Toute la page
        </span>
        <div className="mt-auto space-y-1 rounded-md bg-white/50 p-1">
          <div className="h-1 rounded bg-white/80" />
          <div className="h-1 w-3/4 rounded bg-white/80" />
        </div>
      </div>
    );
  }

  // avatar_cover — pleine page
  return (
    <div
      className="flex h-[4.75rem] flex-col items-center overflow-hidden rounded-xl border border-neutral-200 px-1.5 py-1.5"
      style={{
        background: `linear-gradient(180deg, ${PREVIEW_ACCENT} 0%, ${PREVIEW_WASH} 100%)`,
      }}
    >
      <div
        className="h-7 w-7 rounded-full border-2 border-white shadow"
        style={{ backgroundColor: PREVIEW_ACCENT }}
      />
      <span className="mt-1 text-[7px] font-semibold uppercase tracking-wide text-neutral-700">
        Toute la page
      </span>
      <div className="mt-auto w-full space-y-1 rounded-md bg-white/50 p-1">
        <div className="h-1 rounded bg-white/80" />
        <div className="h-1 w-2/3 rounded bg-white/80" />
      </div>
    </div>
  );
}

export function HeaderAppearanceEditor({
  profile,
  workspaceId,
  onChange,
  copy,
}: HeaderAppearanceEditorProps) {
  const visual = profile.visual;
  const layout = normalizeHeaderLayoutType(visual.headerLayoutType);
  const bgType =
    layout === "banner_overlay"
      ? (visual.headerBgType ?? "image")
      : visual.headerBgType === "image"
        ? "gradient"
        : (visual.headerBgType ?? "solid");
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

  const selectLayout = (next: LayoutOptionId) => {
    if (next === "banner_overlay") {
      patchVisual({
        headerLayoutType: next,
        headerBgType:
          visual.bannerPreviewUrl || visual.headerBgValue?.startsWith("http")
            ? "image"
            : visual.headerBgType === "solid"
              ? "solid"
              : "gradient",
      });
      return;
    }
    patchVisual({
      headerLayoutType: next,
      headerBgType: visual.headerBgType === "image" ? "gradient" : visual.headerBgType ?? "gradient",
      useBrandGradientBanner: visual.headerBgType !== "solid",
    });
  };

  const handleBannerUpload = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const compressed = await compressGalleryImage(file);
      const { publicUrl } = await uploadBannerImage(workspaceId, compressed, "image/webp");
      patchVisual({
        headerLayoutType: "banner_overlay",
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

  const layoutOptions: Array<{
    id: LayoutOptionId;
    label: string;
    hint: string;
  }> = [
    {
      id: "banner_overlay",
      label: copy.layoutBanner,
      hint: copy.layoutBannerHint,
    },
    {
      id: "brand_cover",
      label: copy.layoutBrand,
      hint: copy.layoutBrandHint,
    },
    {
      id: "avatar_cover",
      label: copy.layoutAvatar,
      hint: copy.layoutAvatarHint,
    },
    {
      id: "page_brand",
      label: copy.layoutPageBrand,
      hint: copy.layoutPageBrandHint,
    },
  ];

  const bgOptions =
    layout === "banner_overlay"
      ? ([
          { id: "image" as const, label: copy.bgImage },
          { id: "gradient" as const, label: copy.bgGradient },
          { id: "solid" as const, label: copy.bgSolid },
        ] as const)
      : ([
          { id: "gradient" as const, label: copy.bgGradient },
          { id: "solid" as const, label: copy.bgSolid },
        ] as const);

  return (
    <div className="space-y-5">
      <div className="db-card-header mb-0 pb-0 border-0">
        <p className="db-section-label">{copy.title}</p>
      </div>

      <div>
        <p className="db-section-label">{copy.layoutTitle}</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {layoutOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => selectLayout(option.id)}
              className={`rounded-xl border p-3 text-left transition ${
                layout === option.id
                  ? "border-slate-900 bg-white shadow-sm ring-1 ring-slate-900/10"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <LayoutPreview id={option.id} />
              <p className="mt-2.5 text-sm font-semibold text-neutral-900">{option.label}</p>
              <p className="mt-1 text-[11px] leading-snug text-neutral-500">{option.hint}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="db-section-label">{copy.bgTitle}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {bgOptions.map((option) => (
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

        {bgType === "image" && layout === "banner_overlay" ? (
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

      {layout === "avatar_cover" || layout === "banner_overlay" ? (
        <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5">
          <span className="text-sm font-medium text-neutral-800">{copy.avatarBorderLabel}</span>
          <input
            type="checkbox"
            checked={visual.headerAvatarBorder !== false}
            onChange={(e) => patchVisual({ headerAvatarBorder: e.target.checked })}
            className="h-4 w-4 accent-neutral-900"
          />
        </label>
      ) : null}
    </div>
  );
}
