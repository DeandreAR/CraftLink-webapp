"use client";

import { useId, useRef, useState } from "react";
import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaMobileScreen,
  FaShareNodes,
  FaTrash,
} from "react-icons/fa6";
import type { OnboardingPlan, OnboardingPortfolioItem } from "@/domain/onboarding";
import { PRO_DIRECT_GALLERY_LIMIT } from "@/domain/portfolio";
import type { PortfolioSourceType } from "@/domain/portfolio";
import { PortfolioSourceBadge } from "@/components/dashboard/vitrine/PortfolioSourceBadge";
import { compressGalleryImage } from "@/lib/portfolio/compressGalleryImage";
import {
  deleteGalleryStorageObject,
  uploadGalleryImage,
} from "@/lib/portfolio/galleryStorage";
import { countDirectPortfolioItems } from "@/lib/portfolio/normalizePortfolioItem";
import {
  parseExternalPortfolioUrl,
  parseInstagramPublicationUrl,
} from "@/lib/portfolio/parsePortfolioUrl";
import type { DashboardDictionary } from "@/i18n/types";

type PortfolioGalleryEditorProps = {
  items: OnboardingPortfolioItem[];
  plan: OnboardingPlan;
  workspaceId: string;
  copy: DashboardDictionary["vitrine"]["gallery"];
  onChange: (items: OnboardingPortfolioItem[]) => void;
};

type PendingSource = Extract<PortfolioSourceType, "instagram" | "facebook" | "google">;

export function PortfolioGalleryEditor({
  items,
  plan,
  workspaceId,
  copy,
  onChange,
}: PortfolioGalleryEditorProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [socialMenuOpen, setSocialMenuOpen] = useState(false);
  const [pendingSource, setPendingSource] = useState<PendingSource | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isPro = plan === "PRO";
  const directCount = countDirectPortfolioItems(items);

  const openUrlDialog = (source: PendingSource) => {
    setSocialMenuOpen(false);
    setPendingSource(source);
    setUrlInput("");
    setUrlError(null);
  };

  const closeUrlDialog = () => {
    setPendingSource(null);
    setUrlInput("");
    setUrlError(null);
  };

  const addInstagramItem = (url: string) => {
    const parsed = parseInstagramPublicationUrl(url);
    if (!parsed) {
      setUrlError(copy.invalidInstagramUrl);
      return;
    }

    const item: OnboardingPortfolioItem = {
      id: parsed.kind === "profile" ? `ig-profile-${parsed.username}` : `ig-${parsed.shortcode}`,
      source_type: "instagram",
      externalUrl: parsed.externalUrl,
      embedUrl: parsed.embedUrl,
      type: parsed.kind === "profile" ? "instagram_profile_embed" : "instagram_embed",
      alt:
        parsed.kind === "profile"
          ? copy.instagramProfileAlt
          : copy.instagramPostAlt.replace("{shortcode}", parsed.shortcode),
    };

    onChange([...items, item]);
    closeUrlDialog();
  };

  const addExternalItem = (source: "facebook" | "google", url: string) => {
    const normalized = parseExternalPortfolioUrl(source, url);
    if (!normalized) {
      setUrlError(source === "facebook" ? copy.invalidFacebookUrl : copy.invalidGoogleUrl);
      return;
    }

    onChange([
      ...items,
      {
        id: `${source}-${crypto.randomUUID()}`,
        source_type: source,
        externalUrl: normalized,
        alt: source === "facebook" ? copy.facebookAlt : copy.googleAlt,
      },
    ]);
    closeUrlDialog();
  };

  const handleUrlSubmit = () => {
    if (!pendingSource) return;
    if (pendingSource === "instagram") {
      addInstagramItem(urlInput);
      return;
    }
    addExternalItem(pendingSource, urlInput);
  };

  const handleDirectPick = () => {
    setSocialMenuOpen(false);
    setFeedback(null);

    if (!isPro) {
      setFeedback(copy.essentialBlocked);
      return;
    }

    if (directCount >= PRO_DIRECT_GALLERY_LIMIT) {
      setFeedback(copy.proLimitReached.replace("{limit}", String(PRO_DIRECT_GALLERY_LIMIT)));
      return;
    }

    fileInputRef.current?.click();
  };

  const handleDirectUpload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFeedback(copy.invalidImageType);
      return;
    }

    setUploading(true);
    setFeedback(null);

    try {
      const compressed = await compressGalleryImage(file);
      const { storagePath, publicUrl } = await uploadGalleryImage(workspaceId, compressed);

      onChange([
        ...items,
        {
          id: `direct-${crypto.randomUUID()}`,
          source_type: "direct",
          imageUrl: publicUrl,
          storagePath,
          alt: copy.directAlt,
        },
      ]);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : copy.uploadError);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (item: OnboardingPortfolioItem) => {
    if (item.source_type === "direct" && item.storagePath) {
      try {
        await deleteGalleryStorageObject(item.storagePath);
      } catch {
        setFeedback(copy.deleteStorageError);
        return;
      }
    }

    onChange(items.filter((entry) => entry.id !== item.id));
  };

  const pendingLabel =
    pendingSource === "instagram"
      ? copy.instagramUrlLabel
      : pendingSource === "facebook"
        ? copy.facebookUrlLabel
        : pendingSource === "google"
          ? copy.googleUrlLabel
          : "";

  function previewHost(url: string | undefined): string {
    if (!url) return copy.externalPreview;
    try {
      return new URL(url).hostname;
    } catch {
      return copy.externalPreview;
    }
  }

  return (
    <section className="rounded-[20px] border border-neutral-200 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-black">{copy.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600">{copy.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setSocialMenuOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:bg-neutral-50"
            >
              <FaShareNodes className="h-3.5 w-3.5" aria-hidden />
              {copy.socialButton}
            </button>

            {socialMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
                <button
                  type="button"
                  onClick={() => openUrlDialog("instagram")}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  <FaInstagram className="h-4 w-4 text-[#E4405F]" aria-hidden />
                  {copy.fromInstagram}
                </button>
                <button
                  type="button"
                  onClick={() => openUrlDialog("facebook")}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  <FaFacebook className="h-4 w-4 text-[#1877F2]" aria-hidden />
                  {copy.fromFacebook}
                </button>
                <button
                  type="button"
                  onClick={() => openUrlDialog("google")}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                >
                  <FaGoogle className="h-4 w-4 text-[#4285F4]" aria-hidden />
                  {copy.fromGoogle}
                </button>
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={handleDirectPick}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            <FaMobileScreen className="h-3.5 w-3.5" aria-hidden />
            {copy.phoneButton}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        id={fileInputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => void handleDirectUpload(event.target.files?.[0])}
      />

      {isPro ? (
        <p className="mt-3 text-xs text-neutral-500">
          {copy.directQuota
            .replace("{count}", String(directCount))
            .replace("{limit}", String(PRO_DIRECT_GALLERY_LIMIT))}
        </p>
      ) : (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {copy.essentialBlocked}
        </p>
      )}

      {feedback ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="alert">
          {feedback}
        </p>
      ) : null}

      {pendingSource ? (
        <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <label className="block text-xs font-semibold text-neutral-800" htmlFor={`${fileInputId}-url`}>
            {pendingLabel}
          </label>
          <input
            id={`${fileInputId}-url`}
            type="url"
            value={urlInput}
            onChange={(event) => {
              setUrlInput(event.target.value);
              setUrlError(null);
            }}
            placeholder={copy.urlPlaceholder}
            className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
          {urlError ? (
            <p className="mt-2 text-xs text-red-600" role="alert">
              {urlError}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white"
            >
              {copy.addLink}
            </button>
            <button
              type="button"
              onClick={closeUrlDialog}
              className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-700"
            >
              {copy.cancel}
            </button>
          </div>
        </div>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {items.map((item) => (
            <li
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
            >
              {item.source_type === "direct" && item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover"
                />
              ) : (item.source_type === "google" || item.source_type === "facebook") &&
                item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.alt ?? ""}
                  className="h-full w-full object-cover"
                />
              ) : item.source_type === "instagram" && item.embedUrl ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#F58529]/20 via-[#DD2A7B]/15 to-[#8134AF]/20 p-2 text-center">
                  <FaInstagram className="h-6 w-6 text-[#E4405F]" aria-hidden />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-50 p-2 text-center text-[10px] leading-tight text-neutral-600">
                  {previewHost(item.externalUrl)}
                </div>
              )}

              <div className="absolute left-1 top-1 scale-90 origin-top-left">
                <PortfolioSourceBadge source={item.source_type} labelDirect={copy.badgeDirect} />
              </div>

              <button
                type="button"
                onClick={() => void handleRemove(item)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
                aria-label={copy.remove}
              >
                <FaTrash className="h-3 w-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-500">
          {copy.empty}
        </p>
      )}
    </section>
  );
}
