"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type {
  LeadFormStatus,
  LeadUrgency,
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineProfileSettings,
  VitrineService,
} from "@/domain/vitrine";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import {
  getCaptureFormTitle,
  getDefaultDelay,
  shouldShowDelaySelection,
} from "@/lib/vitrine/captureForm";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineDelayPills } from "@/components/vitrine/VitrineDelayPills";
import { VitrineFooter } from "@/components/vitrine/VitrineFooter";
import { VitrinePhotoUpload } from "@/components/vitrine/VitrinePhotoUpload";
import { VitrineVoiceCapture } from "@/components/vitrine/VitrineVoiceCapture";

type VitrineDetailsSectionProps = {
  planTier: PublicPlanTier;
  profileSettings: VitrineProfileSettings;
  services: VitrineService[];
  copy: VitrineDictionary;
  initialIntent?: VitrineOpenIntent;
  onBack: () => void;
};

export function VitrineDetailsSection({
  planTier,
  profileSettings,
  services,
  copy,
  initialIntent = "quote",
  onBack,
}: VitrineDetailsSectionProps) {
  const isPro = isProPublicPlan(planTier);
  const showCollaborationToggle =
    isPro && profileSettings.visibility.showCollaborationButton;
  const det = copy.details;
  const form = copy.form;

  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isCollaboration, setIsCollaboration] = useState(
    initialIntent === "collaboration",
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [proCompanyName, setProCompanyName] = useState("");
  const [urgency, setUrgency] = useState<LeadUrgency>(getDefaultDelay(initialIntent));
  const [projectDescription, setProjectDescription] = useState("");
  const [hasVoice, setHasVoice] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [delayError, setDelayError] = useState(false);

  const showDelay = shouldShowDelaySelection(initialIntent);
  const isInfoIntent = initialIntent === "info";
  const formTitle = getCaptureFormTitle(initialIntent, copy);

  useEffect(() => {
    setIsCollaboration(initialIntent === "collaboration");
    setUrgency(getDefaultDelay(initialIntent));
    setDelayError(false);
    setStatus("idle");
  }, [initialIntent]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const resolvedUrgency: LeadUrgency = showDelay
    ? urgency
    : initialIntent === "urgent"
      ? "urgent"
      : initialIntent === "info"
        ? "info"
        : urgency;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    if (showDelay && !urgency) {
      setDelayError(true);
      setStatus("error");
      return;
    }

    const nameValue = isCollaboration ? proCompanyName : fullName;
    const descriptionOk = projectDescription.trim().length > 0;

    if (
      !nameValue.trim() ||
      !phone.trim() ||
      selectedServices.length === 0 ||
      !descriptionOk
    ) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 1100));
      void resolvedUrgency;
      void hasVoice;
      void photoFiles;
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <>
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-center"
          role="status"
        >
          <p className="text-4xl" aria-hidden>
            ✓
          </p>
          <h3 className="mt-2 text-xl font-bold text-emerald-950">{form.successTitle}</h3>
          <p className="mt-2 text-sm text-emerald-900">{form.successBody}</p>
          {isPro ? (
            <p className="mt-3 text-xs text-emerald-800">{form.smsAck}</p>
          ) : null}
          <button
            type="button"
            onClick={onBack}
            className="mt-5 text-sm font-semibold text-[var(--primary-color)] underline"
          >
            {det.back}
          </button>
        </motion.section>
        <VitrineFooter label={copy.poweredBy} />
      </>
    );
  }

  const nameLabel = isCollaboration ? form.partnerCompanyName : form.fullName;
  const namePlaceholder = isCollaboration
    ? form.partnerCompanyPlaceholder
    : form.fullNamePlaceholder;
  const nameValue = isCollaboration ? proCompanyName : fullName;
  const setNameValue = isCollaboration ? setProCompanyName : setFullName;

  const textLabel = isCollaboration
    ? form.proProject
    : isInfoIntent
      ? form.question
      : form.project;
  const textPlaceholder = isCollaboration
    ? form.proProjectPlaceholder
    : isInfoIntent
      ? form.questionPlaceholder
      : form.projectPlaceholder;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 pb-4"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-semibold text-[var(--v-accent)]"
      >
        ← {det.back}
      </button>

      <div className="rounded-[24px] border border-[var(--v-muted)]/15 bg-[var(--v-surface)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-sm font-bold text-[var(--v-text)]">{det.servicesTitle}</h2>
        <p className="mt-1 text-xs text-[var(--v-muted)]">{det.servicesHint}</p>
        <ul className="mt-4 space-y-2">
          {services.map((service) => {
            const checked = selectedServices.includes(service.id);
            return (
              <li key={service.id}>
                <label
                  className={`flex cursor-pointer gap-3 rounded-2xl border p-3.5 transition ${
                    checked
                      ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_8%,white)]"
                      : "border-[var(--v-muted)]/15 bg-[var(--bg-color)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary-color)]"
                    checked={checked}
                    onChange={() => toggleService(service.id)}
                  />
                  <span className="min-w-0 text-left">
                    <span className="block text-sm font-semibold text-[var(--v-text)]">
                      {service.title}
                    </span>
                    {service.description ? (
                      <span className="mt-0.5 block text-xs text-[var(--v-muted)]">
                        {service.description}
                      </span>
                    ) : null}
                    <span className="mt-1 block text-xs font-bold text-[var(--primary-color)]">
                      {service.priceHtLabel} · {copy.services.priceHt}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 rounded-[24px] border-2 border-[var(--primary-color)]/25 bg-[color-mix(in_srgb,var(--primary-color)_6%,var(--bg-color))] p-5 shadow-[0_20px_48px_color-mix(in_srgb,var(--primary-color)_18%,transparent)]"
      >
        <h2 className="text-base font-bold text-[var(--v-text)]">{formTitle}</h2>

        {showCollaborationToggle ? (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--v-accent)]/25 bg-[var(--v-surface)] p-3">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[var(--primary-color)]"
              checked={isCollaboration}
              onChange={(e) => setIsCollaboration(e.target.checked)}
            />
            <span className="text-sm font-medium text-[var(--v-text)]">
              {form.collaborationToggle}
            </span>
          </label>
        ) : null}

        {isPro && !isCollaboration ? (
          <VitrineVoiceCapture copy={copy} onRecorded={setHasVoice} />
        ) : null}

        {isPro && !isCollaboration ? (
          <VitrinePhotoUpload copy={copy} onChange={setPhotoFiles} />
        ) : null}

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {nameLabel}
            </label>
            <input
              required
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              placeholder={namePlaceholder}
              className="mt-1.5 w-full rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {form.phone}
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={form.phonePlaceholder}
              className="mt-1.5 w-full rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]"
            />
          </div>

          {showDelay ? (
            <VitrineDelayPills
              value={urgency}
              onChange={(value) => {
                setUrgency(value);
                setDelayError(false);
              }}
              copy={copy}
            />
          ) : null}

          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {textLabel}
            </label>
            <textarea
              required
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder={textPlaceholder}
              className="mt-1.5 w-full resize-y rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]"
            />
          </div>
        </div>

        {status === "error" ? (
          <p
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            <span className="font-semibold">{form.errorTitle}</span>
            <br />
            {delayError ? form.selectDelay : form.errorBody}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-5 flex min-h-[3.5rem] w-full items-center justify-center rounded-[20px] bg-[var(--primary-color)] text-base font-bold text-[var(--v-primary-fg)] disabled:opacity-60"
        >
          {status === "submitting" ? form.submitting : form.submit}
        </button>

        {isPro ? (
          <p className="mt-3 text-center text-xs text-[var(--v-muted)]">{form.smsAck}</p>
        ) : null}
      </form>

      <VitrineFooter label={copy.poweredBy} />
    </motion.section>
  );
}
