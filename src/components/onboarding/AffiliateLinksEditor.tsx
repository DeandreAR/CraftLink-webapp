"use client";

import { useRef, useState } from "react";
import { FaLink, FaTrash, FaImage } from "react-icons/fa6";
import { LandingCta } from "@/components/landing/LandingCta";
import type { OnboardingAffiliateLink } from "@/domain/onboarding";
import {
  createAffiliateLink,
  MAX_AFFILIATE_LINKS,
} from "@/lib/onboarding/affiliateLinks";
import {
  authFieldClassName,
  authLabelClassName,
} from "@/components/auth/authFormStyles";
import { compressGalleryImage } from "@/lib/portfolio/compressGalleryImage";
import { uploadGalleryImage } from "@/lib/portfolio/galleryStorage";

export type AffiliateLinksEditorCopy = {
  title: string;
  hint: string;
  nameLabel: string;
  namePlaceholder: string;
  discountLabel: string;
  discountPlaceholder: string;
  urlLabel: string;
  urlPlaceholder: string;
  imageLabel: string;
  imageHint: string;
  imageUpload: string;
  imageRemove: string;
  imageUploading: string;
  add: string;
  remove: string;
  maxReached: string;
  empty: string;
};

type AffiliateLinksEditorProps = {
  links: OnboardingAffiliateLink[];
  onChange: (links: OnboardingAffiliateLink[]) => void;
  copy: AffiliateLinksEditorCopy;
  optionalBadge?: string;
  /** Requis pour l’upload d’image d’aperçu. */
  workspaceId?: string | null;
};

export function AffiliateLinksEditor({
  links,
  onChange,
  copy,
  optionalBadge,
  workspaceId,
}: AffiliateLinksEditorProps) {
  const atMax = links.length >= MAX_AFFILIATE_LINKS;
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadId = useRef<string | null>(null);

  const patchLink = (id: string, patch: Partial<OnboardingAffiliateLink>) => {
    onChange(links.map((link) => (link.id === id ? { ...link, ...patch } : link)));
  };

  const removeLink = (id: string) => {
    onChange(links.filter((link) => link.id !== id));
  };

  const addLink = () => {
    if (atMax) return;
    onChange([...links, createAffiliateLink()]);
  };

  const openFilePicker = (linkId: string) => {
    if (!workspaceId) return;
    pendingUploadId.current = linkId;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (file: File | undefined) => {
    const linkId = pendingUploadId.current;
    pendingUploadId.current = null;
    if (!file || !linkId || !workspaceId) return;
    if (!file.type.startsWith("image/")) return;

    setUploadingId(linkId);
    try {
      const compressed = await compressGalleryImage(file);
      const { publicUrl } = await uploadGalleryImage(workspaceId, compressed);
      patchLink(linkId, { imageUrl: publicUrl });
    } catch {
      // silent — l’artisan peut coller une URL
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-4 space-y-4">
      <div>
        <p className="inline-flex flex-wrap items-center gap-2 text-sm font-bold text-neutral-900">
          <FaLink className="h-4 w-4 text-[#EFA188]" aria-hidden />
          {copy.title}
          {optionalBadge ? (
            <span className="rounded-full border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
              {optionalBadge}
            </span>
          ) : null}
        </p>
        <p className="mt-1 text-xs text-neutral-600">{copy.hint}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => void handleFileChange(e.target.files?.[0])}
      />

      {links.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-3 text-xs text-neutral-500">
          {copy.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {links.map((link) => (
            <li
              key={link.id}
              className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-3"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_0.8fr_1.2fr_auto]">
                <div>
                  <label className={authLabelClassName} htmlFor={`affiliate-label-${link.id}`}>
                    {copy.nameLabel}
                  </label>
                  <input
                    id={`affiliate-label-${link.id}`}
                    type="text"
                    value={link.label}
                    onChange={(e) => patchLink(link.id, { label: e.target.value })}
                    placeholder={copy.namePlaceholder}
                    className={authFieldClassName}
                  />
                </div>
                <div>
                  <label
                    className={authLabelClassName}
                    htmlFor={`affiliate-discount-${link.id}`}
                  >
                    {copy.discountLabel}
                  </label>
                  <input
                    id={`affiliate-discount-${link.id}`}
                    type="text"
                    value={link.discount ?? ""}
                    onChange={(e) => patchLink(link.id, { discount: e.target.value })}
                    placeholder={copy.discountPlaceholder}
                    className={authFieldClassName}
                  />
                </div>
                <div>
                  <label className={authLabelClassName} htmlFor={`affiliate-url-${link.id}`}>
                    {copy.urlLabel}
                  </label>
                  <input
                    id={`affiliate-url-${link.id}`}
                    type="url"
                    value={link.url}
                    onChange={(e) => patchLink(link.id, { url: e.target.value })}
                    placeholder={copy.urlPlaceholder}
                    className={authFieldClassName}
                  />
                </div>
                <div className="flex items-end sm:justify-end">
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-600 transition hover:border-red-200 hover:text-red-600"
                    aria-label={copy.remove}
                  >
                    <FaTrash className="h-3.5 w-3.5" aria-hidden />
                    {copy.remove}
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[96px_1fr]">
                <div className="flex h-24 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
                  {link.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={link.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaImage className="h-5 w-5 text-neutral-300" aria-hidden />
                  )}
                </div>
                <div className="space-y-2">
                  <label className={authLabelClassName} htmlFor={`affiliate-image-${link.id}`}>
                    {copy.imageLabel}
                  </label>
                  <p className="text-[11px] text-neutral-500">{copy.imageHint}</p>
                  <input
                    id={`affiliate-image-${link.id}`}
                    type="url"
                    value={link.imageUrl ?? ""}
                    onChange={(e) =>
                      patchLink(link.id, {
                        imageUrl: e.target.value.trim() || undefined,
                      })
                    }
                    placeholder="https://…"
                    className={authFieldClassName}
                  />
                  <div className="flex flex-wrap gap-2">
                    {workspaceId ? (
                      <button
                        type="button"
                        disabled={uploadingId === link.id}
                        onClick={() => openFilePicker(link.id)}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-[#EFA188]/50 disabled:opacity-50"
                      >
                        {uploadingId === link.id ? copy.imageUploading : copy.imageUpload}
                      </button>
                    ) : null}
                    {link.imageUrl ? (
                      <button
                        type="button"
                        onClick={() => patchLink(link.id, { imageUrl: undefined })}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-500 transition hover:border-red-200 hover:text-red-600"
                      >
                        {copy.imageRemove}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <LandingCta
        type="button"
        variant="secondary"
        onClick={addLink}
        disabled={atMax}
        className="w-full justify-center disabled:opacity-50"
      >
        {copy.add}
      </LandingCta>
      {atMax ? (
        <p className="text-center text-xs text-neutral-500">{copy.maxReached}</p>
      ) : null}
    </div>
  );
}
