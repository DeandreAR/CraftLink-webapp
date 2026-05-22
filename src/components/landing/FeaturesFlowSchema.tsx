import type { FeaturesFlowDictionary } from "@/i18n/types";
import { IconMic, IconMessage } from "@/components/landing/Icons";

type FeaturesFlowSchemaProps = {
  flow: FeaturesFlowDictionary;
  className?: string;
};

function FlowArrow({
  hint,
  className = "",
}: {
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={`flex shrink-0 flex-col items-center justify-center gap-1 self-center ${className}`.trim()}
      aria-hidden
    >
      <svg viewBox="0 0 40 16" fill="none" className="h-4 w-10 text-white/50">
        <path
          d="M0 8h32m0 0-4-4m4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="whitespace-nowrap rounded-full border border-[#EFA188]/40 bg-[#EFA188]/15 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#EFA188]">
        {hint}
      </span>
    </div>
  );
}

function IconInstagram({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="50%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="url(#ig-grad)"
        strokeWidth="1.8"
        fill="none"
      />
      <circle cx="12" cy="12" r="4.5" stroke="url(#ig-grad)" strokeWidth="1.8" fill="none" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="url(#ig-grad)" />
    </svg>
  );
}

function IconFacebook({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M14 8.5V6.8c0-.7.5-1.1 1.2-1.1H17V3h-2.4C12.1 3 11 4.4 11 6.5V8.5H8v2.7h3V21h3v-9.8h2.6l.4-2.7H14Z"
        fill="#1877F2"
      />
    </svg>
  );
}

function IconTikTok({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M16.5 5.2a5.8 5.8 0 0 0 3.5-1.2V8a5.5 5.5 0 0 1-3.5-1.1v6.8a4.8 4.8 0 1 1-4.8-4.8c.2 0 .5 0 .7.1v3.1a1.7 1.7 0 1 0 1.2 1.6V5.2Z"
        fill="#fff"
      />
      <path
        d="M16.5 5.2a5.8 5.8 0 0 0 3.5-1.2V8a5.5 5.5 0 0 1-3.5-1.1v6.8a4.8 4.8 0 1 1-4.8-4.8c.2 0 .5 0 .7.1v3.1a1.7 1.7 0 1 0 1.2 1.6V5.2Z"
        fill="#FE2C55"
        fillOpacity="0.9"
      />
    </svg>
  );
}

function IconQr({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h2v2h-2zm4 0h3v3h-3zm-3 4h3v3h-3zm4-4v7" />
    </svg>
  );
}

function IconWhatsApp({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#25D366"
        d="M12 2C6.5 2 2 6.1 2 11.4c0 1.9.5 3.7 1.4 5.3L2 22l5.6-1.5A9.7 9.7 0 0 0 12 20.8C17.5 20.8 22 16.7 22 11.4S17.5 2 12 2Zm5.4 13.5c-.2.6-1.1 1.1-1.5 1.2-.4 0-.9.2-3-1.1-2.5-1.3-4.1-4.5-4.2-4.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.7.8 1.8.1.1.1.3 0 .4-.1.2-.2.3-.3.4-.1.1-.2.2-.1.4.1.2.5.8 1.1 1.3.8.7 1.4.9 1.6 1 .2.1.3.1.4-.1.1-.2.6-.7.7-1 .1-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.3.2.3.4 0 .1-.1.5-.3 1.1Z"
      />
    </svg>
  );
}

function FunnelArrows() {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      aria-hidden
      className="absolute -right-1 top-1/2 h-14 w-12 -translate-y-1/2 text-white/40"
    >
      <path
        d="M4 8C18 14 28 20 40 28M4 28C18 32 28 36 40 40M4 48C18 42 28 38 40 32"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FeaturesFlowSchema({ flow, className = "" }: FeaturesFlowSchemaProps) {
  return (
    <figure
      className={`landing-features-flow mt-8 ${className}`.trim()}
      aria-label={flow.figureAlt}
    >
      <div className="overflow-x-auto rounded-[1.5rem] border border-neutral-800/20 bg-neutral-950 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] md:p-6">
        <div className="flex min-w-[52rem] items-stretch gap-2 md:gap-3">
          {/* 1 — Sources */}
          <div className="flex w-[11.5rem] shrink-0 flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
              {flow.step1.label}
            </p>
            <div className="relative mt-3 flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-5">
              <div className="grid grid-cols-3 gap-2.5">
                <IconInstagram />
                <IconFacebook />
                <IconTikTok />
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/80">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M7 11v-1.5A4.5 4.5 0 0 1 14 7.5V6M11 4.5 13.5 2 16 4.5 18.5 2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 14h6l1 4H8l1-4Z" strokeLinejoin="round" />
                  </svg>
                </span>
                <IconQr className="h-7 w-7 text-white/80" />
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 text-[9px] font-semibold text-white/70">
                  SMS
                </span>
              </div>
              <FunnelArrows />
            </div>
          </div>

          <FlowArrow hint={flow.arrowHints[0]} />

          {/* 2 — Lien central */}
          <div className="flex w-[10.5rem] shrink-0 flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
              {flow.step2.label}
            </p>
            <div className="mt-3 flex flex-1 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4">
              <div className="w-[5.5rem] rounded-[1.1rem] border-2 border-white/60 p-1.5">
                <div className="rounded-lg border border-white/20 bg-neutral-900 px-1.5 py-2">
                  <p className="text-center text-[8px] font-bold tracking-wide text-white">
                    {flow.step2.bioLink}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-1">
                    <div className="flex flex-col items-center gap-0.5 rounded border border-white/25 bg-white/5 px-1 py-1.5">
                      <IconMic className="h-3 w-3 text-white" />
                      <span className="text-[6px] font-bold text-white/90">
                        {flow.step2.vocal}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 rounded border border-white/25 bg-white/5 px-1 py-1.5">
                      <IconMessage className="h-3 w-3 text-white" />
                      <span className="text-[6px] font-bold text-white/90">
                        {flow.step2.text}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FlowArrow hint={flow.arrowHints[1]} />

          {/* 3 — Contacts */}
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
              {flow.step3.label}
            </p>
            <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/10 px-2.5 py-1.5">
                <span className="text-[8px] font-bold uppercase tracking-wider text-white">
                  {flow.step3.contactsTitle}
                </span>
                <span className="rounded border border-white/20 px-1.5 py-0.5 text-[6px] font-semibold text-white/70">
                  {flow.step3.addContact}
                </span>
              </div>
              <table className="w-full text-left text-[6px] text-white/80">
                <thead>
                  <tr className="border-b border-white/10 text-white/50">
                    <th className="px-2 py-1 font-semibold">{flow.step3.colName}</th>
                    <th className="px-1 py-1 font-semibold">{flow.step3.colPhone}</th>
                    <th className="px-1 py-1 font-semibold">{flow.step3.colSource}</th>
                    <th className="px-1 py-1 font-semibold">{flow.step3.colLast}</th>
                  </tr>
                </thead>
                <tbody>
                  {flow.contactRows.map((row) => (
                    <tr key={row.name} className="border-b border-white/5">
                      <td className="px-2 py-0.5 font-medium text-white">{row.name}</td>
                      <td className="px-1 py-0.5 whitespace-nowrap">{row.phone}</td>
                      <td className="px-1 py-0.5">{row.source}</td>
                      <td className="px-1 py-0.5 text-white/50">{row.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-auto border-t border-white/10 px-2 py-1 text-[6px] text-white/40">
                {flow.step3.pagination}
              </p>
            </div>
          </div>

          <FlowArrow hint={flow.arrowHints[2]} />

          {/* 4 — Action */}
          <div className="flex w-[9.5rem] shrink-0 flex-col">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">
              {flow.step4.label}
            </p>
            <div className="mt-3 flex flex-1 flex-wrap items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-4">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/80"
                title={flow.step4.toolbox}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 14l6-6 4 4 6-6 2 2-8 8-4-4-6 6-2-2Z" strokeLinecap="round" />
                  <rect x="3" y="17" width="8" height="4" rx="1" />
                </svg>
              </span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80"
                title={flow.step4.technician}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="7" r="3" />
                  <path d="M6 20v-1a6 6 0 0 1 12 0v1" strokeLinecap="round" />
                  <path d="M9 11h6" strokeLinecap="round" />
                </svg>
              </span>
              <IconWhatsApp className="h-8 w-8" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/5 text-[8px] font-bold text-white">
                SMS
              </span>
              <IconMessage className="h-6 w-6 text-white/70" />
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path
                  d="M6.5 4.5h11c1.1 0 2 .9 2 2v7.5c0 1.1-.9 2-2 2h-2l-3.5 3.5V17H6.5c-1.1 0-2-.9-2-2V6.5c0-1.1.9-2 2-2Z"
                  strokeLinejoin="round"
                />
              </svg>
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/70" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path
                  d="M6 4.5h3.5L12 10l-2.5 2A11 11 0 0 0 14 18.5L16 16h4.5a2 2 0 0 1 2 2v1.5A14.5 14.5 0 0 1 3 7a2 2 0 0 1 2-2.5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="sr-only">{flow.figureAlt}</figcaption>
    </figure>
  );
}
