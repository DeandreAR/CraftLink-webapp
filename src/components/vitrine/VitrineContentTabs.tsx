"use client";

type VitrineContentTabsProps = {
  contactLabel: string;
  proSelectionLabel: string;
  active: "contact" | "pro";
  onChange: (tab: "contact" | "pro") => void;
  showProSelection: boolean;
};

export function VitrineContentTabs({
  contactLabel,
  proSelectionLabel,
  active,
  onChange,
  showProSelection,
}: VitrineContentTabsProps) {
  if (!showProSelection) return null;

  return (
    <div className="mx-4 mt-2 grid grid-cols-2 gap-1 rounded-2xl border border-neutral-200 bg-neutral-50 p-1 sm:mx-5">
      <button
        type="button"
        onClick={() => onChange("contact")}
        className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
          active === "contact"
            ? "bg-white text-neutral-900 shadow-sm"
            : "text-neutral-500 hover:text-neutral-800"
        }`}
      >
        {contactLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange("pro")}
        className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${
          active === "pro"
            ? "bg-white text-neutral-900 shadow-sm"
            : "text-neutral-500 hover:text-neutral-800"
        }`}
      >
        {proSelectionLabel}
      </button>
    </div>
  );
}
