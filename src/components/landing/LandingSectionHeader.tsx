import type { ReactNode } from "react";

type LandingSectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  id?: string;
  className?: string;
};

export function LandingSectionHeader({
  index,
  eyebrow,
  title,
  lead,
  id,
  className = "",
}: LandingSectionHeaderProps) {
  return (
    <header className={`max-w-3xl ${className}`.trim()}>
      <span className="lk-section-index" aria-hidden>
        {index}
      </span>
      <span className="lk-eyebrow">{eyebrow}</span>
      <h2
        id={id}
        className="lk-display mt-5 text-[1.85rem] sm:text-3xl md:text-[2.65rem] lg:text-[2.85rem]"
      >
        {title}
      </h2>
      {lead ? <p className="lk-lead mt-4 text-base md:text-lg">{lead}</p> : null}
      <hr className="lk-paint-rule mt-8 max-w-xs" aria-hidden />
    </header>
  );
}
