"use client";

import { useEffect, useState, useTransition } from "react";
import {
  createRecommendedProductAction,
  deleteRecommendedProductAction,
  listRecommendedProductsAction,
  reorderRecommendedProductsAction,
  updateRecommendedProductAction,
} from "@/app/actions/recommendedProducts";
import type { RecommendedItem } from "@/domain/recommendedProduct";
import type { OnboardingProfileDraft } from "@/domain/onboarding";
import { DEFAULT_PRO_SELECTION_TITLE } from "@/domain/recommendedProduct";
import { compressGalleryImage } from "@/lib/portfolio/compressGalleryImage";
import { uploadGalleryImage } from "@/lib/portfolio/galleryStorage";
import { DashboardButton } from "@/components/dashboard/DashboardButton";
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
  formDescription: string;
  formDiscount: string;
  formImage: string;
  formUrl: string;
  formActive: string;
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
  description: string;
  discount_code: string;
  image_url: string;
  url: string;
  is_active: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  description: "",
  discount_code: "",
  image_url: "",
  url: "",
  is_active: true,
});

export function ProSelectionManager({
  profileDraft,
  workspaceId,
  onProfileChange,
  copy,
}: ProSelectionManagerProps) {
  const [items, setItems] = useState<RecommendedItem[]>([]);
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
    if (result.ok) setItems(result.products);
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

  const openEdit = (item: RecommendedItem) => {
    setCreating(false);
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description ?? "",
      discount_code: item.discount_code ?? "",
      image_url: item.image_url ?? "",
      url: item.url,
      is_active: item.is_active,
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
        description: form.description || null,
        discount_code: form.discount_code || null,
        image_url: form.image_url || null,
        url: form.url,
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
    const index = items.findIndex((p) => p.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    setItems(next);
    startTransition(async () => {
      await reorderRecommendedProductsAction(next.map((p) => p.id));
    });
  };

  return (
    <div className="db-card space-y-4 p-4 md:p-5">
      <div className="db-card-header">
        <h3 className="text-sm font-semibold text-slate-900">{copy.title}</h3>
        <p className="mt-1 text-xs text-slate-500">{copy.hint}</p>
      </div>

      <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <span className="text-sm font-medium text-slate-800">{copy.enabledLabel}</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onProfileChange({ proSelectionEnabled: e.target.checked })}
          className="h-4 w-4 accent-slate-900"
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
      ) : items.length === 0 && !creating ? (
        <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
          {copy.empty}
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-2.5"
            >
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  className="h-14 w-14 shrink-0 rounded-xl object-cover bg-neutral-200"
                />
              ) : (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-neutral-200 text-[10px] font-bold uppercase text-neutral-500">
                  Lien
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-neutral-900">{item.title}</p>
                <p className="truncate text-[11px] text-neutral-500">
                  {[item.discount_code, item.url].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  disabled={index === 0 || pending}
                  onClick={() => move(item.id, -1)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold disabled:opacity-40"
                >
                  {copy.moveUp}
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1 || pending}
                  onClick={() => move(item.id, 1)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold disabled:opacity-40"
                >
                  {copy.moveDown}
                </button>
              </div>
              <div className="flex shrink-0 flex-col gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[10px] font-semibold"
                >
                  {copy.edit}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
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
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
          <div>
            <label className={authLabelClassName}>{copy.formTitle}</label>
            <input
              className={authFieldClassName}
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="Ex. Pack outillage Wiha / Gamme Legrand"
            />
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
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://…"
              />
            </div>
            <div>
              <label className={authLabelClassName}>{copy.formDiscount}</label>
              <input
                className={authFieldClassName}
                value={form.discount_code}
                onChange={(e) => setForm((p) => ({ ...p, discount_code: e.target.value }))}
                placeholder="Ex. -10% code CRAFT10"
              />
            </div>
          </div>
          <div>
            <label className={authLabelClassName}>{copy.formImage}</label>
            <input
              className={authFieldClassName}
              value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              placeholder="https://… (optionnel)"
            />
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleUpload(e.target.files?.[0])}
              />
              {uploading ? (
                <span className="ml-2 text-xs text-neutral-500">{copy.uploading}</span>
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
            <DashboardButton
              type="button"
              variant="primary"
              disabled={pending}
              onClick={handleSaveForm}
            >
              {pending ? copy.saving : copy.save}
            </DashboardButton>
            <DashboardButton type="button" variant="secondary" onClick={closeForm}>
              {copy.cancel}
            </DashboardButton>
          </div>
        </div>
      ) : (
        <DashboardButton type="button" variant="secondary" onClick={openCreate} className="w-full">
          {copy.add}
        </DashboardButton>
      )}

      {feedback ? <p className="text-sm text-red-600">{feedback}</p> : null}
    </div>
  );
}
