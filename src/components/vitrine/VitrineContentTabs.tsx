"use client";

type VitrineContentTabsProps = {
  contactLabel: string;
  proSelectionLabel: string;
  active: "contact" | "pro";
  onChange: (tab: "contact" | "pro") => void;
  showProSelection: boolean;
};

/** Onglets isolés du thème pleine page (évite texte blanc sur fond blanc). */
export function VitrineContentTabs({
  contactLabel,
  proSelectionLabel,
  active,
  onChange,
  showProSelection,
}: VitrineContentTabsProps) {
  if (!showProSelection) return null;

  return (
    <div className="relative z-20 mx-4 mt-2 grid grid-cols-2 gap-1 rounded-2xl border border-neutral-200/90 bg-white p-1 shadow-sm sm:mx-5">
      <button
        type="button"
        onClick={() => onChange("contact")}
        className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
          active === "contact"
            ? "!bg-neutral-900 !text-white shadow-sm"
            : "!bg-transparent !text-neutral-600 hover:!bg-neutral-100 hover:!text-neutral-900"
        }`}
      >
        {contactLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("pro")}
        className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
          active === "pro"
            ? "!bg-neutral-900 !text-white shadow-sm"
            : "!bg-transparent !text-neutral-600 hover:!bg-neutral-100 hover:!text-neutral-900"
        }`}
      >
        {proSelectionLabel}
      </button>
    </div>
  );
}
