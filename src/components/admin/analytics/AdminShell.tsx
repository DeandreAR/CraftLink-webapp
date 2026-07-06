import type { ReactNode } from "react";

type AdminShellProps = {
  adminEmail: string;
  generatedAt: string;
  dataSourceLabel: string;
  children: ReactNode;
};

export function AdminShell({
  adminEmail,
  generatedAt,
  dataSourceLabel,
  children,
}: AdminShellProps) {
  const generatedLabel = new Date(generatedAt).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-[#09090b]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
              CraftLink · Admin
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Analytics & consommation API
            </h1>
          </div>
          <div className="text-right text-xs text-zinc-500">
            <p>{adminEmail}</p>
            <p className="mt-0.5">Màj. {generatedLabel}</p>
            <p className="mt-1 text-zinc-600">{dataSourceLabel}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

export function AdminSection({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description?: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm text-zinc-400">{description}</p>
          ) : null}
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] ${className}`}
    >
      {children}
    </div>
  );
}

export function AdminBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "warning" | "success";
}) {
  const tones = {
    neutral: "border-zinc-700 bg-zinc-800/80 text-zinc-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
