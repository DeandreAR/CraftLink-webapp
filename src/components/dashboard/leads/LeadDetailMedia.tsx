"use client";

import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";

type LeadDetailMediaProps = {
  lead: DashboardLead;
  copy: DashboardDictionary;
};

export function LeadDetailMedia({ lead, copy }: LeadDetailMediaProps) {
  const d = copy.leads.detail;
  const hasVoice = Boolean(lead.voice?.audioUrl);
  const hasPhotos = (lead.photos?.length ?? 0) > 0;
  const description = lead.description?.trim();

  if (!hasVoice && !hasPhotos && !description) return null;

  return (
    <div className="mt-4 space-y-4 border-t border-neutral-100 pt-4">
      {description ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {d.descriptionLabel}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
            {description}
          </p>
        </div>
      ) : null}

      {hasVoice && lead.voice ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {d.voiceLabel}
          </p>
          <audio
            controls
            preload="metadata"
            src={lead.voice.audioUrl}
            className="mt-2 h-10 w-full"
          />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {d.voiceSummaryLabel}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-800">{lead.voice.summary}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-medium text-neutral-500 hover:text-neutral-800">
              {d.transcriptLabel}
            </summary>
            <p className="mt-1 whitespace-pre-wrap text-sm italic text-neutral-600">
              {lead.voice.transcript}
            </p>
          </details>
        </div>
      ) : null}

      {hasPhotos ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
            {d.photosLabel}
          </p>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {lead.photos!.map((photo, index) => (
              <li key={`${photo.url}-${index}`}>
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-lg border border-neutral-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.alt ?? `Photo ${index + 1}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
