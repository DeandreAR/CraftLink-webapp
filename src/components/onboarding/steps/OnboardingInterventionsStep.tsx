"use client";

import { useState } from "react";
import {
  MAX_ONBOARDING_SERVICES,
  type OnboardingCurrency,
  type OnboardingProfileDraft,
  type OnboardingService,
  type OnboardingServicePriceMode,
  type OnboardingSocialDraft,
} from "@/domain/onboarding";
import type { Locale } from "@/i18n/config";
import type { OnboardingDictionary } from "@/i18n/types";
import { authFieldClassName, authLabelClassName } from "@/components/auth/authFormStyles";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  getInterventionsForMetier,
  MAX_INTERVENTION_TAGS,
} from "@/lib/onboarding/interventionTags";
import { ONBOARDING_SOCIAL_FIELDS } from "@/lib/onboarding/socialLinks";
import { formatOnboardingPriceLabel } from "@/lib/onboarding/toVitrineServices";
import type { MetierKey } from "@/lib/vitrine/metierConfigs";

type OnboardingInterventionsStepProps = {
  copy: OnboardingDictionary;
  locale: Locale;
  profile: OnboardingProfileDraft;
  services: OnboardingService[];
  onProfileChange: (patch: Partial<OnboardingProfileDraft>) => void;
  onServicesChange: (services: OnboardingService[]) => void;
};

function formatSelectionCounter(
  template: string,
  count: number,
  max: number,
): string {
  return template.replace("{count}", String(count)).replace("{max}", String(max));
}

function OptionalBadge({ label }: { label: string }) {
  return (
    <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-500">
      {label}
    </span>
  );
}

function RequiredBadge({ label }: { label: string }) {
  return (
    <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
      {label}
    </span>
  );
}

function patchSocial(
  profile: OnboardingProfileDraft,
  onProfileChange: (patch: Partial<OnboardingProfileDraft>) => void,
  key: keyof OnboardingSocialDraft,
  value: string,
) {
  onProfileChange({ social: { ...profile.social, [key]: value } });
}

export function OnboardingInterventionsStep({
  copy,
  profile,
  services,
  onProfileChange,
  onServicesChange,
}: OnboardingInterventionsStepProps) {
  const i = copy.interventions;
  const s = copy.services;
  const [customTag, setCustomTag] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [priceMode, setPriceMode] = useState<OnboardingServicePriceMode>("amount");
  const [currency, setCurrency] = useState<OnboardingCurrency>("EUR");

  const metierKey = profile.metierKey as MetierKey | "";
  const availableTags =
    metierKey && metierKey.length > 0 ? getInterventionsForMetier(metierKey) : [];

  const selected = profile.selectedInterventions;
  const selectedCount = selected.length;
  const atTagMax = selectedCount >= MAX_INTERVENTION_TAGS;
  const atServiceMax = services.length >= MAX_ONBOARDING_SERVICES;
  const accentColor = profile.visual.accentColor;

  const mode = profile.presentationMode;
  const tagsLocked = mode === "about";
  const aboutLocked = mode === "interventions";

  const activateInterventions = () => {
    onProfileChange({
      presentationMode: "interventions",
      aboutText: "",
    });
  };

  const activateAbout = () => {
    onProfileChange({
      presentationMode: "about",
      selectedInterventions: [],
    });
  };

  const toggleTag = (tag: string) => {
    if (tagsLocked) return;
    if (selected.includes(tag)) {
      const next = selected.filter((t) => t !== tag);
      onProfileChange({
        selectedInterventions: next,
        presentationMode: next.length > 0 ? "interventions" : null,
      });
      return;
    }
    if (atTagMax) return;
    onProfileChange({
      presentationMode: "interventions",
      aboutText: "",
      selectedInterventions: [...selected, tag],
    });
  };

  const removeTag = (tag: string) => {
    const next = selected.filter((t) => t !== tag);
    onProfileChange({
      selectedInterventions: next,
      presentationMode: next.length > 0 ? "interventions" : null,
    });
  };

  const addCustomTag = () => {
    const trimmed = customTag.trim();
    if (!trimmed || atTagMax || selected.includes(trimmed) || tagsLocked) return;
    onProfileChange({
      presentationMode: "interventions",
      aboutText: "",
      selectedInterventions: [...selected, trimmed],
    });
    setCustomTag("");
  };

  const handleAboutChange = (value: string) => {
    if (value.trim().length > 0) {
      onProfileChange({
        presentationMode: "about",
        aboutText: value,
        selectedInterventions: [],
      });
    } else {
      onProfileChange({
        aboutText: "",
        presentationMode: mode === "about" ? null : mode,
      });
    }
  };

  const addService = () => {
    const trimmed = serviceName.trim();
    if (!trimmed || atServiceMax) return;
    const parsed = priceInput.trim()
      ? Number.parseFloat(priceInput.replace(",", "."))
      : undefined;
    const price =
      parsed != null && !Number.isNaN(parsed) && parsed > 0 ? parsed : undefined;
    onServicesChange([
      ...services,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        priceMode: priceMode === "quote" ? "quote" : "amount",
        price: priceMode === "quote" ? undefined : price,
        currency,
      },
    ]);
    setServiceName("");
    setPriceInput("");
    setPriceMode("amount");
  };

  const priceLabels = {
    pricePrefix: s.pricePrefix,
    priceSuffixEur: s.priceSuffixEur,
    priceSuffixUsd: s.priceSuffixUsd,
    surDevis: copy.publicServices.surDevis,
  };

  const sectionLockedClass = "pointer-events-none opacity-45";

  return (
    <div
      className="space-y-6"
      style={{ ["--primary-color" as string]: accentColor }}
    >
      <div>
        <h2 className="text-lg font-bold text-black">{i.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">{i.subtitle}</p>
      </div>

      {!metierKey ? (
        <p className="text-sm text-amber-800">{i.selectMetierFirst}</p>
      ) : (
        <>
          <div className={tagsLocked ? sectionLockedClass : undefined}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-neutral-500">
                {i.tagsLabel}
              </p>
              <RequiredBadge label={i.requiredBadge} />
            </div>
            <p className="mt-1 text-xs text-neutral-600">{i.tagsHint}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const active = selected.includes(tag);
                const disabled = tagsLocked || (!active && atTagMax);
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={active}
                    disabled={disabled}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white shadow-sm"
                        : disabled
                          ? "cursor-not-allowed border-neutral-200 bg-white text-neutral-500 opacity-40"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                placeholder={i.customTagPlaceholder}
                disabled={atTagMax || tagsLocked}
                className={`${authFieldClassName} mt-0 flex-1`}
              />
              <GlowButton
                type="button"
                variant="secondary"
                disabled={atTagMax || !customTag.trim() || tagsLocked}
                onClick={addCustomTag}
                className="shrink-0 self-end"
              >
                {i.addCustomTag}
              </GlowButton>
            </div>

            {selected.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs font-semibold text-neutral-600">{i.selectedListLabel}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.map((tag) => (
                    <li key={tag}>
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--primary-color)] bg-[var(--primary-color)]/10 px-3 py-1 text-xs font-semibold text-neutral-800">
                        {tag}
                        <button
                          type="button"
                          disabled={tagsLocked}
                          onClick={() => removeTag(tag)}
                          className="ml-0.5 rounded-full px-1 text-neutral-500 hover:text-black"
                          aria-label={`${i.removeTag} ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <p className="mt-3 text-sm font-medium text-neutral-700" aria-live="polite">
              {formatSelectionCounter(i.selectionCounter, selectedCount, MAX_INTERVENTION_TAGS)}
            </p>
            {atTagMax ? (
              <p className="mt-1 text-xs text-neutral-500">{i.tagsMaxReached}</p>
            ) : null}
            {tagsLocked ? (
              <button
                type="button"
                onClick={activateInterventions}
                className="mt-2 text-xs font-semibold text-[#c45c3e] underline"
              >
                {i.switchToTags}
              </button>
            ) : null}
          </div>

          <div className="relative flex items-center py-2">
            <div className="h-px flex-1 bg-neutral-200" aria-hidden />
            <span className="mx-4 text-lg font-black tracking-widest text-neutral-400">
              {i.orDivider}
            </span>
            <div className="h-px flex-1 bg-neutral-200" aria-hidden />
          </div>

          <div className={aboutLocked ? sectionLockedClass : undefined}>
            <label htmlFor="about-text" className={`${authLabelClassName} inline-flex flex-wrap items-center`}>
              {i.aboutLabel}
              <RequiredBadge label={i.requiredBadge} />
            </label>
            <p className="mt-0.5 text-xs text-neutral-600">{i.aboutHint}</p>
            <textarea
              id="about-text"
              rows={4}
              value={profile.aboutText}
              onChange={(e) => handleAboutChange(e.target.value)}
              onFocus={() => {
                if (profile.aboutText.trim().length > 0) activateAbout();
              }}
              placeholder={i.aboutPlaceholder}
              disabled={aboutLocked}
              className={`${authFieldClassName} resize-y`}
            />
            {aboutLocked ? (
              <button
                type="button"
                onClick={activateAbout}
                className="mt-2 text-xs font-semibold text-[#c45c3e] underline"
              >
                {i.switchToAbout}
              </button>
            ) : null}
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 space-y-4">
            <div>
              <p className="inline-flex flex-wrap items-center text-sm font-bold text-neutral-900">
                {s.title}
                <OptionalBadge label={s.optionalBadge} />
              </p>
              <p className="mt-1 text-xs text-neutral-600">{s.subtitle}</p>
            </div>
            <div>
              <label htmlFor="service-name" className={authLabelClassName}>
                {s.nameLabel}
              </label>
              <input
                id="service-name"
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder={s.namePlaceholder}
                disabled={atServiceMax}
                className={authFieldClassName}
              />
            </div>
            <div>
              <p className={authLabelClassName}>{s.priceLabel}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPriceMode("quote")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    priceMode === "quote"
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  {s.surDevisOption}
                </button>
                <button
                  type="button"
                  onClick={() => setPriceMode("amount")}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    priceMode === "amount"
                      ? "border-black bg-black text-white"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  {s.amountOption}
                </button>
              </div>
              {priceMode === "amount" ? (
                <div className="mt-3 space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrency("EUR")}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                        currency === "EUR" ? "border-black bg-black text-white" : "border-neutral-200"
                      }`}
                    >
                      {s.currencyEur}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency("USD")}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${
                        currency === "USD" ? "border-black bg-black text-white" : "border-neutral-200"
                      }`}
                    >
                      {s.currencyUsd}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm font-semibold text-neutral-700">
                      {s.pricePrefix}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      disabled={atServiceMax}
                      className={`${authFieldClassName} mt-0 flex-1`}
                    />
                    <span className="shrink-0 text-sm font-semibold text-neutral-700">
                      {currency === "USD" ? s.priceSuffixUsd : s.priceSuffixEur}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
            <GlowButton
              type="button"
              variant="secondary"
              disabled={atServiceMax || !serviceName.trim()}
              onClick={addService}
              className="w-full justify-center disabled:opacity-50"
            >
              {s.add}
            </GlowButton>
            {atServiceMax ? (
              <p className="text-center text-xs text-neutral-500">{s.maxReached}</p>
            ) : null}
          </div>

          {services.length > 0 ? (
            <ul className="space-y-2">
              {services.map((service) => (
                <li
                  key={service.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3"
                >
                  <span className="text-sm font-semibold">{service.name}</span>
                  <span className="shrink-0 text-xs font-bold text-[#c45c3e]">
                    {formatOnboardingPriceLabel(service, priceLabels)}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="rounded-[24px] border border-neutral-200 bg-white p-4 space-y-4">
            <div>
              <p className="inline-flex flex-wrap items-center text-sm font-bold text-neutral-900">
                {i.socialTitle}
                <OptionalBadge label={i.optionalBadge} />
              </p>
              <p className="mt-1 text-xs text-neutral-600">{i.socialHint}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {ONBOARDING_SOCIAL_FIELDS.map(({ key, label }) => (
                <div key={key}>
                  <label htmlFor={`social-${key}`} className={authLabelClassName}>
                    {label}
                  </label>
                  <input
                    id={`social-${key}`}
                    type="text"
                    value={profile.social[key]}
                    onChange={(e) => patchSocial(profile, onProfileChange, key, e.target.value)}
                    placeholder={i.socialPlaceholder}
                    className={authFieldClassName}
                  />
                </div>
              ))}
            </div>
            <div>
              <label htmlFor="google-business" className={authLabelClassName}>
                {i.googleBusinessLabel}
              </label>
              <p className="mt-0.5 text-xs text-neutral-600">{i.googleBusinessHint}</p>
              <input
                id="google-business"
                type="url"
                value={profile.social.googleBusinessUrl}
                onChange={(e) =>
                  patchSocial(profile, onProfileChange, "googleBusinessUrl", e.target.value)
                }
                placeholder={i.googleBusinessPlaceholder}
                className={authFieldClassName}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function isInterventionsStepValid(profile: OnboardingProfileDraft): boolean {
  if (!profile.metierKey) return false;
  if (profile.presentationMode === "interventions") {
    return profile.selectedInterventions.length > 0;
  }
  if (profile.presentationMode === "about") {
    return profile.aboutText.trim().length > 1;
  }
  return false;
}
