import type { LandingControlDictionary } from "@/i18n/landing/types";

type LandingCompareCardsProps = {
  compare: LandingControlDictionary["compare"];
};

/** Avant / Après — hiérarchie claire, mobile first. */
export function LandingCompareCards({ compare }: LandingCompareCardsProps) {
  return (
    <div className="mt-14 md:mt-20">
      <div className="text-center md:text-left">
        <span className="lk-eyebrow">{compare.eyebrow}</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5">
        <article className="rounded-[24px] border border-red-200/70 bg-gradient-to-b from-red-50/80 to-white p-6 md:p-8">
          <span className="inline-flex rounded-full bg-red-500 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
            {compare.without.label}
          </span>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-black md:text-xl">
            {compare.without.title}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {compare.without.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-snug text-zinc-700 md:text-[0.95rem]"
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
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[24px] border border-[#efa188]/35 bg-white p-6 shadow-[0_8px_28px_rgba(239,161,136,0.12)] md:p-8">
          <span className="inline-flex rounded-full border border-[#efa188]/35 bg-[#efa188]/12 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#c45c3e]">
            {compare.with.label}
          </span>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-black md:text-xl">
            {compare.with.title}
          </h3>
          <ul className="mt-5 space-y-3.5">
            {compare.with.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-snug text-zinc-700 md:text-[0.95rem]"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b2f5ea] text-black"
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
