type VitrineCertificationBadgesProps = {
  items: string[];
  ariaLabel: string;
};

const BADGE_ACCENTS = [
  "border-[#EFA188]/40 bg-[#EFA188]/14 text-[#212129]",
  "border-[#D6BCFA]/55 bg-[#D6BCFA]/25 text-[#212129]",
  "border-[#B2F5EA]/60 bg-[#B2F5EA]/30 text-[#212129]",
] as const;

export function VitrineCertificationBadges({
  items,
  ariaLabel,
}: VitrineCertificationBadgesProps) {
  if (items.length === 0) return null;

  return (
    <ul
      className="mt-4 flex flex-wrap justify-center gap-2"
      aria-label={ariaLabel}
    >
      {items.map((label, index) => (
        <li key={`${label}-${index}`}>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-tight shadow-sm ${BADGE_ACCENTS[index % BADGE_ACCENTS.length]}`}
          >
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
