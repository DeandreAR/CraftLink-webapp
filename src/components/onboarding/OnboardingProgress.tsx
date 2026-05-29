type OnboardingProgressProps = {
  current: number;
  total: number;
  label: string;
};

export function OnboardingProgress({ current, total, label }: OnboardingProgressProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
        {label}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      >
        <div
          className="h-full rounded-full bg-[#EFA188] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
