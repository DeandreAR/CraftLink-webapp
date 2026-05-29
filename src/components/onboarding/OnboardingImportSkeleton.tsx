type OnboardingImportSkeletonProps = {
  hint: string;
};

export function OnboardingImportSkeleton({ hint }: OnboardingImportSkeletonProps) {
  return (
    <div className="space-y-4" role="status" aria-live="polite" aria-busy="true">
      <p className="text-center text-sm font-medium text-neutral-600">{hint}</p>
      <div className="animate-pulse space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="h-3 w-2/3 rounded-full bg-neutral-200" />
        <div className="h-3 w-full rounded-full bg-neutral-200" />
        <div className="h-24 rounded-xl bg-neutral-200" />
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-square rounded-lg bg-neutral-200" />
          <div className="aspect-square rounded-lg bg-neutral-200" />
          <div className="aspect-square rounded-lg bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
