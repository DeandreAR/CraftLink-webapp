import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  /** Conservé pour compat — le sous-titre est toujours en texte muted. */
  highlightSubtitle?: boolean;
  /** Titre plus compact sur mobile. */
  compactOnMobile?: boolean;
};

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  actions,
  compactOnMobile = false,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={`mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${
        compactOnMobile ? "db-page-header-compact" : ""
      }`.trim()}
    >
      <div className="min-w-0 flex-1">
        <h1 className="lk-display text-2xl font-bold text-black md:text-[1.75rem]">
          {title}
        </h1>
        {subtitle ? (
          <p
            className={`db-header-banner mt-3 max-w-2xl text-sm leading-relaxed ${
              compactOnMobile ? "max-md:text-xs" : ""
            }`}
          >
            {subtitle}
          </p>
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
