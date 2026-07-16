import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  actions?: ReactNode;
  /** Met en avant la description sous le titre (bandeau corail). */
  highlightSubtitle?: boolean;
  /** Bandeau description plus compact sur mobile uniquement. */
  compactOnMobile?: boolean;
};

export function DashboardPageHeader({
  title,
  subtitle,
  badge,
  actions,
  highlightSubtitle = true,
  compactOnMobile = false,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={`mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${
        compactOnMobile ? "db-page-header-compact" : ""
      }`.trim()}
    >
      <div className="min-w-0 flex-1">
        <h1 className="lk-display text-2xl md:text-[1.85rem]">{title}</h1>
        {subtitle ? (
          <p
            className={
              highlightSubtitle
                ? `mt-3 rounded-2xl border border-[#EFA188]/35 bg-gradient-to-r from-[#FFF5F2] via-white to-[#FDFBF7] px-4 py-3 text-sm font-medium leading-relaxed text-[#212129] shadow-[0_8px_24px_rgba(239,161,136,0.12)] ${
                    compactOnMobile ? "db-header-banner max-md:mt-2 max-md:px-3 max-md:py-2 max-md:text-xs" : ""
                  }`
                : "mt-1 text-sm leading-relaxed db-muted"
            }
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
