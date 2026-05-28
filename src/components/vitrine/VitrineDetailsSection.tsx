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
import type { VitrineDictionary } from "@/i18n/types";

type VitrineDetailsSectionProps = {
  planTier: PublicPlanTier;
  services: VitrineService[];
  copy: VitrineDictionary;
  initialIntent?: VitrineOpenIntent;
  onBack: () => void;
};

const URGENCY_VALUES: LeadUrgency[] = ["urgent", "this_week", "flexible"];

export function VitrineDetailsSection({
  planTier,
  services,
  copy,
  initialIntent = "quote",
  onBack,
}: VitrineDetailsSectionProps) {
  const isPro = isProPublicPlan(planTier);
  const det = copy.details;
  const form = copy.form;
  const voice = copy.voice;

  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isCollaboration, setIsCollaboration] = useState(
    initialIntent === "collaboration",
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [proCompanyName, setProCompanyName] = useState("");
  const [urgency, setUrgency] = useState<LeadUrgency>(
    initialIntent === "urgent" ? "urgent" : "this_week",
  );

  useEffect(() => {
    setIsCollaboration(initialIntent === "collaboration");
    setUrgency(initialIntent === "urgent" ? "urgent" : "this_week");
  }, [initialIntent]);
  const [projectDescription, setProjectDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasVoice(true);
      return;
    }
    setIsRecording(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    const needsProject = !isCollaboration && !projectDescription.trim();
    const needsProFields = isCollaboration && (!proCompanyName.trim() || !projectDescription.trim());

    if (
      !fullName.trim() ||
      !phone.trim() ||
      selectedServices.length === 0 ||
      needsProject ||
      needsProFields
    ) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 1100));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-8 rounded-[24px] border border-emerald-200 bg-emerald-50 p-6 text-center"
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
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 pb-10"
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
        <h2 className="text-base font-bold text-[var(--v-text)]">{det.captureTitle}</h2>

        {isPro ? (
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
          <div className="mt-5">
            <p className="text-sm font-bold text-[var(--v-text)]">{voice.title}</p>
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`mt-3 flex min-h-[4.25rem] w-full items-center justify-center gap-2 rounded-[20px] text-base font-bold transition ${
                isRecording
                  ? "animate-pulse bg-red-50 text-red-900 ring-2 ring-red-400"
                  : hasVoice
                    ? "bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400"
                    : "bg-[var(--primary-color)] text-[var(--v-primary-fg)] shadow-lg"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                🎙️
              </span>
              {isRecording
                ? voice.recording
                : hasVoice
                  ? voice.added
                  : voice.record}
            </button>
            {isRecording ? (
              <p className="mt-2 text-center text-xs text-[var(--v-muted)]">{voice.stop}</p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4">
          {isCollaboration ? (
            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {form.proCompanyName}
              </label>
              <input
                required
                value={proCompanyName}
                onChange={(e) => setProCompanyName(e.target.value)}
                placeholder={form.proCompanyPlaceholder}
                className="mt-1.5 w-full rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]"
              />
            </div>
          ) : null}

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

          {!isCollaboration ? (
            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {form.urgency}
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as LeadUrgency)}
                className="mt-1.5 w-full rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]"
              >
                {URGENCY_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {form.urgencyOptions[v]}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {isCollaboration ? form.proProject : form.project}
            </label>
            <textarea
              required
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder={
                isCollaboration ? form.proProjectPlaceholder : form.projectPlaceholder
              }
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
            {form.errorBody}
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
    </motion.section>
  );
}
