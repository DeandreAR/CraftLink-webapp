"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type {
  LeadFormStatus,
  LeadUrgency,
  PublicPlanTier,
  VitrineOpenIntent,
  VitrineService,
} from "@/domain/vitrine";
import { isProPublicPlan } from "@/lib/planTier/publicPlanTier";
import {
  areServicesRequired,
  getCaptureFormTitle,
  getDefaultDelay,
  shouldShowDelaySelection,
  shouldShowServices,
} from "@/lib/vitrine/captureForm";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineBackButton } from "@/components/vitrine/VitrineBackButton";
import { VitrineCollaborationForm } from "@/components/vitrine/VitrineCollaborationForm";
import { VitrineDelaySelect } from "@/components/vitrine/VitrineDelaySelect";
import { VitrineFooter } from "@/components/vitrine/VitrineFooter";
import { VitrinePhotoUpload } from "@/components/vitrine/VitrinePhotoUpload";
import { VitrineServicesPicker } from "@/components/vitrine/VitrineServicesPicker";
import { VitrineVoiceCapture } from "@/components/vitrine/VitrineVoiceCapture";

type VitrineDetailsSectionProps = {
  planTier: PublicPlanTier;
  services: VitrineService[];
  copy: VitrineDictionary;
  initialIntent?: VitrineOpenIntent;
  onBack: () => void;
};

export function VitrineDetailsSection({
  planTier,
  services,
  copy,
  initialIntent = "quote",
  onBack,
}: VitrineDetailsSectionProps) {
  if (initialIntent === "collaboration") {
    return <VitrineCollaborationForm copy={copy} onBack={onBack} />;
  }

  return (
    <CaptureFormBody
      planTier={planTier}
      services={services}
      copy={copy}
      initialIntent={initialIntent}
      onBack={onBack}
    />
  );
}

type CaptureFormBodyProps = {
  planTier: PublicPlanTier;
  services: VitrineService[];
  copy: VitrineDictionary;
  initialIntent: VitrineOpenIntent;
  onBack: () => void;
};

function CaptureFormBody({
  planTier,
  services,
  copy,
  initialIntent,
  onBack,
}: CaptureFormBodyProps) {
  const isPro = isProPublicPlan(planTier);
  const form = copy.form;
  const det = copy.details;

  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [urgency, setUrgency] = useState<LeadUrgency>(getDefaultDelay(initialIntent));
  const [projectDescription, setProjectDescription] = useState("");
  const [hasVoice, setHasVoice] = useState(false);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [delayError, setDelayError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const showDelay = shouldShowDelaySelection(initialIntent);
  const showServices = shouldShowServices(initialIntent);
  const servicesRequired = areServicesRequired(initialIntent);
  const isInfoIntent = initialIntent === "info";
  const isQuoteIntent = initialIntent === "quote";
  const formTitle = getCaptureFormTitle(initialIntent, copy);
  const maxPhotos = isInfoIntent ? 1 : 3;
  const servicesOnTop = isQuoteIntent;

  useEffect(() => {
    setUrgency(getDefaultDelay(initialIntent));
    setDelayError(false);
    setDescriptionError(false);
    setStatus("idle");
    setSelectedServices([]);
    setPhotoFiles([]);
    setHasVoice(false);
    setProjectDescription("");
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

  const isDescriptionValid = (): boolean => {
    if (isQuoteIntent && isPro) {
      return projectDescription.trim().length > 0 || hasVoice;
    }
    return projectDescription.trim().length > 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    setDelayError(false);
    setDescriptionError(false);

    if (showDelay && !urgency) {
      setDelayError(true);
      setStatus("error");
      return;
    }

    if (!isDescriptionValid()) {
      setDescriptionError(true);
      setStatus("error");
      return;
    }

    const servicesOk = !servicesRequired || selectedServices.length > 0;

    if (!fullName.trim() || !phone.trim() || !servicesOk) {
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

  const servicesBlock = showServices ? (
    <VitrineServicesPicker
      services={services}
      selectedIds={selectedServices}
      onToggle={toggleService}
      copy={copy}
      required={servicesRequired}
      hint={isQuoteIntent ? det.servicesQuoteHint : undefined}
    />
  ) : null;

  const textLabel = isInfoIntent ? form.question : form.project;
  const textPlaceholder = isInfoIntent
    ? form.questionPlaceholder
    : form.projectPlaceholder;

  const descriptionBlock = (
    <div>
      <label className="text-sm font-semibold text-[var(--v-text)]">{textLabel}</label>
      {isQuoteIntent ? (
        <p className="mt-0.5 text-xs text-[var(--v-muted)]">{form.descriptionHint}</p>
      ) : null}
      <textarea
        rows={4}
        value={projectDescription}
        onChange={(e) => {
          setProjectDescription(e.target.value);
          setDescriptionError(false);
        }}
        placeholder={textPlaceholder}
        className="mt-1.5 w-full resize-y rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]"
      />
      {isQuoteIntent && isPro ? (
        <VitrineVoiceCapture
          copy={copy}
          onRecorded={(recorded) => {
            setHasVoice(recorded);
            setDescriptionError(false);
          }}
          variant="compact"
        />
      ) : null}
    </div>
  );

  const photosBlock =
    isPro && isQuoteIntent ? (
      <VitrinePhotoUpload copy={copy} onChange={setPhotoFiles} maxPhotos={maxPhotos} />
    ) : isPro && isInfoIntent ? (
      <VitrinePhotoUpload copy={copy} onChange={setPhotoFiles} maxPhotos={1} />
    ) : null;

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 pb-4"
    >
      <VitrineBackButton label={det.back} onClick={onBack} />

      {servicesOnTop && servicesBlock ? (
        <div className="mb-5">{servicesBlock}</div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border-2 border-[var(--primary-color)]/25 bg-[color-mix(in_srgb,var(--primary-color)_6%,var(--bg-color))] p-5 shadow-[0_20px_48px_color-mix(in_srgb,var(--primary-color)_18%,transparent)]"
      >
        <h2 className="text-base font-bold text-[var(--v-text)]">{formTitle}</h2>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {form.fullName}
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={form.fullNamePlaceholder}
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
            <VitrineDelaySelect
              value={urgency}
              onChange={(value) => {
                setUrgency(value);
                setDelayError(false);
              }}
              copy={copy}
            />
          ) : null}

          {descriptionBlock}

          {photosBlock}
        </div>

        {status === "error" ? (
          <p
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            <span className="font-semibold">{form.errorTitle}</span>
            <br />
            {delayError
              ? form.selectDelay
              : descriptionError
                ? form.needDescriptionOrVoice
                : form.errorBody}
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

      {!servicesOnTop && servicesBlock ? (
        <div className="mt-5">{servicesBlock}</div>
      ) : null}

      <VitrineFooter label={copy.poweredBy} />
    </motion.section>
  );
}
