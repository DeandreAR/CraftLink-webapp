import type { AdminStorageSnapshot } from "@/domain/adminAnalytics";
import {
  AdminBadge,
  AdminCard,
  AdminSection,
} from "@/components/admin/analytics/AdminShell";
import { formatBytes, formatInteger, formatPercent } from "@/lib/admin/formatAdminMetrics";

type AdminStorageSectionProps = {
  storage: AdminStorageSnapshot;
};

export function AdminStorageSection({ storage }: AdminStorageSectionProps) {
  const usageWidth = Math.min(100, Math.max(0, storage.usagePercent));

  return (
    <AdminSection
      title="Stockage Supabase"
      description="Consommation du bucket gallery (photos portfolio artisans)."
      badge={
        storage.isMock ? (
          <AdminBadge tone="warning">Données mock</AdminBadge>
        ) : (
          <AdminBadge tone="success">Live Supabase</AdminBadge>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminCard>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Espace utilisé
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatBytes(storage.galleryBytes)}
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            sur {formatBytes(storage.galleryLimitBytes)} (quota gratuit)
          </p>
        </AdminCard>

        <AdminCard>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Fichiers gallery
          </p>
          <p className="mt-3 text-2xl font-semibold text-white">
            {formatInteger(storage.galleryObjectCount)}
          </p>
          <p className="mt-2 text-xs text-zinc-500">Objets dans le bucket gallery</p>
        </AdminCard>

        <AdminCard>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-500">
            Taux d&apos;occupation
          </p>
          <p className="mt-3 text-2xl font-semibold text-amber-300">
            {formatPercent(storage.usagePercent, 1)}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
              style={{ width: `${usageWidth}%` }}
            />
          </div>
        </AdminCard>
      </div>
    </AdminSection>
  );
}
