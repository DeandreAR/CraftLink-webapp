import { GlassCard } from "@/components/ui/GlassCard";
import type { ArtisanPreview } from "@/domain/landing";

type Props = {
  preview: ArtisanPreview;
};

export function LivePreviewWidget({ preview }: Props) {
  return (
    <GlassCard rounded="2xl" className="p-6 md:p-7">
      <div className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              Live preview
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-black md:text-2xl">
              Votre profil artisan, prêt à partager
            </h3>
          </div>
          <div className="hidden rounded-2xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-neutral-700 md:block">
            craftlink.app/{preview.displayName.toLowerCase().split(" ")[0]}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
              {preview.about}
            </p>
            <div className="flex flex-wrap gap-2">
              {preview.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1 text-xs font-medium text-neutral-700"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {preview.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-3 text-center shadow-[0_10px_22px_rgba(0,0,0,0.05)]"
                >
                  <p className="text-[11px] font-medium text-neutral-600">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-[270px]">
              <div className="relative rounded-[40px] bg-black p-2 shadow-[0_22px_50px_rgba(0,0,0,0.25)]">
                <div className="rounded-[34px] bg-white">
                  <div className="flex items-center justify-between px-5 pt-4 text-[11px] font-semibold text-neutral-600">
                    <span>9:41</span>
                    <span className="h-1.5 w-16 rounded-full bg-neutral-900/10" />
                    <span>5G</span>
                  </div>

                  <div className="px-5 pb-5 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-900 text-white">
                        {preview.displayName.split(" ")[0]?.[0] ?? "C"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-neutral-900">
                          {preview.displayName}
                        </p>
                        <p className="text-xs font-medium text-neutral-600">
                          {preview.craft} · {preview.city}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="aspect-square rounded-2xl bg-[#F3F4F6]" />
                      <div className="aspect-square rounded-2xl bg-[#F3F4F6]" />
                      <div className="aspect-square rounded-2xl bg-[#F3F4F6]" />
                    </div>

                    <button
                      type="button"
                      className="mt-4 w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
                    >
                      Demander un devis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

