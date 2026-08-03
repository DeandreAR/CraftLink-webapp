import type { LandingControlDictionary } from "@/i18n/landing/types";

type LandingCompareCardsProps = {
  compare: LandingControlDictionary["compare"];
};

/** Avant / Après — contraste fort, mobile first. */
export function LandingCompareCards({ compare }: LandingCompareCardsProps) {
  return (
    <div>
      <div className="text-center md:text-left">
        <span className="lk-eyebrow">{compare.eyebrow}</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5">
        <article className="rounded-[24px] border border-slate-200 bg-gradient-to-b from-rose-50/70 to-white p-6 md:p-8">
          <span className="inline-flex rounded-full bg-slate-800/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white">
            {compare.without.label}
          </span>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            {compare.without.title}
          </h3>
          <p className="mt-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm italic leading-snug text-slate-600">
            &ldquo;{compare.without.example}&rdquo;
          </p>
          <ul className="mt-5 space-y-3.5">
            {compare.without.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-snug text-slate-700 md:text-[0.95rem]"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/90 text-white"
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

        <article className="rounded-[24px] border-2 border-emerald-200/80 bg-white p-6 shadow-sm md:p-8">
          <span className="inline-flex rounded-full border border-emerald-300/70 bg-emerald-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-emerald-800">
            {compare.with.label}
          </span>
          <h3 className="mt-5 text-lg font-bold tracking-tight text-slate-900 md:text-xl">
            {compare.with.title}
          </h3>
          <p className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-sm leading-snug text-slate-700">
            {compare.with.example}
          </p>
          <ul className="mt-5 space-y-3.5">
            {compare.with.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-snug text-slate-700 md:text-[0.95rem]"
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900"
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
