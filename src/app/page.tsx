import { Navbar } from "@/components/landing/Navbar";
import { MeshBackground } from "@/components/landing/MeshBackground";
import { BentoFeatureCard } from "@/components/landing/BentoFeatureCard";
import {
  IconBolt,
  IconLink,
  IconShield,
  IconSparkles,
} from "@/components/landing/Icons";
import { LivePreviewWidget } from "@/components/landing/LivePreviewWidget";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Highlighter } from "@/components/ui/Highlighter";
import { landingService } from "@/services/landingService";

export default async function Home() {
  const pillarsPromise = landingService.getPillars();
  const previewPromise = landingService.getPreview();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="relative">
        <section className="relative overflow-hidden">
          <MeshBackground intensity="normal" />

          <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 md:px-6 md:pb-20 md:pt-14">
            <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
              <div className="relative md:col-span-7">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-700">
                  <span className="h-2 w-2 rounded-full bg-[#EFA188]" />
                  Vitrine express · Artisans
                </p>

                <h1 className="mt-6 text-4xl font-bold tracking-tight text-black md:text-6xl">
                  Votre vitrine pro en{" "}
                  <Highlighter className="font-semibold" color="#EFA188" opacity={0.3}>
                    2 minutes
                  </Highlighter>
                  .
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
                  Transformez vos abonnés en demandes de devis. Une page prête à
                  partager, pensée pour artisans — simple, rapide, premium.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <GlowButton href="#cta">Créer ma vitrine</GlowButton>
                  <GlowButton href="#preview" variant="secondary">
                    Voir l’aperçu
                  </GlowButton>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Mise en place", value: "2 min" },
                    { label: "Lien unique", value: "Bio / SMS / QR" },
                    { label: "Devis", value: "Clair & cadré" },
                    { label: "Sans friction", value: "Zéro technique" },
                  ].map((k) => (
                    <GlassCard
                      key={k.label}
                      rounded="2xl"
                      elevated={false}
                      className="px-4 py-3 shadow-[0_10px_22px_rgba(0,0,0,0.06)]"
                    >
                      <p className="text-[11px] font-medium text-neutral-600">
                        {k.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {k.value}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </div>

              <div id="preview" className="md:col-span-5">
                <LivePreviewWidget preview={await previewPromise} />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
              Bento features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-black md:text-4xl">
              Tout ce qu’il faut. Rien de trop.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
              Une landing modulaire, responsive, et prête à convertir — de
              l’abonné au devis en quelques clics.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-6">
            <BentoFeatureCard
              className="md:col-span-3"
              eyebrow="Conversion"
              title="Une vitrine express"
              description="Du lien en bio à une demande de devis cadrée — sans DM perdus."
              icon={<IconSparkles className="h-5 w-5" />}
              accent="amber"
            />

            <BentoFeatureCard
              className="md:col-span-3"
              eyebrow="Express"
              title="Prêt en 2 minutes"
              description="Template premium, sections prêtes, aucune compétence technique."
              icon={<IconBolt className="h-5 w-5" />}
              accent="amber"
            />

            <BentoFeatureCard
              className="md:col-span-2"
              eyebrow="Lien"
              title="Un lien pro unique"
              description="Bio Instagram, SMS, cartes de visite: un point d’entrée unique."
              icon={<IconLink className="h-5 w-5" />}
              accent="cyan"
            />

            <BentoFeatureCard
              className="md:col-span-2"
              eyebrow="Simplicité"
              title="Zéro site complexe"
              description="Pas de builder lourd, pas d’abonnement “usine à gaz”."
              icon={<IconShield className="h-5 w-5" />}
              accent="rose"
            />

            <GlassCard
              rounded="2xl"
              className="p-6 md:col-span-2 md:p-7"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-600">
                  Mini UI preview
                </p>
                <p className="mt-4 text-lg font-bold tracking-tight text-black">
                  Devis cadrés, pas de DM perdus
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">
                  Champs courts (budget, délais, description). Vous recevez
                  l’essentiel dès le premier message.
                </p>

                <div className="mt-5 grid gap-2">
                  {[
                    "Budget estimé",
                    "Délais souhaités",
                    "Référence / style",
                    "Contact",
                  ].map((f) => (
                    <div
                      key={f}
                      className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-medium text-neutral-700"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="sr-only">
            {(await pillarsPromise).map((p) => (
              <div key={p.id}>
                {p.title} {p.description} {p.highlight}
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="relative overflow-hidden py-16">
          <MeshBackground intensity="subtle" />
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <GlassCard rounded="2xl" className="p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
                    Prêt à partager un lien qui convertit ?
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-neutral-700 md:text-lg">
                    Une vitrine pro prête en 2 minutes, sans technique. Du social
                    au devis — proprement.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <GlowButton href="#preview" variant="secondary">
                    Voir l’aperçu
                  </GlowButton>
                  <GlowButton href="#" className="min-w-[210px]">
                    Démarrer maintenant
                  </GlowButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-sm text-neutral-600 md:flex-row md:items-center md:justify-between md:px-6">
          <p className="font-medium text-neutral-700">
            © {new Date().getFullYear()} CraftLink
          </p>
          <p>Landing “Express” — Next.js + Tailwind.</p>
        </div>
      </footer>
    </div>
  );
}
