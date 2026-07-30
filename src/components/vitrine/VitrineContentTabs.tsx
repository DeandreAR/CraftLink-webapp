"use client";

import { motion } from "framer-motion";

type VitrineContentTabsProps = {
  contactLabel: string;
  proSelectionLabel: string;
  active: "contact" | "pro";
  onChange: (tab: "contact" | "pro") => void;
  showProSelection: boolean;
};

/**
 * Switch Contact / Sélection Pro — piste gris clair + pastille blanche active.
 */
export function VitrineContentTabs({
  contactLabel,
  proSelectionLabel,
  active,
  onChange,
  showProSelection,
}: VitrineContentTabsProps) {
  if (!showProSelection) return null;

  return (
    <div className="relative z-20 mx-4 mt-3 sm:mx-5">
      <div
        className="grid grid-cols-2 gap-0 rounded-full bg-[#f4f4f5] p-1 ring-1 ring-neutral-200/90"
        role="tablist"
        aria-label="Navigation vitrine"
      >
        <TabButton
          label={contactLabel}
          selected={active === "contact"}
          onClick={() => onChange("contact")}
          layoutId="vitrine-tab-pill"
        />
        <TabButton
          label={proSelectionLabel}
          selected={active === "pro"}
          onClick={() => onChange("pro")}
          layoutId="vitrine-tab-pill"
        />
      </div>
    </div>
  );
}

function TabButton({
  label,
  selected,
  onClick,
  layoutId,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  layoutId: string;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`relative z-0 rounded-full px-3 py-2.5 text-[13px] font-semibold tracking-tight transition-colors sm:text-sm ${
        selected ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-800"
      }`}
    >
      {selected ? (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] ring-1 ring-black/5"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : null}
      <span className="relative">{label}</span>
    </button>
  );
}
