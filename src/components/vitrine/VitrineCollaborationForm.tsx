"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { LeadFormStatus } from "@/domain/vitrine";
import type { VitrineDictionary } from "@/i18n/types";
import { VitrineBackButton } from "@/components/vitrine/VitrineBackButton";
import { VitrineFileUpload } from "@/components/vitrine/VitrineFileUpload";
import { VitrineFooter } from "@/components/vitrine/VitrineFooter";

type CollaborationProfile = "peer" | "brand";

type PeerActivity =
  | "architect"
  | "project_manager"
  | "artisan"
  | "builder"
  | "real_estate"
  | "other";

type PeerNeed = "subcontracting" | "project_offer" | "local_partnership";

type BrandPartnership =
  | "product_placement"
  | "material_donation"
  | "affiliate_program"
  | "media_campaign";

type VitrineCollaborationFormProps = {
  copy: VitrineDictionary;
  onBack: () => void;
};

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-[var(--v-muted)]/25 bg-[var(--v-surface)] px-4 py-3.5 text-base outline-none focus:border-[var(--primary-color)]";

export function VitrineCollaborationForm({
  copy,
  onBack,
}: VitrineCollaborationFormProps) {
  const c = copy.collaboration;
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [profile, setProfile] = useState<CollaborationProfile>("peer");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [peerActivity, setPeerActivity] = useState<PeerActivity>("artisan");
  const [peerNeeds, setPeerNeeds] = useState<PeerNeed[]>([]);
  const [brandPartnerships, setBrandPartnerships] = useState<BrandPartnership[]>([]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const togglePeerNeed = (need: PeerNeed) => {
    setPeerNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need],
    );
  };

  const toggleBrandPartnership = (item: BrandPartnership) => {
    setBrandPartnerships((prev) =>
      prev.includes(item) ? prev.filter((n) => n !== item) : [...prev, item],
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    const baseOk =
      companyName.trim() &&
      contactName.trim() &&
      phone.trim() &&
      email.trim() &&
      description.trim();

    const profileOk =
      profile === "peer"
        ? peerNeeds.length > 0
        : brandPartnerships.length > 0;

    const brandOk = profile === "brand" ? jobTitle.trim() : true;

    if (!baseOk || !profileOk || !brandOk) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      await new Promise((r) => setTimeout(r, 1100));
      void files;
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
          <h3 className="mt-2 text-xl font-bold text-emerald-950">{c.successTitle}</h3>
          <p className="mt-2 text-sm text-emerald-900">{c.successBody}</p>
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

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="px-4 pb-4"
    >
      <VitrineBackButton label={copy.details.back} onClick={onBack} />

      <form
        onSubmit={handleSubmit}
        className="rounded-[24px] border border-[var(--v-muted)]/15 bg-[var(--v-surface)] p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
      >
        <h2 className="text-lg font-bold text-[var(--v-text)]">{c.title}</h2>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setProfile("peer")}
            className={`rounded-2xl border-2 px-3 py-3.5 text-left text-xs font-bold leading-snug transition ${
              profile === "peer"
                ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] text-[var(--v-text)]"
                : "border-[var(--v-muted)]/20 bg-[var(--bg-color)] text-[var(--v-muted)]"
            }`}
          >
            {c.profilePeer}
          </button>
          <button
            type="button"
            onClick={() => setProfile("brand")}
            className={`rounded-2xl border-2 px-3 py-3.5 text-left text-xs font-bold leading-snug transition ${
              profile === "brand"
                ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_10%,white)] text-[var(--v-text)]"
                : "border-[var(--v-muted)]/20 bg-[var(--bg-color)] text-[var(--v-muted)]"
            }`}
          >
            {c.profileBrand}
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {profile === "peer" ? c.companyPeer : c.companyBrand}
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
              {c.contactName}
            </label>
            <input
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className={inputClass}
            />
          </div>

          {profile === "brand" ? (
            <div>
              <label className="text-sm font-semibold text-[var(--v-text)]">
                {c.jobTitle}
              </label>
              <input
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={inputClass}
              />
            </div>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {c.phone}
            </label>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {c.email}
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {profile === "peer" ? (
            <>
              <div>
                <label className="text-sm font-semibold text-[var(--v-text)]">
                  {c.activityType}
                </label>
                <select
                  value={peerActivity}
                  onChange={(e) => setPeerActivity(e.target.value as PeerActivity)}
                  className={inputClass}
                >
                  {(Object.keys(c.activityOptions) as PeerActivity[]).map((key) => (
                    <option key={key} value={key}>
                      {c.activityOptions[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-semibold text-[var(--v-text)]">{c.needType}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(c.needOptions) as PeerNeed[]).map((need) => {
                    const active = peerNeeds.includes(need);
                    return (
                      <li key={need}>
                        <button
                          type="button"
                          onClick={() => togglePeerNeed(need)}
                          className={`rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition ${
                            active
                              ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_10%,white)]"
                              : "border-[var(--v-muted)]/20"
                          }`}
                        >
                          {c.needOptions[need]}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm font-semibold text-[var(--v-text)]">
                {c.partnershipType}
              </p>
              <ul className="mt-2 space-y-2">
                {(Object.keys(c.partnershipOptions) as BrandPartnership[]).map((item) => (
                  <li key={item}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--v-muted)]/15 p-3">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 accent-[var(--primary-color)]"
                        checked={brandPartnerships.includes(item)}
                        onChange={() => toggleBrandPartnership(item)}
                      />
                      <span className="text-sm text-[var(--v-text)]">
                        {c.partnershipOptions[item]}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-[var(--v-text)]">
              {c.description}
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                profile === "peer"
                  ? c.descriptionPeerPlaceholder
                  : c.descriptionBrandPlaceholder
              }
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <VitrineFileUpload
          copy={copy}
          label={profile === "peer" ? c.filesPeerLabel : c.filesBrandLabel}
          onChange={setFiles}
        />

        {status === "error" ? (
          <p
            className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900"
            role="alert"
          >
            {c.errorBody}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-5 flex min-h-[3.5rem] w-full items-center justify-center rounded-[20px] bg-[var(--primary-color)] text-base font-bold text-[var(--v-primary-fg)] disabled:opacity-60"
        >
          {status === "submitting" ? c.submitting : c.submit}
        </button>
      </form>

      <VitrineFooter label={copy.poweredBy} />
    </motion.section>
  );
}
