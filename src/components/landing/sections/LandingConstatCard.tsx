import type { PricingSplitContrastDictionary } from "@/i18n/types";

type LandingConstatCardProps = {
  contrast: PricingSplitContrastDictionary;
};

export function LandingConstatCard({ contrast }: LandingConstatCardProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] md:mt-12">
      <div className="border-b border-black/5 bg-gradient-to-br from-[#efa188]/14 via-white to-[#b2f5ea]/20 px-6 py-8 md:px-10 md:py-11">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e08a6f]">
              {contrast.eyebrow}
            </span>
            <p className="lk-display mt-3 text-[1.65rem] text-black md:text-3xl">
              {contrast.headline}
            </p>
          </div>
          <p className="shrink-0 self-start rounded-[20px] border border-[#efa188]/40 bg-white px-4 py-3 text-center text-sm font-bold tracking-tight text-[#c45c3e] shadow-sm md:text-base">
            {contrast.payoff}
          </p>
        </div>
      </div>

      <ul className="grid gap-3 p-5 sm:grid-cols-2 md:gap-4 md:p-8">
        {contrast.painPoints.map((point) => (
          <li
            key={point}
            className="flex gap-3 rounded-[20px] border border-black/6 bg-[#fafafa] px-4 py-3.5 text-sm font-medium leading-snug text-zinc-800 md:text-[0.95rem]"
          >
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-white"
              aria-hidden
            >
              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
                <path
                  d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
