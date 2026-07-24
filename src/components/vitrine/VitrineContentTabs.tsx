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
 * Segmented control style Linktree : piste sombre + pastille blanche active.
 * Isolé du thème pleine page (contraste garanti).
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
        className="grid grid-cols-2 gap-0 rounded-full bg-neutral-950/90 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.18)] ring-1 ring-black/10 backdrop-blur-md"
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
        selected ? "text-neutral-950" : "text-white/75 hover:text-white"
      }`}
    >
      {selected ? (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      ) : null}
      <span className="relative">{label}</span>
    </button>
  );
}
