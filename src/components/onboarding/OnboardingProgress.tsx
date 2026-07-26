type OnboardingProgressProps = {
  current: number;
  total: number;
  label: string;
};

export function OnboardingProgress({ current, total, label }: OnboardingProgressProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </p>
      <div
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-zinc-100"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-[#efa188] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
