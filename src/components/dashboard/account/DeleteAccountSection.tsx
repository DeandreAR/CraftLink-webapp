"use client";

import { useState } from "react";
import { deleteAccountAction } from "@/app/actions/dashboard";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type DeleteAccountSectionProps = {
  copy: DashboardDictionary;
  locale: Locale;
};

export function DeleteAccountSection({ copy, locale }: DeleteAccountSectionProps) {
  const d = copy.account.delete;
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canConfirm = confirmText.trim().toUpperCase() === d.confirmWord;

  const handleDelete = async () => {
    if (!canConfirm || loading) return;
    setLoading(true);
    setError(null);
    const result = await deleteAccountAction(locale);
    if (!result.ok) {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <section className="rounded-2xl border border-red-100 bg-red-50/40 p-5">
      <h2 className="text-base font-bold text-red-900">{d.title}</h2>
      <p className="mt-1 text-sm text-red-800/80">{d.body}</p>
      <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-red-800/90">
        {d.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        {d.cta}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl">
            <h3 id="delete-account-title" className="text-lg font-bold text-black">
              {d.modalTitle}
            </h3>
            <p className="mt-2 text-sm text-neutral-600">{d.modalBody}</p>
            <label className="mt-4 block text-sm font-medium text-neutral-800">
              {d.confirmLabel.replace("{word}", d.confirmWord)}
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-red-400"
                autoComplete="off"
              />
            </label>
            {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!canConfirm || loading}
                onClick={() => void handleDelete()}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-40"
              >
                {loading ? d.deleting : d.confirmCta}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setConfirmText("");
                  setError(null);
                }}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-neutral-600 hover:text-black"
              >
                {d.cancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
