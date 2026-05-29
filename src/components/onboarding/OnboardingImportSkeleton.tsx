type OnboardingImportSkeletonProps = {
  hint: string;
};

export function OnboardingImportSkeleton({ hint }: OnboardingImportSkeletonProps) {
  return (
    <div className="space-y-5" role="status" aria-live="polite" aria-busy="true">
      <p className="text-center text-sm font-medium text-neutral-600">{hint}</p>
      <div className="animate-pulse space-y-4 rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-neutral-200" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-3 w-1/2 rounded-full bg-neutral-200" />
          </div>
        </div>
        <div className="h-3 w-full rounded-full bg-neutral-200" />
        <div className="h-3 w-5/6 rounded-full bg-neutral-200" />
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-[4/3] rounded-xl bg-neutral-200" />
          <div className="aspect-[4/3] rounded-xl bg-neutral-200" />
          <div className="aspect-[4/3] rounded-xl bg-neutral-200" />
        </div>
        <div className="h-12 rounded-full bg-neutral-200" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-10 rounded-full bg-neutral-200" />
          <div className="h-10 rounded-full bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
