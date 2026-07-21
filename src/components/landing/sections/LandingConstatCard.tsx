import type { PricingSplitContrastDictionary } from "@/i18n/types";

type LandingConstatCardProps = {
  contrast: PricingSplitContrastDictionary;
};

/** « Le constat » — version light OpenShip (ex-bloc sombre tarifs). */
export function LandingConstatCard({ contrast }: LandingConstatCardProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] md:mt-12">
      <div className="border-b border-zinc-100 bg-gradient-to-br from-[#efa188]/12 via-white to-[#5fecd5]/8 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#efa188]">
              {contrast.eyebrow}
            </span>
            <p className="lk-display mt-3 text-2xl text-zinc-900 md:text-3xl">
              {contrast.headline}
            </p>
          </div>
          <p className="shrink-0 self-start rounded-xl border border-[#efa188]/35 bg-[#efa188]/10 px-4 py-2.5 text-center text-sm font-bold tracking-tight text-[#c45c3e] md:text-base">
            {contrast.payoff}
          </p>
        </div>
      </div>

      <ul className="grid gap-3 p-5 sm:grid-cols-2 md:gap-4 md:p-8">
        {contrast.painPoints.map((point) => (
          <li
            key={point}
            className="flex gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-4 py-3.5 text-sm font-medium leading-snug text-zinc-800 md:text-[0.9375rem]"
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
