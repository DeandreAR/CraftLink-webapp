"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createRecommendedProductAction,
  deleteRecommendedProductAction,
  listRecommendedProductsAction,
  reorderRecommendedProductsAction,
  updateRecommendedProductAction,
} from "@/app/actions/recommendedProducts";
import type { RecommendedProduct } from "@/domain/recommendedProduct";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import { DEFAULT_PRO_SELECTION_TITLE } from "@/domain/recommendedProduct";
import { compressGalleryImage } from "@/lib/portfolio/compressGalleryImage";
import { uploadGalleryImage } from "@/lib/portfolio/galleryStorage";
import { LandingCta } from "@/components/landing/LandingCta";
import {
  authFieldClassName,
  authLabelClassName,
} from "@/components/auth/authFormStyles";

type ProSelectionManagerCopy = {
  title: string;
  hint: string;
  enabledLabel: string;
  titleLabel: string;
  titlePlaceholder: string;
  add: string;
  edit: string;
  remove: string;
  save: string;
  cancel: string;
  empty: string;
  moveUp: string;
  moveDown: string;
  formTitle: string;
  formBrand: string;
  formDescription: string;
  formImage: string;
  formUrl: string;
  formPrice: string;
  formActive: string;
  uploadImage: string;
  uploading: string;
  saving: string;
  error: string;
};

type ProSelectionManagerProps = {
  profileDraft: OnboardingProfileDraft;
  workspaceId: string;
  onProfileChange: (patch: Partial<OnboardingProfileDraft>) => void;
  copy: ProSelectionManagerCopy;
};

type FormState = {
  title: string;
  brand: string;
  description: string;
  image_url: string;
  affiliate_url: string;
  price_hint: string;
  is_active: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  brand: "",
  description: "",
  image_url: "",
  affiliate_url: "",
  price_hint: "",
  is_active: true,
});

export function ProSelectionManager({
  profileDraft,
  workspaceId,
  onProfileChange,
  copy,
}: ProSelectionManagerProps) {
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const enabled = profileDraft.proSelectionEnabled !== false;
  const sectionTitle =
    profileDraft.proSelectionTitle?.trim() || DEFAULT_PRO_SELECTION_TITLE;

  const refresh = async () => {
    const result = await listRecommendedProductsAction();
    if (result.ok) setProducts(result.products);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const openCreate = () => {
    setCreating(true);
    setEditingId(null);
    setForm(emptyForm());
    setFeedback(null);
  };

  const openEdit = (product: RecommendedProduct) => {
    setCreating(false);
    setEditingId(product.id);
    setForm({
      title: product.title,
      brand: product.brand ?? "",
      description: product.description ?? "",
      image_url: product.image_url,
      affiliate_url: product.affiliate_url,
      price_hint: product.price_hint ?? "",
      is_active: product.is_active,
    });
    setFeedback(null);
  };

  const closeForm = () => {
    setCreating(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleUpload = async (file: File | undefined) => {
    if (!file?.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const compressed = await compressGalleryImage(file);
      const { publicUrl } = await uploadGalleryImage(workspaceId, compressed);
      setForm((prev) => ({ ...prev, image_url: publicUrl }));
    } catch {
      setFeedback(copy.error);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveForm = () => {
    startTransition(async () => {
      setFeedback(null);
      const payload = {
        title: form.title,
        brand: form.brand || null,
        description: form.description || null,
        image_url: form.image_url,
        affiliate_url: form.affiliate_url,
        price_hint: form.price_hint || null,
        is_active: form.is_active,
      };

      const result = editingId
        ? await updateRecommendedProductAction(editingId, payload)
        : await createRecommendedProductAction(payload);

      if (!result.ok) {
        setFeedback(copy.error);
        return;
      }
      closeForm();
      await refresh();
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteRecommendedProductAction(id);
      if (!result.ok) {
        setFeedback(copy.error);
        return;
      }
      await refresh();
    });
  };

  const move = (id: string, direction: -1 | 1) => {
    const index = products.findIndex((p) => p.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= products.length) return;
    const next = [...products];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setProducts(next);
    startTransition(async () => {
      await reorderRecommendedProductsAction(next.map((p) => p.id));
    });
  };

  return (
    <div className="space-y-4 rounded-[18px] border border-neutral-200 bg-white p-4 md:p-5">
      <div>
        <h3 className="text-sm font-bold text-neutral-900">{copy.title}</h3>
        <p className="mt-1 text-xs text-neutral-600">{copy.hint}</p>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2.5">
        <span className="text-sm font-medium text-neutral-800">{copy.enabledLabel}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onProfileChange({ proSelectionEnabled: e.target.checked })}
          className="h-4 w-4 accent-neutral-900"
        />
      </label>

      <div>
        <label className={authLabelClassName} htmlFor="pro-selection-title">
          {copy.titleLabel}
        </label>
        <input
          id="pro-selection-title"
          type="text"
          value={sectionTitle}
          onChange={(e) => onProfileChange({ proSelectionTitle: e.target.value })}
          placeholder={copy.titlePlaceholder}
          className={authFieldClassName}
        />
      </div>

      {loading ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      ) : products.length === 0 && !creating ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
          {copy.empty}
        </p>
      ) : (
        <ul className="space-y-2">
          {products.map((product, index) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-2.5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image_url}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover bg-neutral-200"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">{product.title}</p>
                <p className="truncate text-[11px] text-neutral-500">
                  {[product.brand, product.price_hint].filter(Boolean).join(" · ") ||
                    product.affiliate_url}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  disabled={index === 0 || pending}
                  onClick={() => move(product.id, -1)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold disabled:opacity-40"
                >
                  {copy.moveUp}
                </button>
                <button
                  type="button"
                  disabled={index === products.length - 1 || pending}
                  onClick={() => move(product.id, 1)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold disabled:opacity-40"
                >
                  {copy.moveDown}
                </button>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold"
                >
                  {copy.edit}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id)}
                  className="rounded-lg border border-red-100 bg-white px-2 py-1 text-[10px] font-semibold text-red-600"
                >
                  {copy.remove}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {creating || editingId ? (
        <div className="space-y-3 rounded-2xl border border-[#EFA188]/30 bg-[#FFF5F0]/40 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={authLabelClassName}>{copy.formTitle}</label>
              <input
                className={authFieldClassName}
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className={authLabelClassName}>{copy.formBrand}</label>
              <input
                className={authFieldClassName}
                value={form.brand}
                onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className={authLabelClassName}>{copy.formDescription}</label>
            <textarea
              className={authFieldClassName}
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={authLabelClassName}>{copy.formUrl}</label>
              <input
                className={authFieldClassName}
                value={form.affiliate_url}
                onChange={(e) => setForm((p) => ({ ...p, affiliate_url: e.target.value }))}
              />
            </div>
            <div>
              <label className={authLabelClassName}>{copy.formPrice}</label>
              <input
                className={authFieldClassName}
                value={form.price_hint}
                onChange={(e) => setForm((p) => ({ ...p, price_hint: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className={authLabelClassName}>{copy.formImage}</label>
            <input
              className={authFieldClassName}
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              placeholder="https://…"
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleUpload(e.target.files?.[0])}
              />
              {uploading ? (
                <span className="text-xs text-neutral-500">{copy.uploading}</span>
              ) : null}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
            />
            {copy.formActive}
          </label>
          <div className="flex flex-wrap gap-2">
            <LandingCta
              type="button"
              variant="peach"
              disabled={pending}
              onClick={handleSaveForm}
              className="text-sm"
            >
              {pending ? copy.saving : copy.save}
            </LandingCta>
            <LandingCta type="button" variant="secondary" onClick={closeForm} className="text-sm">
              {copy.cancel}
            </LandingCta>
          </div>
        </div>
      ) : (
        <LandingCta type="button" variant="secondary" onClick={openCreate} className="w-full text-sm">
          {copy.add}
        </LandingCta>
      )}

      {feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}
    </div>
  );
}
