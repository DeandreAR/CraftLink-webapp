import type { OnboardingDictionary } from "@/i18n/types";

type ProEditableFieldsChecklistProps = {
  copy: OnboardingDictionary;
  className?: string;
};

export function ProEditableFieldsChecklist({
  copy,
  className = "",
}: ProEditableFieldsChecklistProps) {
  const items = copy.pro.editableFieldsList;

  return (
    <div
      className={`rounded-[20px] border border-neutral-200 bg-neutral-50/90 px-4 py-3 text-left ${className}`}
    >
      <p className="text-xs font-semibold text-neutral-800">{copy.pro.editableFieldsTitle}</p>
      <ul className="mt-2 space-y-1.5 text-xs text-neutral-600">
        {items.map((label) => (
          <li key={label} className="flex items-start gap-2">
            <span className="mt-0.5 text-[#c45c3e]" aria-hidden>
              •
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
