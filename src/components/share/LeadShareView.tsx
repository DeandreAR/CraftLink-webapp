import type { DashboardLead } from "@/domain/lead";
import type { CraftlinkPlan } from "@/domain/craftlinkPlan";
import { buildPublicPagePath } from "@/lib/onboarding/publicPageUrl";
import { clientShareWorkflowLabel } from "@/lib/leads/clientShareStatus";
import { leadDelayStatusLabel } from "@/lib/leads/formatLeadDossier";
import { formatLeadDate, formatRequestNumber } from "@/components/dashboard/leads/leadsViewShared";

type LeadShareViewProps = {
  lead: DashboardLead;
  businessName: string;
  artisanPageSlug?: string | null;
  mediaExpired: boolean;
  hadMedia: boolean;
  ownerPlan: CraftlinkPlan;
  showSubmittedBanner?: boolean;
};

const COPY = {
  title: "Suivi de votre demande",
  intro:
    "Retrouvez ici le récapitulatif de votre demande. L'artisan a bien été notifié et reviendra vers vous.",
  submittedBanner:
    "🎉 Votre demande a bien été transmise à l'artisan ! Un e-mail de confirmation vous a été envoyé.",
  progress: "Avancement",
  artisan: "Artisan",
  viewArtisanPage: "Voir la page de l'artisan",
  expiredTitle: "Fichiers expirés",
  expiredBody:
    "Fichier expiré (Limite de rétention atteinte). Passez au Plan Pro pour conserver vos fichiers jusqu'à 2 mois.",
  work: "Travaux",
  zone: "Zone",
  delay: "Délai souhaité",
  description: "Votre message",
  voice: "Message vocal",
  photos: "Photos",
  notFound: "Dossier introuvable",
  notFoundBody:
    "Ce lien n'est plus valide ou la demande a été supprimée. Contactez directement votre artisan si besoin.",
  poweredBy: "Suivi partagé via CraftLink",
};

export function LeadShareView({
  lead,
  businessName,
  artisanPageSlug,
  mediaExpired,
  hadMedia,
  showSubmittedBanner = false,
}: LeadShareViewProps) {
  const artisanHref = artisanPageSlug ? buildPublicPagePath(artisanPageSlug) : null;

  return (
    <main className="mx-auto min-h-dvh max-w-lg bg-white px-4 py-8">
      {showSubmittedBanner ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium leading-relaxed text-emerald-950"
        >
          {COPY.submittedBanner}
        </div>
      ) : (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-4 text-sm leading-relaxed text-sky-950"
        >
          {COPY.intro}
        </div>
      )}

      <header className="mb-6 border-b border-neutral-100 pb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          {COPY.title}
        </p>
        <h1 className="mt-1 text-xl font-bold text-slate-900">
          {lead.workType?.trim() || "Demande de travaux"}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {businessName} · Dossier #{formatRequestNumber(lead.requestNumber)}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Demande du {formatLeadDate(lead.createdAt, "fr")}
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {COPY.progress}
        </p>
        <p className="mt-1 text-base font-semibold text-slate-900">
          {clientShareWorkflowLabel(lead.workflowStatus)}
        </p>
      </section>

      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {COPY.artisan}
          </dt>
          <dd className="mt-0.5 font-medium text-slate-900">{businessName}</dd>
          {artisanHref ? (
            <dd className="mt-2">
              <a
                href={artisanHref}
                className="text-sm font-semibold text-[#c45c3e] underline-offset-2 hover:underline"
              >
                {COPY.viewArtisanPage}
              </a>
            </dd>
          ) : null}
        </div>
        {lead.zone?.trim() ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {COPY.zone}
            </dt>
            <dd className="mt-0.5 text-slate-800">{lead.zone}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {COPY.delay}
          </dt>
          <dd className="mt-0.5 text-slate-800">{leadDelayStatusLabel(lead.delayStatus)}</dd>
        </div>
        {lead.description?.trim() ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {COPY.description}
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap leading-relaxed text-slate-700">
              {lead.description}
            </dd>
          </div>
        ) : null}
      </dl>

      {mediaExpired && hadMedia ? (
        <div
          role="status"
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">{COPY.expiredTitle}</p>
          <p className="mt-1 leading-relaxed">{COPY.expiredBody}</p>
        </div>
      ) : null}

      {!mediaExpired && lead.voice?.audioUrl ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {COPY.voice}
          </p>
          <audio
            controls
            preload="metadata"
            src={lead.voice.audioUrl}
            className="mt-2 h-10 w-full"
          />
        </div>
      ) : null}

      {!mediaExpired && lead.photos && lead.photos.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {COPY.photos}
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {lead.photos.map((photo, index) => (
              <li key={`${photo.url}-${index}`} className="overflow-hidden rounded-lg border border-neutral-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photo.alt ?? `Photo ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-10 text-center text-[11px] text-neutral-400">{COPY.poweredBy}</p>
    </main>
  );
}

export function LeadShareNotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center bg-white px-4 py-12 text-center">
      <p className="text-lg font-bold text-slate-900">{COPY.notFound}</p>
      <p className="mt-2 text-sm text-slate-500">{COPY.notFoundBody}</p>
    </main>
  );
}
