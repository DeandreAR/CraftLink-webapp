import { GlassCard } from "@/components/ui/GlassCard";
import type { ArtisanPreview } from "@/domain/landing";
import type { HeroPreviewDictionary } from "@/i18n/types";

type LivePreviewWidgetProps = {
  preview: ArtisanPreview;
  labels: HeroPreviewDictionary;
  /** Mode hero : téléphone seul (largeur 270px), sans colonne texte dupliquée. */
  variant?: "full" | "hero";
};

const accent = "#EFA188";
const screenBg = "#F9FAFB";

function PreviewIcons() {
  return {
    toolbox: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <path
          d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h1zm2 0h4V6h-4v2z"
          fill={accent}
          opacity={0.92}
        />
        <path
          d="M9 14h6M12 12v4"
          stroke="white"
          strokeWidth={1.2}
          strokeLinecap="round"
        />
      </svg>
    ),
    faucet: (
      <svg viewBox="0 0 24 24" className="h-10 w-10 text-neutral-700" aria-hidden>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          d="M12 4v3M9 7h6M10 10h4v2a3 3 0 01-3 3M11 18h2M12 15v3"
        />
        <path fill={accent} d="M11 21h2v1h-2z" opacity={0.85} />
      </svg>
    ),
  };
}

function ToolMini({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={d}
      />
    </svg>
  );
}

const toolMiniPaths = [
  "M14.7 6.3a1 1 0 000 1.4l-3 3a1 1 0 01-1.4 0L5.4 5.4a1 1 0 010-1.4l1.4-1.4a1 1 0 011.4 0l5.3 5.3a1 1 0 001.4 0l3-3a1 1 0 011.4 0l1.4 1.4a1 1 0 010 1.4l-3 3",
  "M12 3v18M8 8l8 8M16 8l-8 8",
  "M4 12h16M12 4v16",
  "M9 18V6l6 6-6 6",
  "M6 8h12M6 16h12M12 8v8",
  "M8 8h8v8H8zM10 10h4v4h-4z",
];

export function LivePreviewWidget({
  preview,
  labels,
  variant = "full",
}: LivePreviewWidgetProps) {
  if (variant === "hero") {
    return (
      <GlassCard
        rounded="2xl"
        elevated={false}
        className="border border-neutral-200 bg-white p-3 shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
      >
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {labels.eyebrow}
        </p>
        <div className="mt-2 flex justify-center">
          <DemoPhoneFrame preview={preview} labels={labels} />
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard rounded="2xl" className="p-6 md:p-7">
      <div className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              {labels.eyebrow}
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-black md:text-2xl">
              {labels.title}
            </h3>
          </div>
          <div className="hidden rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-neutral-700 md:block">
            craftlink.app/{preview.displayName.toLowerCase().split(" ")[0]}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
              {labels.about}
            </p>
            <div className="flex flex-wrap gap-2">
              {labels.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {labels.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-3 text-center shadow-[0_10px_22px_rgba(0,0,0,0.05)]"
                >
                  <p className="text-[11px] font-medium text-neutral-600">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <DemoPhoneFrame preview={preview} labels={labels} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function DemoPhoneFrame({
  preview,
  labels,
}: {
  preview: ArtisanPreview;
  labels: HeroPreviewDictionary;
}) {
  const icons = PreviewIcons();
  const parts = preview.displayName.trim().split(/\s+/);
  const firstName = parts[0] ?? preview.displayName;
  const initials =
    parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "?";
  const craftShort = preview.craft.split(/\s+/)[0] ?? preview.craft;

  return (
    <div className="relative w-[270px] shrink-0 lg:-mt-10">
      <div className="relative overflow-hidden rounded-[2.45rem] shadow-[0_22px_48px_rgba(0,0,0,0.18)] ring-1 ring-neutral-900/15">
        <div className="rounded-[2.45rem] bg-neutral-900 p-[5px]">
          <div
            className="absolute left-1/2 top-[7px] z-20 h-[22px] w-[72px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden
          />
          <div
            className="relative max-h-[360px] overflow-hidden rounded-[2.05rem] pt-6"
            style={{ backgroundColor: screenBg }}
          >
            <div className="max-h-[320px] space-y-2 overflow-hidden px-2.5 pb-3 pt-0.5">
              <div className="text-center">
                <div className="relative mx-auto h-[52px] w-[52px]">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full border-2 border-white text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    {initials}
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3B82F6] ring-2 ring-white"
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5 text-white"
                      aria-hidden
                    >
                      <path
                        fill="currentColor"
                        d="M10.28 2.28L4.5 8.06l-2.78-2.78L.72 6.28l3.78 3.78 6.78-6.78-1.5-1.5z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-[13px] font-bold leading-tight text-black">
                  {firstName}
                </p>
                <p className="text-[10px] font-medium text-neutral-500">
                  {craftShort} {labels.inCity} {preview.city}
                </p>
                <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black">
                  {labels.craftlinkDemo}
                </p>
              </div>

              <div className="rounded-[1.15rem] border border-neutral-100 bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-800">
                  {labels.savoirFaire}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="shrink-0">{icons.toolbox}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <div className="flex flex-1 flex-col items-center gap-0.5">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-4 w-4 text-neutral-400"
                          aria-hidden
                        >
                          <rect
                            x="4"
                            y="5"
                            width="12"
                            height="11"
                            rx="1.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M7 3h6v2H7z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                        <span className="text-[8px] font-semibold text-neutral-600">
                          {labels.dixPlusAns}
                        </span>
                      </div>
                      <div className="h-px flex-1 bg-neutral-200" />
                      <div className="flex flex-1 flex-col items-center gap-0.5">
                        <svg
                          viewBox="0 0 20 20"
                          className="h-4 w-4"
                          style={{ color: accent }}
                          aria-hidden
                        >
                          <path
                            fill="currentColor"
                            d="M10 3l1.8 3.6 4 .6-2.9 2.8.7 4L10 14.8 6.4 14.4l.7-4L4.2 7.2l4-.6L10 3z"
                          />
                        </svg>
                        <span className="text-[8px] font-semibold text-neutral-600">
                          {labels.materiaux}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 rounded-[1.15rem] border border-neutral-100 bg-white p-2 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-800">
                  {labels.mesPrestations}
                </p>
                <div className="mt-2 flex gap-2">
                  <div className="shrink-0">{icons.faucet}</div>
                  <div className="grid flex-1 grid-cols-3 gap-1">
                    {toolMiniPaths.map((d, i) => (
                      <div
                        key={i}
                        className="flex h-8 items-center justify-center rounded-lg bg-neutral-50"
                      >
                        <ToolMini d={d} />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[4.5rem] rounded-b-[1.05rem] bg-gradient-to-b from-transparent via-white/80 to-white"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
