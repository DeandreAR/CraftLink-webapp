import type { AdminActivityEvent, AdminActivityEventType } from "@/domain/adminAnalytics";
import { AdminCard, AdminSection } from "@/components/admin/analytics/AdminShell";
import { formatRelativeTime } from "@/lib/admin/formatAdminMetrics";

type AdminRecentActivityTableProps = {
  events: AdminActivityEvent[];
};

const EVENT_STYLES: Record<
  AdminActivityEventType,
  { label: string; className: string }
> = {
  signup: {
    label: "Inscription",
    className: "border-sky-500/30 bg-sky-500/10 text-sky-200",
  },
  upgrade_pro: {
    label: "Pro",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  },
  urgency_lead: {
    label: "Urgence",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  },
  api_failure: {
    label: "API",
    className: "border-red-500/30 bg-red-500/10 text-red-200",
  },
};

export function AdminRecentActivityTable({ events }: AdminRecentActivityTableProps) {
  return (
    <AdminSection
      title="Activité récente"
      description="Les 10 derniers événements significatifs (inscriptions, upgrades, urgences, erreurs API)."
    >
      <AdminCard className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Événement</th>
              <th className="px-5 py-3">Détail</th>
              <th className="px-5 py-3 text-right">Quand</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {events.map((event) => {
              const style = EVENT_STYLES[event.type];
              return (
                <tr key={event.id} className="text-zinc-300">
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.className}`}
                    >
                      {style.label}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-zinc-100">{event.title}</td>
                  <td className="px-5 py-3 text-zinc-400">{event.detail}</td>
                  <td className="px-5 py-3 text-right text-xs text-zinc-500">
                    {formatRelativeTime(event.occurredAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminCard>
    </AdminSection>
  );
}
