import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
};

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="lk-display text-2xl md:text-[1.85rem]">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm leading-relaxed db-muted">{subtitle}</p>
        ) : null}
      </div>
      {(badge || actions) && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          {badge}
          {actions}
        </div>
      )}
    </header>
  );
}
