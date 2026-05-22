/**
 * Illustration simplifiée du panneau « Intelligence et structure » du tunnel CraftLink.
 */

const peach = "#F8B195";

type HeroIntelligenceCopy = {
  transcriptionLabel: string;
  clientDataLabel: string;
  stepTitle: string;
  stepDescription: string;
};

type HeroIntelligencePanelProps = {
  copy: HeroIntelligenceCopy;
};

export function HeroIntelligencePanel({ copy }: HeroIntelligencePanelProps) {
  return (
    <div className="mt-10 w-full max-w-xl">
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-4 rounded-[28px] bg-gradient-to-br from-[#F8B195]/45 via-[#F8B195]/10 to-transparent blur-2xl"
          aria-hidden
        />
        <div className="relative rounded-2xl border border-black bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-5">
          {/* Ligne 1 : IA + transcription */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-2">
              <svg
                viewBox="0 0 72 64"
                className="h-14 w-[4.5rem] shrink-0 sm:h-16"
                aria-hidden
              >
                <path
                  d="M36 8c-8 0-14 5-16 12-4 0-7 3-7 7 0 3 2 6 5 7-1 2-1 4 0 6 2 5 8 8 18 8s16-3 18-8c1-2 1-4 0-6 3-1 5-4 5-7 0-4-3-7-7-7-2-7-8-12-16-12z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="text-black"
                />
                <rect
                  x="28"
                  y="22"
                  width="20"
                  height="14"
                  rx="2"
                  fill={peach}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-black"
                />
                <text
                  x="38"
                  y="32"
                  textAnchor="middle"
                  fill="black"
                  style={{ fontSize: "7px", fontWeight: 700 }}
                >
                  AI
                </text>
                <g transform="translate(48 36)">
                  <circle
                    r="6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-black"
                  />
                  <path
                    d="M4 0h2m-8 0h2M0-4v2m0 4v2"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-black"
                  />
                </g>
                <g transform="translate(58 44)">
                  <circle
                    r="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="text-black"
                  />
                  <path
                    d="M3 0h2m-7 0h2M0-3v2m0 4v2"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-black"
                  />
                </g>
              </svg>
            </div>

            <div className="min-w-[8rem] flex-1">
              <p className="text-xs font-semibold text-black sm:text-sm">
                {copy.transcriptionLabel}
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="h-1.5 rounded-full bg-neutral-200 w-full max-w-[11rem]" />
                <div className="h-1.5 rounded-full bg-neutral-200 w-4/5 max-w-[9rem]" />
                <div className="h-1.5 rounded-full bg-neutral-200 w-full max-w-[10rem]" />
                <div className="h-1.5 rounded-full bg-neutral-200 w-1/2 max-w-[5rem]" />
              </div>
            </div>
          </div>

          {/* Flèche verticale */}
          <div className="flex justify-center py-1">
            <svg
              width="16"
              height="28"
              viewBox="0 0 16 28"
              className="text-black"
              aria-hidden
            >
              <path
                d="M8 2v18M3 17l5 6 5-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Ligne 2 : onde + accolade + données */}
          <div className="flex items-end justify-between gap-2 sm:gap-4">
            <div className="flex h-12 items-end justify-center gap-0.5 pb-0.5">
              {[4, 9, 14, 11, 16, 8, 12, 6].map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-sm bg-black"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>

            <svg
              width="18"
              height="72"
              viewBox="0 0 18 72"
              className="shrink-0 text-black"
              aria-hidden
            >
              <path
                d="M14 4C6 4 4 12 4 20c0 6 4 10 8 12-4 2-8 6-8 12 0 8 2 16 10 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-black sm:text-sm">
                {copy.clientDataLabel}
              </p>
              <div className="mt-2 space-y-1.5">
                <DataBar fill={0.85} />
                <DataBar fill={0.45} />
                <DataBar fill={1} />
                <DataBar fill={0.2} />
                <DataBar fill={0.65} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-black sm:text-sm">
          {copy.stepTitle}
        </p>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-neutral-600 sm:text-sm">
          {copy.stepDescription}
        </p>
      </div>
    </div>
  );
}

function DataBar({ fill }: { fill: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-md border border-neutral-200 bg-white">
      <div
        className="h-full rounded-md bg-gradient-to-r from-[#F8B195] to-[#EFA188]"
        style={{ width: `${Math.round(fill * 100)}%` }}
      />
    </div>
  );
}
