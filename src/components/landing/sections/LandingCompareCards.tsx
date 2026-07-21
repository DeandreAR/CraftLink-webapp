import type { LandingControlDictionary } from "@/i18n/landing/types";

type LandingCompareCardsProps = {
  compare: LandingControlDictionary["compare"];
};

/** Avant / Après — style OpenShip Light. */
export function LandingCompareCards({ compare }: LandingCompareCardsProps) {
  return (
    <div className="mt-12 md:mt-16">
      <span className="lk-eyebrow">{compare.eyebrow}</span>

      <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-5">
        {/* Chaos */}
        <article className="rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50/90 to-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] md:p-7">
          <span className="inline-flex rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
            {compare.without.label}
          </span>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900 md:text-xl">
            {compare.without.title}
          </h3>
          <ul className="mt-5 space-y-3">
            {compare.without.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-snug text-zinc-700 md:text-[0.9375rem]">
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
                {item}
              </li>
            ))}
          </ul>
        </article>

        {/* Clarté CraftLink */}
        <article className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_2px_15px_rgba(0,0,0,0.03)] ring-1 ring-[#efa188]/15 md:p-7">
          <span className="inline-flex rounded-full border border-[#efa188]/30 bg-[#efa188]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#c45c3e]">
            {compare.with.label}
          </span>
          <h3 className="mt-4 text-lg font-bold tracking-tight text-zinc-900 md:text-xl">
            {compare.with.title}
          </h3>
          <ul className="mt-5 space-y-3">
            {compare.with.items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-snug text-zinc-700 md:text-[0.9375rem]">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5fecd5] text-zinc-900"
                  aria-hidden
                >
                  <svg viewBox="0 0 16 16" className="h-2.5 w-2.5" fill="none">
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}
