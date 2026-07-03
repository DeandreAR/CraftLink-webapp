"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import {
  LuArrowDown,
  LuMegaphone,
  LuPackage,
  LuSparkles,
  LuTrendingUp,
  LuUsers,
  LuVideo,
} from "react-icons/lu";
import type { LeadFormStatus } from "@/domain/vitrine";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineBackButton } from "@/components/vitrine/VitrineBackButton";
import { VitrineFooter } from "@/components/vitrine/VitrineFooter";

type PartnershipType = "advertising" | "ugc" | "product_test" | "other";

type BudgetRange =
  | "under_5k"
  | "from_5k_to_15k"
  | "from_15k_to_50k"
  | "over_50k"
  | "undisclosed";

type VitrineCollaborationFormProps = {
  copy: VitrineDictionary;
  onBack: () => void;
};

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none transition focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary-color)_15%,transparent)]";

export function VitrineCollaborationForm({
  copy,
  onBack,
}: VitrineCollaborationFormProps) {
  const c = copy.collaboration;
  const formSectionRef = useRef<HTMLElement>(null);

  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnershipType, setPartnershipType] = useState<PartnershipType>("advertising");
  const [budget, setBudget] = useState<BudgetRange | "">("");
  const [budgetCustom, setBudgetCustom] = useState("");
  const [message, setMessage] = useState("");

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    const isValid =
      companyName.trim() &&
      contactName.trim() &&
      jobTitle.trim() &&
      email.trim() &&
      phone.trim() &&
      message.trim();

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const payload = {
        companyName: companyName.trim(),
        contactName: contactName.trim(),
        jobTitle: jobTitle.trim(),
        email: email.trim(),
        phone: phone.trim(),
        partnershipType,
        budgetRange: budget || null,
        budgetApproximate: budgetCustom.trim() || null,
        message: message.trim(),
      };
      await new Promise((r) => setTimeout(r, 1100));
      void payload;
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
          <h3 className="mt-2 text-xl font-bold text-emerald-950">
            {c.form.successTitle}
          </h3>
          <p className="mt-2 text-sm text-emerald-900">{c.form.successBody}</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-5 text-sm font-semibold text-[var(--primary-color)] underline"
          >
            {copy.details.back}
          </button>
        </motion.section>
        <VitrineFooter label={copy.poweredBy} />
      </>
    );
  }

  const statItems = [
    { icon: LuUsers, ...c.stats.artisans },
    { icon: LuTrendingUp, ...c.stats.engagement },
    { icon: LuSparkles, ...c.stats.opportunities },
  ];

  const offerItems = [
    {
      icon: LuMegaphone,
      accent: "bg-[#D6BCFA]/40 text-violet-900",
      ...c.offers.advertising,
    },
    {
      icon: LuVideo,
      accent: "bg-[#B2F5EA]/50 text-teal-900",
      ...c.offers.ugc,
    },
    {
      icon: LuPackage,
      accent: "bg-[#EFA188]/25 text-orange-950",
      ...c.offers.productTest,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="pb-4"
    >
      <div className="px-4">
        <VitrineBackButton label={copy.details.back} onClick={onBack} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-8 pt-2">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-10 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--primary-color)_12%,white)] blur-3xl"
        />
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary-color)]">
          {c.hero.eyebrow}
        </p>
        <h1 className="mt-3 text-[1.65rem] font-extrabold leading-tight tracking-tight text-[var(--v-text)] sm:text-3xl">
          {c.hero.title}
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--v-muted)] sm:text-base">
          {c.hero.subtitle}
        </p>
        <button
          type="button"
          onClick={scrollToForm}
          className="mt-6 inline-flex min-h-[3.25rem] items-center gap-2 rounded-[20px] bg-black px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:bg-slate-900"
        >
          {c.hero.cta}
          <LuArrowDown className="h-4 w-4" aria-hidden />
        </button>
      </section>

      {/* Stats */}
      <section
        aria-label={c.stats.artisans.label}
        className="border-y border-[var(--v-muted)]/10 bg-[color-mix(in_srgb,var(--primary-color)_4%,white)] px-4 py-6"
      >
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {statItems.map(({ icon: Icon, value, label }) => (
            <li
              key={label}
              className="rounded-[20px] border border-[var(--v-muted)]/10 bg-[var(--v-surface)] px-4 py-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
            >
              <Icon
                className="mx-auto h-5 w-5 text-[var(--primary-color)]"
                aria-hidden
              />
              <p className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--v-text)]">
                {value}
              </p>
              <p className="mt-1 text-xs font-medium leading-snug text-[var(--v-muted)]">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Offers */}
      <section className="px-4 py-8">
        <h2 className="text-xl font-bold text-[var(--v-text)]">{c.offers.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--v-muted)]">
          {c.offers.subtitle}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {offerItems.map(({ icon: Icon, accent, title, description, bullets }) => (
            <li
              key={title}
              className="flex flex-col rounded-[24px] border border-[var(--v-muted)]/12 bg-[var(--v-surface)] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${accent}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 text-base font-bold text-[var(--v-text)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--v-muted)]">
                {description}
              </p>
              <ul className="mt-4 space-y-2 border-t border-[var(--v-muted)]/10 pt-4">
                {bullets.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-xs leading-relaxed text-[var(--v-text)]"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary-color)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* Form */}
      <section
        id="partnership-form"
        ref={formSectionRef}
        className="scroll-mt-4 px-4 pb-2"
      >
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-[var(--v-muted)]/15 bg-[var(--v-surface)] p-5 shadow-[0_20px_48px_rgba(15,23,42,0.08)] sm:p-7"
        >
          <h2 className="text-xl font-bold text-[var(--v-text)]">{c.form.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--v-muted)]">
            {c.form.subtitle}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.companyName}
              </label>
              <input
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.contactName}
              </label>
              <input
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.jobTitle}
              </label>
              <input
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.email}
              </label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.phone}
              </label>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.partnershipType}
              </label>
              <select
                required
                value={partnershipType}
                onChange={(e) => setPartnershipType(e.target.value as PartnershipType)}
                className={inputClass}
              >
                {(Object.keys(c.form.partnershipOptions) as PartnershipType[]).map(
                  (key) => (
                    <option key={key} value={key}>
                      {c.form.partnershipOptions[key]}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.budget}{" "}
                <span className="font-normal text-[var(--v-muted)]">
                  ({c.form.budgetOptional})
                </span>
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value as BudgetRange | "")}
                className={inputClass}
              >
                <option value="">—</option>
                {(Object.keys(c.form.budgetOptions) as BudgetRange[]).map((key) => (
                  <option key={key} value={key}>
                    {c.form.budgetOptions[key]}
                  </option>
                ))}
              </select>
              <p className="my-2 text-center text-xs font-medium text-[var(--v-muted)]">
                {c.form.budgetOr}
              </p>
              <label className="sr-only" htmlFor="partnership-budget-custom">
                {c.form.budgetCustom}
              </label>
              <input
                id="partnership-budget-custom"
                type="text"
                value={budgetCustom}
                onChange={(e) => setBudgetCustom(e.target.value)}
                placeholder={c.form.budgetCustomPlaceholder}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.form.message}
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={c.form.messagePlaceholder}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>

          {status === "error" ? (
            <p
              className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
              role="alert"
            >
              {c.form.errorBody}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-6 flex min-h-[3.5rem] w-full items-center justify-center rounded-[20px] bg-black text-base font-bold text-white transition hover:bg-slate-900 disabled:opacity-60"
          >
            {status === "submitting" ? c.form.submitting : c.form.submit}
          </button>
        </form>
      </section>

      <VitrineFooter label={copy.poweredBy} />
    </motion.div>
  );
}
